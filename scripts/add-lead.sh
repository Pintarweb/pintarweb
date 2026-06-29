#!/bin/bash
# Add a lead to the outreach tracking database
# Usage: bash scripts/add-lead.sh "Business Name" "Phone" "Area" "Niche" [--contact "Contact Name"] [--score 60] [--demo "demo-url"] [--audit "audit-url"]
#
# Examples:
#   bash scripts/add-lead.sh "Ah Seng Plumbing" "60123456789" "Klang" "plumbing" --score 60
#   bash scripts/add-lead.sh "Tai Aircond" "60334567890" "Kuala Lumpur" "aircond" --contact "Mr. Tai" --score 55

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

BUSINESS_NAME="${1:-}"
PHONE="${2:-}"
AREA="${3:-}"
NICHE="${4:-}"
CONTACT_NAME=""
SCORE="0"
DEMO_URL=""
AUDIT_URL=""
NOTES=""

# Parse optional arguments
while [ $# -gt 0 ]; do
    case "$1" in
        --contact)
            CONTACT_NAME="$2"
            shift 2
            ;;
        --score)
            SCORE="$2"
            shift 2
            ;;
        --demo)
            DEMO_URL="$2"
            shift 2
            ;;
        --audit)
            AUDIT_URL="$2"
            shift 2
            ;;
        --notes)
            NOTES="$2"
            shift 2
            ;;
        *)
            shift
            ;;
    esac
done

if [ -z "$BUSINESS_NAME" ] || [ -z "$PHONE" ] || [ -z "$AREA" ] || [ -z "$NICHE" ]; then
    echo "Usage: bash scripts/add-lead.sh \"Business Name\" \"Phone\" \"Area\" \"Niche\" [options]"
    echo ""
    echo "Arguments:"
    echo "  1. Business name"
    echo "  2. Phone (Malaysia format)"
    echo "  3. Area"
    echo "  4. Niche"
    echo ""
    echo "Options:"
    echo "  --contact \"Name\"    Contact person name"
    echo "  --score N            Lead score (default: 0)"
    echo "  --demo URL           Demo website URL"
    echo "  --audit URL          Audit report URL"
    echo "  --notes \"...\"       Additional notes"
    exit 1
fi

# Clean phone
PHONE_CLEAN=$(echo "$PHONE" | tr -cd '[:digit:]')
if [[ ! "$PHONE_CLEAN" =~ ^60 ]]; then
    PHONE_CLEAN="60${PHONE_CLEAN}"
fi

# Generate ID from business name
LEAD_ID=$(echo "$BUSINESS_NAME" | tr '[:upper:]' '[:lower:]' | tr -cd '[:alnum:]' | tr '[:blank:]' '-' | head -c 30)
LEAD_ID="${LEAD_ID}-$(date +%Y%m%d)"

# Escape single quotes in strings
BUSINESS_NAME_ESCAPED=$(echo "$BUSINESS_NAME" | sed "s/'/''/g")
CONTACT_NAME_ESCAPED=$(echo "$CONTACT_NAME" | sed "s/'/''/g")
NOTES_ESCAPED=$(echo "$NOTES" | sed "s/'/''/g")

echo "Adding lead to database..."
echo "  Business: $BUSINESS_NAME"
echo "  Phone: $PHONE_CLEAN"
echo "  Area: $AREA"
echo "  Niche: $NICHE"
echo "  Score: $SCORE"
echo ""

# Insert lead
cd "$(dirname "$0")/.." && npx wrangler d1 execute "$D1_DB_ID" --remote --yes --command="
INSERT INTO outreach_leads (id, business_name, contact_name, phone, area, niche, demo_url, audit_url, score, notes, status)
VALUES (
    '$LEAD_ID',
    '$BUSINESS_NAME_ESCAPED',
    '$CONTACT_NAME_ESCAPED',
    '$PHONE_CLEAN',
    '$AREA',
    '$NICHE',
    '$DEMO_URL',
    '$AUDIT_URL',
    $SCORE,
    '$NOTES_ESCAPED',
    'new'
);
"

# Record creation event
EVENT_ID="${LEAD_ID}-event-$(date +%s)"
cd "$(dirname "$0")/.." && npx wrangler d1 execute "$D1_DB_ID" --remote --yes --command="
INSERT INTO outreach_events (id, lead_id, event_type, metadata)
VALUES ('$EVENT_ID', '$LEAD_ID', 'lead_created', '{\"source\": \"manual\"}');
"

echo "✅ Lead added successfully!"
echo ""
echo "Lead ID: $LEAD_ID"
echo ""
echo "Next steps:"
echo "  1. Generate demo site: bash scripts/generate-demo.sh $LEAD_ID"
echo "  2. Send outreach: bash scripts/generate-whatsapp.sh \"$CONTACT_NAME\" \"$PHONE_CLEAN\" \"$LEAD_ID\" --audit \"$AUDIT_URL\" --demo \"$DEMO_URL\""
