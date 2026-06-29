#!/bin/bash
# Generate WhatsApp pre-fill link for outreach
# Usage: bash scripts/generate-whatsapp.sh "Contact Name" "Phone" "lead-id" [--audit "audit-url"] [--demo "demo-url"] [--lang bm|en]
#
# Examples:
#   bash scripts/generate-whatsapp.sh "Ah Seng" "60123456789" "lead-001"
#   bash scripts/generate-whatsapp.sh "Ah Seng" "60123456789" "lead-001" --audit "https://..." --demo "https://..."
#   bash scripts/generate-whatsapp.sh "Ah Seng" "60123456789" "lead-001" --lang en

set -e

CONTACT_NAME="${1:-}"
PHONE="${2:-}"
LEAD_ID="${3:-}"
AUDIT_URL=""
DEMO_URL=""
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
    echo "Usage: bash scripts/generate-whatsapp.sh \"Contact Name\" \"Phone\" \"lead-id\" [--audit url] [--demo url] [--lang bm|en]"
    echo ""
    echo "Arguments:"
    echo "  1. Contact name"
    echo "  2. Phone (Malaysia format, e.g. 60123456789)"
    echo "  3. Lead ID"
    echo "  --audit  Audit URL (optional)"
    echo "  --demo   Demo URL (optional)"
    echo "  --lang   Language: bm (default) or en"
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
    MESSAGE_EN="Hi ${CONTACT_NAME}, I found your business online and prepared a FREE online presence audit for you."

    if [ -n "$AUDIT_URL" ]; then
        MESSAGE_EN="${MESSAGE_EN}

See how customers find your business online: ${AUDIT_URL}"
    fi

    if [ -n "$DEMO_URL" ]; then
        MESSAGE_EN="${MESSAGE_EN}

I also built a preview of how your business website could look: ${DEMO_URL}"
    fi

    MESSAGE_EN="${MESSAGE_EN}

You can see exactly what you're missing and how it affects your business. Happy to explain how it works!"
else
    MESSAGE_BM="Hi ${CONTACT_NAME}, saya jumpa bisnes anda online dan sediakan FREE audit kehadiran online untuk anda."

    if [ -n "$AUDIT_URL" ]; then
        MESSAGE_BM="${MESSAGE_BM}

 tengok bagaimana customer jumpa bisnes anda online: ${AUDIT_URL}"
    fi

    if [ -n "$DEMO_URL" ]; then
        MESSAGE_BM="${MESSAGE_BM}

Saya juga dah bina preview macam mana website bisnes anda boleh nampak: ${DEMO_URL}"
    fi

    MESSAGE_BM="${MESSAGE_BM}

awak boleh tengok apa yang anda terlepas dan bagaimana ia affect bisnes anda. Sini saya boleh explain cara ia berfungsi!"
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
