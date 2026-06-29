#!/bin/bash
# Check Razorpay subscription status and update D1
# Usage: bash scripts/check-subscription.sh "[lead-id]"
#
# If no lead-id provided, checks all leads with subscription_id

set -e

# Load .env if exists
if [ -f "$(dirname "$0")/../.env" ]; then
    export $(grep -v '^#' "$(dirname "$0")/../.env" | xargs)
fi

D1_DB_ID="${CLOUDFLARE_D1_DATABASE_ID:-}"
RAZORPAY_KEY_ID="${RAZORPAY_KEY_ID:-}"
RAZORPAY_KEY_SECRET="${RAZORPAY_KEY_SECRET:-}"

if [ -z "$D1_DB_ID" ]; then
    echo "Error: CLOUDFLARE_D1_DATABASE_ID not found in .env"
    exit 1
fi

if [ -z "$RAZORPAY_KEY_ID" ] || [ -z "$RAZORPAY_KEY_SECRET" ]; then
    echo "Error: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not found in .env"
    exit 1
fi

echo "═══════════════════════════════════════════════"
echo "       PINTARWEB SUBSCRIPTION CHECKER"
echo "═══════════════════════════════════════════════"
echo ""

if [ -n "${1:-}" ]; then
    # Check single lead
    LEAD_ID="$1"
    SUBSCRIPTIONS=$(cd "$(dirname "$0")/.." && npx wrangler d1 execute "$D1_DB_ID" --remote --yes --command="SELECT id, business_name, subscription_id, plan_type, subscription_status FROM outreach_leads WHERE id = '$LEAD_ID' AND subscription_id IS NOT NULL;" 2>/dev/null | tail -n +2)
else
    # Check all leads with subscriptions
    SUBSCRIPTIONS=$(cd "$(dirname "$0")/.." && npx wrangler d1 execute "$D1_DB_ID" --remote --yes --command="SELECT id, business_name, subscription_id, plan_type, subscription_status FROM outreach_leads WHERE subscription_id IS NOT NULL;" 2>/dev/null | tail -n +2)
fi

if [ -z "$SUBSCRIPTIONS" ] || [ "$SUBSCRIPTIONS" = "[]" ]; then
    echo "No subscriptions found to check."
    exit 0
fi

COUNT=0
UPDATED=0

while IFS= read -r line; do
    if [ -z "$line" ] || [ "$line" = "NULL" ]; then
        continue
    fi

    LEAD_ID=$(echo "$line" | awk -F'|' '{print $1}' | tr -d ' "')
    BUSINESS_NAME=$(echo "$line" | awk -F'|' '{print $2}' | tr -d ' "')
    SUBSCRIPTION_ID=$(echo "$line" | awk -F'|' '{print $3}' | tr -d ' "')
    PLAN_TYPE=$(echo "$line" | awk -F'|' '{print $4}' | tr -d ' "')
    CURRENT_STATUS=$(echo "$line" | awk -F'|' '{print $5}' | tr -d ' "')

    if [ -z "$SUBSCRIPTION_ID" ] || [ "$SUBSCRIPTION_ID" = "NULL" ]; then
        continue
    fi

    echo "─────────────────────────────────────────────"
    echo "Lead: $LEAD_ID ($BUSINESS_NAME)"
    echo "Subscription ID: $SUBSCRIPTION_ID"
    echo "Current Status: $CURRENT_STATUS"
    echo ""

    # Query Razorpay for subscription status
    SUBSCRIPTION_STATUS=$(curl -s -X GET "https://api.razorpay.com/v1/subscriptions/$SUBSCRIPTION_ID" \
        -u "$RAZORPAY_KEY_ID:$RAZORPAY_KEY_SECRET" \
        -H "Content-Type: application/json" 2>/dev/null)

    if echo "$SUBSCRIPTION_STATUS" | grep -q '"status"'; then
        RAZORPAY_STATUS=$(echo "$SUBSCRIPTION_STATUS" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
        RAZORPAY_PLAN=$(echo "$SUBSCRIPTION_STATUS" | grep -o '"plan_id":"[^"]*"' | cut -d'"' -f4)
        RAZORPAY_CURRENT_TERM=$(echo "$SUBSCRIPTION_STATUS" | grep -o '"current_term_end":[0-9]*' | cut -d':' -f2)
        RAZORPAY_REMAINING=$(echo "$SUBSCRIPTION_STATUS" | grep -o '"remaining_count":[0-9]*' | cut -d':' -f2)

        if [ -n "$RAZORPAY_CURRENT_TERM" ] && [ "$RAZORPAY_CURRENT_TERM" != "null" ]; then
            CURRENT_TERM_DATE=$(date -d "@$RAZORPAY_CURRENT_TERM" "+%Y-%m-%d" 2>/dev/null || echo "$RAZORPAY_CURRENT_TERM")
        else
            CURRENT_TERM_DATE="N/A"
        fi

        echo "  Razorpay Status: $RAZORPAY_STATUS"
        echo "  Plan: $RAZORPAY_PLAN"
        echo "  Current Term Ends: $CURRENT_TERM_DATE"
        echo "  Remaining: $RAZORPAY_REMAINING cycles"
        echo ""

        # Map Razorpay status to our status
        case "$RAZORPAY_STATUS" in
            active)
                NEW_STATUS="active"
                ;;
            paused)
                NEW_STATUS="paused"
                ;;
            cancelled|expired)
                NEW_STATUS="cancelled"
                ;;
            pending)
                NEW_STATUS="pending"
                ;;
            *)
                NEW_STATUS="$CURRENT_STATUS"
                ;;
        esac

        if [ "$NEW_STATUS" != "$CURRENT_STATUS" ]; then
            echo "  → Updating status: $CURRENT_STATUS → $NEW_STATUS"

            cd "$(dirname "$0")/.." && npx wrangler d1 execute "$D1_DB_ID" --remote --yes --command="
            UPDATE outreach_leads SET
                subscription_status = '$NEW_STATUS',
                updated_at = datetime('now')
            WHERE id = '$LEAD_ID';
            "

            # Record status change event
            EVENT_ID="${LEAD_ID}-subscription-status-$(date +%s)"
            cd "$(dirname "$0")/.." && npx wrangler d1 execute "$D1_DB_ID" --remote --yes --command="
            INSERT INTO outreach_events (id, lead_id, event_type, metadata)
            VALUES ('$EVENT_ID', '$LEAD_ID', 'subscription_status_changed', '{\"from\": \"$CURRENT_STATUS\", \"to\": \"$NEW_STATUS\", \"razorpay_status\": \"$RAZORPAY_STATUS\"}');
            "

            UPDATED=$((UPDATED + 1))
        else
            echo "  → Status unchanged: $CURRENT_STATUS"
        fi

        # Record check event
        EVENT_ID="${LEAD_ID}-subscription-check-$(date +%s)"
        cd "$(dirname "$0")/.." && npx wrangler d1 execute "$D1_DB_ID" --remote --yes --command="
        INSERT INTO outreach_events (id, lead_id, event_type, metadata)
        VALUES ('$EVENT_ID', '$LEAD_ID', 'subscription_checked', '{\"razorpay_status\": \"$RAZORPAY_STATUS\", \"remaining\": $RAZORPAY_REMAINING}');
        "

    else
        echo "  ⚠️ Could not fetch status from Razorpay"
        echo "  Response: $(echo $SUBSCRIPTION_STATUS | head -c 200)"
    fi

    echo ""
    COUNT=$((COUNT + 1))

done <<< "$SUBSCRIPTIONS"

echo "═══════════════════════════════════════════════"
echo "✅ Checked $COUNT subscription(s), updated $UPDATED"
echo "═══════════════════════════════════════════════"
