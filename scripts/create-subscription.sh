#!/bin/bash
# Create Razorpay subscription for a customer
# Usage: bash scripts/create-subscription.sh "[lead-id]" "[monthly|quarterly|biannual|annual]"
#
# Examples:
#   bash scripts/create-subscription.sh "ah-seng-plumbing-20260629" "monthly"
#   bash scripts/create-subscription.sh "demo-kl-electrical-20260629" "quarterly"

set -e

# Load .env if exists
if [ -f "$(dirname "$0")/../.env" ]; then
    export $(grep -v '^#' "$(dirname "$0")/../.env" | xargs)
fi

D1_DB_ID="${CLOUDFLARE_D1_DATABASE_ID:-}"
RAZORPAY_KEY_ID="${RAZORPAY_KEY_ID:-}"
RAZORPAY_KEY_SECRET="${RAZORPAY_KEY_SECRET:-}"
RAZORPAY_PLAN_MONTHLY="${RAZORPAY_PLAN_MONTHLY:-}"
RAZORPAY_PLAN_QUARTERLY="${RAZORPAY_PLAN_QUARTERLY:-}"
RAZORPAY_PLAN_BIANNUAL="${RAZORPAY_PLAN_BIANNUAL:-}"
RAZORPAY_PLAN_ANNUAL="${RAZORPAY_PLAN_ANNUAL:-}"

if [ -z "$D1_DB_ID" ]; then
    echo "Error: CLOUDFLARE_D1_DATABASE_ID not found in .env"
    exit 1
fi

if [ -z "$RAZORPAY_KEY_ID" ] || [ -z "$RAZORPAY_KEY_SECRET" ]; then
    echo "Error: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not found in .env"
    exit 1
fi

if [ -z "$RAZORPAY_PLAN_MONTHLY" ]; then
    echo "Error: RAZORPAY_PLAN_MONTHLY not found in .env. Run scripts/create-razorpay-plans.sh first."
    exit 1
fi

LEAD_ID="${1:-}"
PLAN_TYPE="${2:-monthly}"

if [ -z "$LEAD_ID" ]; then
    echo "Usage: bash scripts/create-subscription.sh \"[lead-id]\" \"[monthly|quarterly|biannual|annual]\""
    echo ""
    echo "Arguments:"
    echo "  1. Lead ID (e.g., ah-seng-plumbing-20260629)"
    echo "  2. Plan type: monthly, quarterly, biannual, annual"
    echo ""
    echo "Default plan: monthly"
    exit 1
fi

# Map plan type to Razorpay plan IDs and amounts
case "$PLAN_TYPE" in
    monthly)
        PLAN_ID="$RAZORPAY_PLAN_MONTHLY"
        PLAN_AMOUNT=14900
        PLAN_INTERVAL="month"
        PLAN_DISPLAY="Monthly (RM149/month)"
        ;;
    quarterly)
        PLAN_ID="$RAZORPAY_PLAN_QUARTERLY"
        PLAN_AMOUNT=41700
        PLAN_INTERVAL="month"
        PLAN_DISPLAY="Quarterly (RM417/3 months)"
        ;;
    biannual|6month)
        PLAN_ID="$RAZORPAY_PLAN_BIANNUAL"
        PLAN_AMOUNT=77400
        PLAN_INTERVAL="month"
        PLAN_DISPLAY="Bi-annual (RM774/6 months)"
        ;;
    annual|yearly)
        PLAN_ID="$RAZORPAY_PLAN_ANNUAL"
        PLAN_AMOUNT=130800
        PLAN_INTERVAL="year"
        PLAN_DISPLAY="Annual (RM1,308/year)"
        ;;
    *)
        echo "Error: Unknown plan type: $PLAN_TYPE"
        echo "Valid options: monthly, quarterly, biannual, annual"
        exit 1
        ;;
esac

# Get lead info from D1
LEAD_DATA=$(cd "$(dirname "$0")/.." && npx wrangler d1 execute "$D1_DB_ID" --remote --yes --command="SELECT business_name, contact_name, phone, invoice_number FROM outreach_leads WHERE id = '$LEAD_ID';" 2>/dev/null | tail -n +2)

if [ -z "$LEAD_DATA" ]; then
    echo "Error: Lead not found: $LEAD_ID"
    exit 1
fi

BUSINESS_NAME=$(echo "$LEAD_DATA" | awk -F'|' '{print $1}' | tr -d '"' | tr -d '|')
CONTACT_NAME=$(echo "$LEAD_DATA" | awk -F'|' '{print $2}' | tr -d '"' | tr -d '|')
PHONE=$(echo "$LEAD_DATA" | awk -F'|' '{print $3}' | tr -d '"' | tr -d '|')
INVOICE_NUMBER=$(echo "$LEAD_DATA" | awk -F'|' '{print $4}' | tr -d '"' | tr -d '|')

echo "Creating subscription for $LEAD_ID..."
echo "  Business: $BUSINESS_NAME"
echo "  Contact: $CONTACT_NAME"
echo "  Phone: $PHONE"
echo "  Plan: $PLAN_DISPLAY"
echo ""

# Clean phone
PHONE_CLEAN=$(echo "$PHONE" | tr -cd '[:digit:]')

# Create subscription using Razorpay Plans API
SUBSCRIPTION_RESPONSE=$(curl -s -X POST "https://api.razorpay.com/v1/subscriptions" \
    -u "$RAZORPAY_KEY_ID:$RAZORPAY_KEY_SECRET" \
    -H "Content-Type: application/json" \
    -d "{
        \"plan_id\": \"$PLAN_ID\",
        \"customer\": {
            \"name\": \"$CONTACT_NAME\",
            \"contact\": \"$PHONE_CLEAN\",
            \"email\": \"\"
        },
        \"total_count\": 12,
        \"quantity\": 1,
        \"start_at\": $(date +%s),
        \"notes\": {
            \"lead_id\": \"$LEAD_ID\",
            \"business_name\": \"$BUSINESS_NAME\",
            \"invoice\": \"$INVOICE_NUMBER\"
        }
    }" 2>/dev/null)

# Check if subscription was created
if echo "$SUBSCRIPTION_RESPONSE" | grep -q '"id"'; then
    SUBSCRIPTION_ID=$(echo "$SUBSCRIPTION_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    AUTHORIZATION_URL=$(echo "$SUBSCRIPTION_RESPONSE" | grep -o '"authorization_url":"[^"]*"' | cut -d'"' -f4)

    echo "✅ Subscription created!"
    echo "  Subscription ID: $SUBSCRIPTION_ID"
    echo "  Authorization URL: $AUTHORIZATION_URL"
    echo ""

    # Update D1
    SUBSCRIPTION_START=$(date -d "+1 month" +"%Y-%m-%d" 2>/dev/null || date -v+1m +"%Y-%m-%d")
    cd "$(dirname "$0")/.." && npx wrangler d1 execute "$D1_DB_ID" --remote --yes --command="
    UPDATE outreach_leads SET
        subscription_id = '$SUBSCRIPTION_ID',
        plan_type = '$PLAN_TYPE',
        subscription_start = '$SUBSCRIPTION_START',
        subscription_status = 'pending',
        status = 'subscription_active',
        updated_at = datetime('now')
    WHERE id = '$LEAD_ID';
    "

    # Record event
    EVENT_ID="${LEAD_ID}-subscription-$(date +%s)"
    cd "$(dirname "$0")/.." && npx wrangler d1 execute "$D1_DB_ID" --remote --yes --command="
    INSERT INTO outreach_events (id, lead_id, event_type, metadata)
    VALUES ('$EVENT_ID', '$LEAD_ID', 'subscription_created', '{\"plan\": \"$PLAN_TYPE\", \"subscription_id\": \"$SUBSCRIPTION_ID\"}');
    "

    echo "✅ D1 updated"

    # Generate WhatsApp message with authorization link
    WHATSAPP_MSG="Hi $CONTACT_NAME! Subscription PintarWeb awak dah aktif.

Plan: $PLAN_DISPLAY
Start Date: $SUBSCRIPTION_START
Billing: Auto-renew setiap $PLAN_INTERVAL

Untuk authorize recurring payment, boleh click link ni:
$AUTHORIZATION_URL

Lepas authorize, semua settlement akan auto-debit. Tak payah buat apa-apa dah lepas tu.

Ada apa-apa boleh WhatsApp saya.

- PintarWeb"

    WHATSAPP_ENCODED=$(echo "$WHATSAPP_MSG" | python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.stdin.read()))" 2>/dev/null || echo "$WHATSAPP_MSG" | sed 's/ /%20/g' | tr '\n' '%0A')
    WHATSAPP_URL="https://wa.me/$PHONE_CLEAN?text=$WHATSAPP_ENCODED"

    echo ""
    echo "📱 WhatsApp Confirmation:"
    echo "$WHATSAPP_MSG"
    echo ""
    echo "🔗 WhatsApp URL: $WHATSAPP_URL"
    echo ""
    echo "═══════════════════════════════════════════════"
    echo "✅ Subscription setup complete!"
    echo "═══════════════════════════════════════════════"
    echo ""
    echo "Next steps:"
    echo "  1. Send authorization link to customer via WhatsApp"
    echo "  2. Customer authorizes recurring payment"
    echo "  3. Subscription becomes 'active'"
    echo "  4. Run bash scripts/check-subscription.sh to verify status"

else
    echo "❌ Error creating subscription"
    echo "$SUBSCRIPTION_RESPONSE"
    exit 1
fi
