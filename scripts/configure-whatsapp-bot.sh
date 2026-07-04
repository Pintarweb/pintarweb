#!/bin/bash
# configure-whatsapp-bot.sh
# Configure WhatsApp bot settings for a client
# Usage: bash scripts/configure-whatsapp-bot.sh "waba_id" "Business Name" "Services" "Pricing" "Area" "Owner WhatsApp"

set -e

WABA_ID="$1"
BUSINESS_NAME="$2"
SERVICES="$3"
PRICING="$4"
AREA="$5"
OWNER_NOTIFICATION="$6"

if [ -z "$WABA_ID" ] || [ -z "$BUSINESS_NAME" ]; then
    echo "Usage: bash scripts/configure-whatsapp-bot.sh <waba_id> <business_name> <services> <pricing> <area> <owner_whatsapp>"
    echo "Example: bash scripts/configure-whatsapp-bot.sh \"727271803683109\" \"Raizif Aircond\" \"Aircond repair, service, installation\" \"RM149/bulan\" \"Selangor, KL\" \"60174456243\""
    exit 1
fi

# Normalize owner WhatsApp
OWNER_NOTIFICATION="${OWNER_NOTIFICATION:-60174456243}"

echo "Configuring WhatsApp bot for: $BUSINESS_NAME"
echo "WABA ID: $WABA_ID"
echo "Owner notification: $OWNER_NOTIFICATION"

npx wrangler d1 execute pintarweb-outreach-db \
    --remote \
    --command="
    INSERT OR REPLACE INTO whatsapp_bot_config (waba_id, business_name, services, pricing, area, owner_notification, updated_at)
    VALUES (
        '$WABA_ID',
        '$BUSINESS_NAME',
        '$SERVICES',
        '$PRICING',
        '$AREA',
        '$OWNER_NOTIFICATION',
        datetime('now')
    )
    "

echo "✅ Bot configured successfully!"
echo ""
echo "Next steps:"
echo "1. Set META_ACCESS_TOKEN in .dev.vars"
echo "2. Deploy worker: cd workers/whatsapp-bot && npx wrangler deploy"
echo "3. Configure webhook in Meta developer console with:"
echo "   - Callback URL: https://pintarweb-whatsapp-bot.your-subdomain.workers.dev/webhook"
echo "   - Verify token: pintarweb_webhook_2026"
