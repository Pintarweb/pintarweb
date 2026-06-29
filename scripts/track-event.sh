#!/bin/bash
# Track an outreach event for a lead
# Usage: bash scripts/track-event.sh "lead-id" "event-type" [--notes "..."]
#
# Event types:
#   demo_sent      - Demo website sent via WhatsApp
#   audit_sent     - Audit report sent via WhatsApp
#   wa_clicked     - Prospect clicked WhatsApp link
#   demo_viewed    - Prospect viewed demo website
#   audit_viewed   - Prospect viewed audit report
#   replied        - Prospect replied to message
#   payment_link_sent - Razorpay payment link sent
#   paid           - Payment received
#   closed         - Deal closed (signed up)
#   bounced        - Lead invalid/undeliverable

set -e

# Load .env if exists
if [ -f "$(dirname "$0")/../.env" ]; then
    export $(grep -v '^#' "$(dirname "$0")/../.env" | xargs)
fi

D1_DB_ID="${CLOUDFLARE_D1_DATABASE_ID:-}"

if [ -z "$D1_DB_ID" ]; then
    echo "Error: CLOUDFLARE_D1_DATABASE_ID not found in .env"
    exit 1
fi

LEAD_ID="${1:-}"
EVENT_TYPE="${2:-}"
NOTES="${3:-}"

VALID_EVENTS="demo_sent|audit_sent|wa_clicked|demo_viewed|audit_viewed|replied|payment_link_sent|paid|closed|bounced"

if [ -z "$LEAD_ID" ] || [ -z "$EVENT_TYPE" ]; then
    echo "Usage: bash scripts/track-event.sh \"lead-id\" \"event-type\" [--notes \"...\"]"
    echo ""
    echo "Event types:"
    echo "  demo_sent         - Demo website sent"
    echo "  audit_sent        - Audit report sent"
    echo "  wa_clicked        - WhatsApp link clicked"
    echo "  demo_viewed       - Demo website viewed"
    echo "  audit_viewed      - Audit report viewed"
    echo "  replied          - Prospect replied"
    echo "  payment_link_sent - Payment link sent"
    echo "  paid              - Payment received"
    echo "  closed            - Deal closed"
    echo "  bounced           - Lead invalid"
    exit 1
fi

# Validate event type
if [[ ! "$EVENT_TYPE" =~ ^($VALID_EVENTS)$ ]]; then
    echo "Error: Invalid event type: $EVENT_TYPE"
    echo "Valid types: $VALID_EVENTS"
    exit 1
fi

# Generate event ID
EVENT_ID="${LEAD_ID}-${EVENT_TYPE}-$(date +%s)"

# Escape notes
NOTES_ESCAPED=$(echo "$NOTES" | sed "s/'/''/g")
METADATA="{\"notes\": \"$NOTES_ESCAPED\"}"

# Insert event
cd "$(dirname "$0")/.." && npx wrangler d1 execute "$D1_DB_ID" --remote --yes --command="
INSERT INTO outreach_events (id, lead_id, event_type, metadata)
VALUES ('$EVENT_ID', '$LEAD_ID', '$EVENT_TYPE', '$METADATA');
"

# Update lead status based on event
case "$EVENT_TYPE" in
    demo_sent|audit_sent)
        NEW_STATUS="contacted"
        ;;
    demo_viewed|audit_viewed)
        NEW_STATUS="demo_viewed"
        ;;
    wa_clicked)
        NEW_STATUS="wa_clicked"
        ;;
    replied)
        NEW_STATUS="replied"
        ;;
    payment_link_sent)
        NEW_STATUS="replied"
        ;;
    paid)
        NEW_STATUS="paid"
        ;;
    closed)
        NEW_STATUS="closed"
        ;;
    bounced)
        NEW_STATUS="bounced"
        ;;
esac

if [ -n "$NEW_STATUS" ]; then
    cd "$(dirname "$0")/.." && npx wrangler d1 execute "$D1_DB_ID" --remote --yes --command="
    UPDATE outreach_leads
    SET status = '$NEW_STATUS', updated_at = datetime('now')
    WHERE id = '$LEAD_ID';
    "
fi

echo "✅ Event tracked!"
echo ""
echo "Lead: $LEAD_ID"
echo "Event: $EVENT_TYPE"
echo "Status updated to: $NEW_STATUS"
