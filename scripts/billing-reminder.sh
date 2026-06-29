#!/bin/bash
# Send billing reminders to all pilots at month 3 end
# Usage: bash scripts/billing-reminder.sh
#
# Sends reminder to all leads with setup_paid=1 and billing_reminder_sent=0

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

echo "═══════════════════════════════════════════════"
echo "       PINTARWEB BILLING REMINDER"
echo "═══════════════════════════════════════════════"
echo ""

# Get all pilots due for billing reminder
PILOTS=$(cd "$(dirname "$0")/.." && npx wrangler d1 execute "$D1_DB_ID" --remote --yes --command="
SELECT id, business_name, contact_name, phone, setup_paid_date, setup_amount
FROM outreach_leads
WHERE setup_paid = 1
AND billing_reminder_sent = 0
AND status IN ('paid', 'pilot_active');
" 2>/dev/null | tail -n +2)

if [ -z "$PILOTS" ] || [ "$PILOTS" = "[]" ]; then
    echo "No pilots due for billing reminder."
    exit 0
fi

echo "Found pilots due for billing reminder:"
echo ""

COUNT=0
while IFS= read -r line; do
    if [ -z "$line" ] || [ "$line" = "NULL" ]; then
        continue
    fi

    # Parse CSV-like output
    LEAD_ID=$(echo "$line" | awk -F'|' '{print $1}' | tr -d ' "')
    BUSINESS_NAME=$(echo "$line" | awk -F'|' '{print $2}' | tr -d ' "')
    CONTACT_NAME=$(echo "$line" | awk -F'|' '{print $3}' | tr -d ' "')
    PHONE=$(echo "$line" | awk -F'|' '{print $4}' | tr -d ' "')
    SETUP_PAID_DATE=$(echo "$line" | awk -F'|' '{print $5}' | tr -d ' "')
    SETUP_AMOUNT=$(echo "$line" | awk -F'|' '{print $6}' | tr -d ' "')

    if [ -z "$PHONE" ] || [ "$PHONE" = "NULL" ]; then
        continue
    fi

    echo "─────────────────────────────────────────────"
    echo "Lead: $LEAD_ID"
    echo "Business: $BUSINESS_NAME"
    echo "Phone: $PHONE"
    echo "Paid on: $SETUP_PAID_DATE"
    echo ""

    # Generate WhatsApp message
    WHATSAPP_MSG="Hi $CONTACT_NAME, ni reminder — billing PintarWeb bermula bulan depan.

Pilihan renewal:
📅 Bulanan: RM149/bulan
📅 Suku Tahun: RM417 (jimat RM30)
📅 6 Bulan: RM774 (jimat RM120)
📅 Tahunan: RM1,308 (jimat RM480)

Nak pilih yang mana? Boleh reply kat sini.

- PintarWeb"

    WHATSAPP_ENCODED=$(echo "$WHATSAPP_MSG" | python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.stdin.read()))" 2>/dev/null || echo "$WHATSAPP_MSG" | sed 's/ /%20/g' | tr '\n' '%0A')
    WHATSAPP_URL="https://wa.me/$PHONE?text=$WHATSAPP_ENCODED"

    echo "Message:"
    echo "$WHATSAPP_MSG"
    echo ""
    echo "🔗 WhatsApp: $WHATSAPP_URL"
    echo ""

    # Update D1 to mark reminder sent
    TODAY=$(date +"%Y-%m-%d")
    cd "$(dirname "$0")/.." && npx wrangler d1 execute "$D1_DB_ID" --remote --yes --command="
    UPDATE outreach_leads SET
        billing_reminder_sent = 1,
        billing_reminder_date = '$TODAY',
        updated_at = datetime('now')
    WHERE id = '$LEAD_ID';
    "

    # Record event
    EVENT_ID="${LEAD_ID}-billing-reminder-$(date +%s)"
    cd "$(dirname "$0")/.." && npx wrangler d1 execute "$D1_DB_ID" --remote --yes --command="
    INSERT INTO outreach_events (id, lead_id, event_type, metadata)
    VALUES ('$EVENT_ID', '$LEAD_ID', 'billing_reminder_sent', '{\"date\": \"$TODAY\"}');
    "

    echo "✅ Reminder sent and logged for $LEAD_ID"
    echo ""

    COUNT=$((COUNT + 1))

done <<< "$PILOTS"

echo "═══════════════════════════════════════════════"
echo "✅ Billing reminders sent to $COUNT pilot(s)"
echo "═══════════════════════════════════════════════"
echo ""
echo "Next steps:"
echo "  1. Wait for responses"
echo "  2. When customer chooses plan, run:"
echo "     bash scripts/create-subscription.sh \"[lead-id]\" \"[monthly|quarterly|biannual|annual]\""
echo "  3. If no response by month 4, default to monthly"
