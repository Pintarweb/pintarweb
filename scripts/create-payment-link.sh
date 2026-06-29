#!/bin/bash
# Create a Razorpay payment link for PintarWeb subscription
# Usage:
#   bash scripts/create-payment-link.sh "Customer Name" "0123456789" "PWT-001"       # live mode
#   bash scripts/create-payment-link.sh "Customer Name" "0123456789" "PWT-001" test  # test mode
#
# Requires RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env (or RAZORPAY_TEST_* for test mode)

set -e

CUSTOMER_NAME="${1:-}"
CUSTOMER_PHONE="${2:-}"
REFERENCE_ID="${3:-}"
MODE="${4:-live}"

if [ -z "$CUSTOMER_NAME" ] || [ -z "$CUSTOMER_PHONE" ] || [ -z "$REFERENCE_ID" ]; then
    echo "Usage: bash scripts/create-payment-link.sh \"Customer Name\" \"0123456789\" \"PWT-001\" [test]"
    echo ""
    echo "Arguments:"
    echo "  1. Customer name"
    echo "  2. Phone number (Malaysia format, e.g. 60123456789)"
    echo "  3. Reference ID (e.g. PWT-001)"
    echo "  4. Mode (optional: 'live' or 'test', default: live)"
    exit 1
fi

# Load .env if exists
if [ -f "$(dirname "$0")/../.env" ]; then
    export $(grep -v '^#' "$(dirname "$0")/../.env" | xargs)
fi

if [ "$MODE" = "test" ]; then
    KEY_ID="${RAZORPAY_TEST_KEY_ID:-}"
    KEY_SECRET="${RAZORPAY_TEST_KEY_SECRET:-}"
    API_URL="https://api.razorpay.com/v1"
    echo "Using TEST mode (no real payments)"
else
    KEY_ID="${RAZORPAY_KEY_ID:-}"
    KEY_SECRET="${RAZORPAY_KEY_SECRET:-}"
    API_URL="https://api.razorpay.com/v1"
fi

if [ -z "$KEY_ID" ] || [ -z "$KEY_SECRET" ]; then
    echo "Error: API keys not found in .env"
    if [ "$MODE" = "test" ]; then
        echo "Set RAZORPAY_TEST_KEY_ID and RAZORPAY_TEST_KEY_SECRET"
    else
        echo "Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET"
    fi
    exit 1
fi

echo "Creating payment link for $CUSTOMER_NAME ($REFERENCE_ID)..."

RESPONSE=$(curl -s -X POST "$API_URL/payment_links" \
    -u "$KEY_ID:$KEY_SECRET" \
    -H "Content-Type: application/json" \
    -d "{
        \"amount\": 44700,
        \"currency\": \"MYR\",
        \"description\": \"PintarWeb Subscription - 3 Months (3+1 bonus)\",
        \"reference_id\": \"$REFERENCE_ID\",
        \"customer\": {
            \"name\": \"$CUSTOMER_NAME\",
            \"contact\": \"$CUSTOMER_PHONE\"
        },
        \"notify\": {
            \"sms\": true,
            \"email\": false
        },
        \"reminder_enable\": true,
        \"notes\": {
            \"business\": \"PintarWeb\",
            \"plan\": \"3-Month Subscription\"
        }
    }")

SHORT_URL=$(echo "$RESPONSE" | grep -o '"short_url":"[^"]*"' | cut -d'"' -f4)
PAYMENT_LINK_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$SHORT_URL" ]; then
    echo ""
    echo "✅ Payment link created!"
    echo ""
    echo "Customer: $CUSTOMER_NAME"
    echo "Reference: $REFERENCE_ID"
    echo "Amount: RM 447.00"
    echo "Mode: $MODE"
    echo ""
    echo "Payment Link: $SHORT_URL"
    echo "Link ID: $PAYMENT_LINK_ID"
    echo ""
else
    echo "❌ Error creating payment link"
    echo "$RESPONSE"
    exit 1
fi
