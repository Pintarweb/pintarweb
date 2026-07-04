#!/bin/bash
# Create Razorpay subscription plans for PintarWeb
# Run ONCE to create plans, then add plan IDs to .env
# Usage: bash scripts/create-razorpay-plans.sh

set -e

if [ -f "$(dirname "$0")/../.env" ]; then
    export $(grep -v '^#' "$(dirname "$0")/../.env" | xargs)
fi

KEY_ID="${RAZORPAY_KEY_ID:-}"
KEY_SECRET="${RAZORPAY_KEY_SECRET:-}"
API_URL="https://api.razorpay.com/v1"

if [ -z "$KEY_ID" ] || [ -z "$KEY_SECRET" ]; then
    echo "Error: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not found in .env"
    exit 1
fi

echo "Creating PintarWeb Razorpay plans..."
echo ""

RESULT_FILE="$(dirname "$0")/../.razorpay-plans-temp.txt"
> "$RESULT_FILE"

# Razorpay plans API uses period: daily|weekly|monthly|yearly
# Use interval to multiply the period (e.g. interval=3 with period=monthly = quarterly)
declare -A CONFIGS
CONFIGS["monthly"]='{"period":"monthly","interval":1,"item_name":"PintarWeb Monthly","amount":14900}'
CONFIGS["quarterly"]='{"period":"monthly","interval":3,"item_name":"PintarWeb Quarterly","amount":41700}'
CONFIGS["biannual"]='{"period":"monthly","interval":6,"item_name":"PintarWeb Bi-Annual","amount":77400}'
CONFIGS["annual"]='{"period":"yearly","interval":1,"item_name":"PintarWeb Annual","amount":130800}'

for PLAN in monthly quarterly biannual annual; do
    CONFIG="${CONFIGS[$PLAN]}"
    PERIOD=$(echo "$CONFIG" | jq -r '.period')
    INTERVAL=$(echo "$CONFIG" | jq -r '.interval')
    ITEM_NAME=$(echo "$CONFIG" | jq -r '.item_name')
    AMOUNT=$(echo "$CONFIG" | jq -r '.amount')

    echo "Creating plan: $ITEM_NAME..."

    RESPONSE=$(curl -s -X POST "$API_URL/plans" \
        -u "$KEY_ID:$KEY_SECRET" \
        -H "Content-Type: application/json" \
        -d "{
            \"period\": \"$PERIOD\",
            \"interval\": $INTERVAL,
            \"item\": {
                \"name\": \"$ITEM_NAME\",
                \"amount\": $AMOUNT,
                \"currency\": \"MYR\",
                \"description\": \"PintarWeb Subscription - $ITEM_NAME\"
            },
            \"notes\": {
                \"plan\": \"$PLAN\"
            }
        }")

    if echo "$RESPONSE" | grep -q '"id"'; then
        PLAN_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
        echo "  ✅ Created: $PLAN_ID"
        case "$PLAN" in
            monthly)   ENV_KEY="RAZORPAY_PLAN_MONTHLY" ;;
            quarterly)  ENV_KEY="RAZORPAY_PLAN_QUARTERLY" ;;
            biannual)  ENV_KEY="RAZORPAY_PLAN_BIANNUAL" ;;
            annual)     ENV_KEY="RAZORPAY_PLAN_ANNUAL" ;;
        esac
        echo "$ENV_KEY=$PLAN_ID" >> "$RESULT_FILE"
    else
        echo "  ❌ Error: $(echo $RESPONSE | head -c 300)"
    fi
    echo ""
done

echo ""
echo "═══════════════════════════════════════════════"
echo "Copy these to your .env file:"
echo "═══════════════════════════════════════════════"
cat "$RESULT_FILE"
echo ""
echo "⚠️  Add these to .env before using subscriptions."
rm "$RESULT_FILE"
