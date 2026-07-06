#!/bin/bash
# Generate WhatsApp pre-fill link for outreach
# Usage: bash scripts/generate-whatsapp.sh "Contact Name" "Phone" "lead-id" [--audit "audit-url"] [--demo "demo-url"] [--business-name "Biz Name"] [--lang bm|en]
#
# Examples:
#   bash scripts/generate-whatsapp.sh "Ah Seng" "60123456789" "lead-001"
#   bash scripts/generate-whatsapp.sh "Ah Seng" "60123456789" "lead-001" --audit "https://..." --demo "https://..."
#   bash scripts/generate-whatsapp.sh "Ah Seng" "60123456789" "lead-001" --business-name "Ah Seng Plumbing"

set -e

CONTACT_NAME="${1:-}"
PHONE="${2:-}"
LEAD_ID="${3:-}"
AUDIT_URL=""
DEMO_URL=""
BUSINESS_NAME=""
LANDING_URL="https://pintarweb.com"
LANG="bm"

# Parse optional arguments
while [ $# -gt 0 ]; do
    case "$1" in
        --audit)
            AUDIT_URL="$2"
            shift 2
            ;;
        --demo)
            DEMO_URL="$2"
            shift 2
            ;;
        --business-name)
            BUSINESS_NAME="$2"
            shift 2
            ;;
        --lang)
            LANG="$2"
            shift 2
            ;;
        *)
            shift
            ;;
    esac
done

if [ -z "$CONTACT_NAME" ] || [ -z "$PHONE" ] || [ -z "$LEAD_ID" ]; then
    echo "Usage: bash scripts/generate-whatsapp.sh \"Contact Name\" \"Phone\" \"lead-id\" [--audit url] [--demo url] [--business-name \"Biz Name\"] [--lang bm|en]"
    echo ""
    echo "Arguments:"
    echo "  1. Contact name"
    echo "  2. Phone (Malaysia format, e.g. 60123456789)"
    echo "  3. Lead ID"
    echo "  --audit          Audit URL (optional)"
    echo "  --demo           Demo URL (optional)"
    echo "  --business-name  Business name (optional, used in message)"
    echo "  --lang           Language: bm (default) or en"
    exit 1
fi

# Clean phone number
PHONE_CLEAN=$(echo "$PHONE" | tr -cd '[:digit:]')
if [[ ! "$PHONE_CLEAN" =~ ^60 ]]; then
    PHONE_CLEAN="60${PHONE_CLEAN}"
fi

# Language-specific messages
if [ "$LANG" = "en" ]; then
    MESSAGE_BM=""
    EN_BUSINESS=""
    if [ -n "$BUSINESS_NAME" ]; then
        EN_BUSINESS=" for ${BUSINESS_NAME}"
    fi

    MESSAGE_EN="Hi ${CONTACT_NAME}, this is PintarWeb. I found${EN_BUSINESS} online and thought it'd be a great fit for a website + WhatsApp bot. FREE preview website + report${EN_BUSINESS}:"

    if [ -n "$DEMO_URL" ]; then
        MESSAGE_EN="${MESSAGE_EN}

• View live website: ${DEMO_URL}"
    fi

    if [ -n "$AUDIT_URL" ]; then
        MESSAGE_EN="${MESSAGE_EN}
• Online presence report: ${AUDIT_URL}"
    fi

    MESSAGE_EN="${MESSAGE_EN}

Want to try our bot first? Click here: ${LANDING_URL}"
else
    BM_BUSINESS=""
    if [ -n "$BUSINESS_NAME" ]; then
        BM_BUSINESS=" untuk ${BUSINESS_NAME}"
    fi

    MESSAGE_BM="Hi ${CONTACT_NAME}, saya dari PintarWeb. Saya terjumpa bisnes${BM_BUSINESS} online dan rasa sesuai untuk website + WhatsApp bot. FREE preview website + report${BM_BUSINESS}:"

    if [ -n "$DEMO_URL" ]; then
        MESSAGE_BM="${MESSAGE_BM}

• Tengok website live: ${DEMO_URL}"
    fi

    if [ -n "$AUDIT_URL" ]; then
        MESSAGE_BM="${MESSAGE_BM}
• Report online presence: ${AUDIT_URL}"
    fi

    MESSAGE_BM="${MESSAGE_BM}

Nak try bot kami dulu? Klik sini: ${LANDING_URL}"
fi

# Use BM message as default
FINAL_MESSAGE="${MESSAGE_BM}"

# URL encode the message
ENCODED_MESSAGE=$(python3 -c "import urllib.parse; print(urllib.parse.quote('''$FINAL_MESSAGE'''))")

# Generate WhatsApp URL
WHATSAPP_URL="https://wa.me/${PHONE_CLEAN}?text=${ENCODED_MESSAGE}"

# Output
echo ""
echo "✅ WhatsApp link generated!"
echo ""
echo "Contact: $CONTACT_NAME"
echo "Phone: $PHONE_CLEAN"
echo "Lead ID: $LEAD_ID"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "MESSAGE:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "$FINAL_MESSAGE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📱 WhatsApp URL:"
echo "$WHATSAPP_URL"
echo ""

# Also output just the URL for piping
echo "$WHATSAPP_URL" > "/tmp/whatsapp-${LEAD_ID}.url"
echo "URL saved to: /tmp/whatsapp-${LEAD_ID}.url"
