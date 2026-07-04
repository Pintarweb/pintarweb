#!/bin/bash
# Confirm payment received and send invoice
# Usage: bash scripts/confirm-payment.sh "[lead-id]" "[amount]" "[payment-reference]" [--email "cust@email.com"]
#
# Examples:
#   bash scripts/confirm-payment.sh "ah-seng-plumbing-20260629" "297" "TRX123456" --email "customer@email.com"  # setup payment
#   bash scripts/confirm-payment.sh "ah-seng-plumbing-20260629" "149" "TRX789ABC" --email "customer@email.com"  # activation payment

set -e

# Load .env if exists
if [ -f "$(dirname "$0")/../.env" ]; then
    export $(grep -v '^#' "$(dirname "$0")/../.env" | xargs)
fi

D1_DB_ID="${CLOUDFLARE_D1_DATABASE_ID:-}"
RESEND_API_KEY="${RESEND_API_KEY:-}"
RESEND_FROM_EMAIL="${RESEND_FROM_EMAIL:-hello@mail.pintarweb.com}"

if [ -z "$D1_DB_ID" ]; then
    echo "Error: CLOUDFLARE_D1_DATABASE_ID not found in .env"
    exit 1
fi

LEAD_ID="${1:-}"
AMOUNT="${2:-}"
PAYMENT_REF="${3:-}"
CUSTOMER_EMAIL=""

# Parse --email flag
for arg in "$@"; do
    case "$arg" in
        --email)
            CUSTOMER_EMAIL="${!OPTIND}"
            ((OPTIND++)) 2>/dev/null || true
            ;;
    esac
done

if [ -z "$LEAD_ID" ] || [ -z "$AMOUNT" ]; then
    echo "Usage: bash scripts/confirm-payment.sh \"[lead-id]\" \"[amount]\" \"[payment-reference]\" [--email \"cust@email.com\"]"
    echo ""
    echo "Arguments:"
    echo "  1. Lead ID (e.g., ah-seng-plumbing-20260629)"
    echo "  2. Amount received (297 = setup, 149 = activation)"
    echo "  3. Payment reference (e.g., TRX123456)"
    echo "  --email: Customer email address (optional)"
    exit 1
fi

# Get lead info from D1
LEAD_DATA=$(cd "$(dirname "$0")/.." && npx wrangler d1 execute "$D1_DB_ID" --remote --yes --command="SELECT business_name, contact_name, phone FROM outreach_leads WHERE id = '$LEAD_ID';" 2>/dev/null | tail -n +2)

if [ -z "$LEAD_DATA" ]; then
    echo "Error: Lead not found: $LEAD_ID"
    exit 1
fi

BUSINESS_NAME=$(echo "$LEAD_DATA" | awk -F' ' '{print $1}' | tr -d '"' | tr -d '|')
CONTACT_NAME=$(echo "$LEAD_DATA" | awk -F' ' '{print $2}' | tr -d '"' | tr -d '|')
PHONE=$(echo "$LEAD_DATA" | awk -F' ' '{print $3}' | tr -d '"' | tr -d '|')

# Generate invoice number (PWT2026-XXX)
MAX_INVOICE=$(cd "$(dirname "$0")/.." && npx wrangler d1 execute "$D1_DB_ID" --remote --yes --command="SELECT invoice_number FROM outreach_leads WHERE invoice_number IS NOT NULL ORDER BY invoice_number DESC LIMIT 1;" 2>/dev/null | tail -n +2 | tr -d '"' | tr -d '|' | sed 's/PWT2026-0*//' | tr -d ' ')

if [ -z "$MAX_INVOICE" ] || [ "$MAX_INVOICE" = "NULL" ]; then
    NEXT_NUM=1
else
    NEXT_NUM=$((MAX_INVOICE + 1))
fi

INVOICE_NUMBER=$(printf "PWT2026-%03d" "$NEXT_NUM")
TODAY=$(date +"%d %b %Y")
PAYMENT_DATE=$(date +"%Y-%m-%d")

# Determine plan type based on amount
# RM297 = setup fee payment, RM149 = activation payment
if [ "$AMOUNT" = "297" ]; then
    PLAN_TYPE="Pilot Setup"
    SETUP_FEE=297
    MONTH1_FEE=0
elif [ "$AMOUNT" = "149" ]; then
    PLAN_TYPE="Activation + Month 1"
    SETUP_FEE=0
    MONTH1_FEE=149
else
    PLAN_TYPE="Regular"
    SETUP_FEE=300
    MONTH1_FEE=149
fi

echo "Confirming payment for $LEAD_ID..."
echo "  Business: $BUSINESS_NAME"
echo "  Phone: $PHONE"
echo "  Amount: RM $AMOUNT"
echo "  Invoice: $INVOICE_NUMBER"
[ -n "$CUSTOMER_EMAIL" ] && echo "  Email: $CUSTOMER_EMAIL"
echo ""

# Update D1 with payment info
UPDATE_SQL="UPDATE outreach_leads SET
    setup_paid = 1,
    setup_paid_date = '$PAYMENT_DATE',
    setup_amount = $AMOUNT,
    invoice_number = '$INVOICE_NUMBER',
    status = 'paid',"
[ -n "$CUSTOMER_EMAIL" ] && UPDATE_SQL="$UPDATE_SQL customer_email = '$CUSTOMER_EMAIL',"
UPDATE_SQL="$UPDATE_SQL updated_at = datetime('now')
WHERE id = '$LEAD_ID';"

cd "$(dirname "$0")/.." && npx wrangler d1 execute "$D1_DB_ID" --remote --yes --command="$UPDATE_SQL" 2>/dev/null

echo "✅ D1 updated"

# Record payment event
EVENT_ID="${LEAD_ID}-payment-$(date +%s)"
cd "$(dirname "$0")/.." && npx wrangler d1 execute "$D1_DB_ID" --remote --yes --command="
INSERT INTO outreach_events (id, lead_id, event_type, metadata)
VALUES ('$EVENT_ID', '$LEAD_ID', 'paid', '{\"amount\": $AMOUNT, \"reference\": \"$PAYMENT_REF\", \"invoice\": \"$INVOICE_NUMBER\"}');
" 2>/dev/null

echo "✅ Payment event logged"

# Generate WhatsApp receipt
WHATSAPP_MSG="Terima kasih! Payment dah terima.

Invoice: $INVOICE_NUMBER
Amount: RM $AMOUNT
Reference: $PAYMENT_REF
Date: $TODAY

Website awak: https://preview.pintarweb.com/$LEAD_ID/

Untuk 4 bulan pertama (3 bulan free + bulan 1 yang awak bayar), tiada apa-apa bayaran lagi.

Saya akan contact awak kat hujung bulan 3 untuk renewal options. Ada apa-apa boleh WhatsApp saya bila-bila masa.

- PintarWeb"

WHATSAPP_URL="https://wa.me/$PHONE?text=$(echo "$WHATSAPP_MSG" | jq -sRr @uri 2>/dev/null || echo "$WHATSAPP_MSG" | sed 's/ /%20/g' | tr '\n' '%0A')"

echo ""
echo "📱 WhatsApp Receipt:"
echo "$WHATSAPP_MSG"
echo ""
echo "🔗 WhatsApp URL: $WHATSAPP_URL"

# Send email invoice via Resend
if [ -n "$RESEND_API_KEY" ] && [ -n "$CUSTOMER_EMAIL" ]; then
    EMAIL_BODY="<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0a0a0a; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f5f5f5; padding: 20px; border-radius: 0 0 10px 10px; }
        .invoice-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .invoice-table th, .invoice-table td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        .invoice-table th { background: #e0e0e0; }
        .total { font-size: 1.2em; font-weight: bold; }
        .footer { text-align: center; color: #666; font-size: 0.9em; margin-top: 20px; }
    </style>
</head>
<body>
    <div class='header'>
        <h1 style='margin:0;'>PintarWeb</h1>
        <p style='margin:5px 0 0 0;'>Website + WhatsApp Bot + Local SEO</p>
    </div>
    <div class='content'>
        <h2>Invoice</h2>
        <p><strong>Invoice Number:</strong> $INVOICE_NUMBER<br>
        <strong>Date:</strong> $TODAY<br>
        <strong>Customer:</strong> $CONTACT_NAME<br>
        <strong>Business:</strong> $BUSINESS_NAME</p>

        <table class='invoice-table'>
            <tr><th>Description</th><th>Amount</th></tr>
            <tr><td>Setup Fee</td><td>RM $SETUP_FEE</td></tr>
            <tr><td>Activation (Month 1)</td><td>RM $MONTH1_FEE</td></tr>
            <tr><td colspan='2' style='text-align:right;'><strong>Total Paid:</strong> RM $AMOUNT</td></tr>
        </table>

        <p><strong>Plan:</strong> $PLAN_TYPE</p>
        <p><strong>Payment Reference:</strong> $PAYMENT_REF</p>

        <h3>What's Included:</h3>
        <ul>
            <li>Website + hosting + SSL</li>
            <li>WhatsApp auto-reply bot (30 messages/month)</li>
            <li>Local SEO + Google Business Profile</li>
            <li>Month 4: FREE bonus (with activation payment)</li>
            <li>Month 5 onwards: RM 149/month auto-renewal</li>
        </ul>

        <h3>Renewal Options (Month 4+):</h3>
        <table class='invoice-table'>
            <tr><th>Plan</th><th>Price</th><th>Savings</th></tr>
            <tr><td>Monthly</td><td>RM 149/month</td><td>-</td></tr>
            <tr><td>Quarterly</td><td>RM 417/3 months</td><td>Save RM 30</td></tr>
            <tr><td>Bi-annual</td><td>RM 774/6 months</td><td>Save RM 120</td></tr>
            <tr><td>Annual</td><td>RM 1,308/year</td><td>Save RM 480</td></tr>
        </table>

        <h3>Bank Details (for reference):</h3>
        <p><strong>PintarWeb Enterprise</strong><br>
        Bank: Maybank<br>
        Account Number: 562021737846</p>

        <p style='color: #666; font-size: 0.9em; margin-top: 20px;'>
        <strong>Terms:</strong> 14-day cancellation policy. Setup fee is non-refundable.
        For questions, WhatsApp us anytime.
        </p>
    </div>
    <div class='footer'>
        <p>PintarWeb — Selangor, Malaysia</p>
        <p>This is a computer-generated invoice.</p>
    </div>
</body>
</html>"

    ESCAPED_EMAIL_BODY=$(echo "$EMAIL_BODY" | jq -sRr @text)

    EMAIL_RESPONSE=$(curl -s -X POST "https://api.resend.com/emails" \
        -H "Authorization: Bearer $RESEND_API_KEY" \
        -H "Content-Type: application/json" \
        -d "{
            \"from\": \"$RESEND_FROM_EMAIL\",
            \"to\": [\"$CUSTOMER_EMAIL\"],
            \"subject\": \"Invoice $INVOICE_NUMBER - PintarWeb\",
            \"html\": $ESCAPED_EMAIL_BODY
        }" 2>/dev/null)

    if echo "$EMAIL_RESPONSE" | grep -q '"id"'; then
        echo "✅ Email invoice sent to $CUSTOMER_EMAIL (ID: $(echo $EMAIL_RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4))"
    else
        echo "⚠️ Email send failed: $(echo $EMAIL_RESPONSE | head -c 200)"
    fi
elif [ -z "$CUSTOMER_EMAIL" ]; then
    echo "⚠️ No customer email provided (--email flag), skipping invoice email"
    echo "   Add --email to send invoice to customer"
else
    echo "⚠️ RESEND_API_KEY not set, skipping email"
fi

echo ""
echo "═══════════════════════════════════════════════"
echo "✅ Payment confirmed successfully!"
echo "═══════════════════════════════════════════════"
echo ""
echo "Invoice: $INVOICE_NUMBER"
echo "Amount: RM $AMOUNT"
echo "Customer: $BUSINESS_NAME"
echo ""
echo "Next steps:"
echo "  1. Send WhatsApp receipt: $WHATSAPP_URL"
echo "  2. Welcome the customer"
echo "  3. Track engagement (months 1-3)"
echo "  4. Send billing reminder at month 3 end"
