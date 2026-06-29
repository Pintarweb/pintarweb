#!/bin/bash
# Unified demo generation workflow
# Usage: bash scripts/generate-demo.sh --name "Business Name" --phone "60123456789" --area "Klang" --niche "plumbing" [--contact "Contact Name"] [--score 60] [--template "demo-ah-seng-plumbing"]
#
# This script:
# 1. Adds lead to D1 tracking
# 2. Generates P.A.S.T. audit
# 3. Prepares WhatsApp outreach message
#
# For demo site generation, it copies from existing template

set -e

# Load .env if exists
if [ -f "$(dirname "$0")/../.env" ]; then
    export $(grep -v '^#' "$(dirname "$0")/../.env" | xargs)
fi

# Parse arguments
NAME=""
PHONE=""
AREA=""
NICHE=""
CONTACT_NAME=""
SCORE="0"
TEMPLATE=""
DEMO_URL=""
AUDIT_URL=""

while [ $# -gt 0 ]; do
    case "$1" in
        --name)
            NAME="$2"
            shift 2
            ;;
        --phone)
            PHONE="$2"
            shift 2
            ;;
        --area)
            AREA="$2"
            shift 2
            ;;
        --niche)
            NICHE="$2"
            shift 2
            ;;
        --contact)
            CONTACT_NAME="$2"
            shift 2
            ;;
        --score)
            SCORE="$2"
            shift 2
            ;;
        --template)
            TEMPLATE="$2"
            shift 2
            ;;
        --demo-url)
            DEMO_URL="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            shift
            ;;
    esac
done

if [ -z "$NAME" ] || [ -z "$PHONE" ] || [ -z "$AREA" ] || [ -z "$NICHE" ]; then
    echo "Usage: bash scripts/generate-demo.sh --name \"Business Name\" --phone \"60123456789\" --area \"Klang\" --niche \"plumbing\" [options]"
    echo ""
    echo "Required:"
    echo "  --name   Business name"
    echo "  --phone  Phone number (Malaysia format)"
    echo "  --area   Area (e.g., Klang, Shah Alam)"
    echo "  --niche  Niche (e.g., plumbing, aircond, electrical)"
    echo ""
    echo "Options:"
    echo "  --contact \"Name\"     Contact person name"
    echo "  --score N            Lead score (for prioritization)"
    echo "  --template \"name\"   Template to use (default: demo-ah-seng-plumbing)"
    echo "  --demo-url URL       Pre-generated demo URL"
    echo ""
    echo "Example:"
    echo "  bash scripts/generate-demo.sh --name \"Ah Seng Plumbing\" --phone \"60123456789\" --area \"Klang\" --niche \"plumbing\""
    exit 1
fi

# Default contact name to business name if not provided
if [ -z "$CONTACT_NAME" ]; then
    CONTACT_NAME="$NAME"
fi

# Default template
if [ -z "$TEMPLATE" ]; then
    TEMPLATE="demo-ah-seng-plumbing"
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "         PINTARWEB DEMO GENERATION WORKFLOW"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Business: $NAME"
echo "Phone: $PHONE"
echo "Area: $AREA"
echo "Niche: $NICHE"
echo "Contact: $CONTACT_NAME"
echo "Score: $SCORE"
echo "Template: $TEMPLATE"
echo ""

# Step 1: Generate demo URL if not provided
if [ -z "$DEMO_URL" ]; then
    # Generate ID from business name
    DEMO_ID=$(echo "$NAME" | tr '[:upper:]' '[:lower:]' | tr -cd '[:alnum:]' | tr '[:blank:]' '-' | head -c 30)
    DEMO_URL="https://preview.pintarweb.com/${DEMO_ID}/"
    echo "📌 Demo URL (using naming convention): $DEMO_URL"
    echo "   Note: You still need to create the actual demo site manually"
    echo "   using: bash scripts/build-demo.sh --from $TEMPLATE --id $DEMO_ID"
else
    echo "📌 Demo URL (provided): $DEMO_URL"
fi
echo ""

# Step 2: Generate audit
AUDIT_DIR="data/audits"
mkdir -p "$AUDIT_DIR"

echo "🔍 Generating P.A.S.T. audit..."
AUDIT_OUTPUT=$(bash "$(dirname "$0")/generate-audit.sh" "$NAME" "$AREA" "$NICHE" "$AUDIT_DIR" 2>&1)
AUDIT_URL=$(echo "$AUDIT_OUTPUT" | grep "Demo URL:" | sed 's/Demo URL: //' || echo "")

# Extract actual audit file path from output
AUDIT_FILE=$(ls -t "$AUDIT_DIR/${DEMO_ID}-audit-"*.html 2>/dev/null | head -1 || echo "")
if [ -n "$AUDIT_FILE" ]; then
    # For now, use the preview URL pattern
    AUDIT_URL="https://preview.pintarweb.com/${DEMO_ID}/audit.html"
fi

echo "   Audit URL: $AUDIT_URL"
echo ""

# Step 3: Add to D1 tracking
echo "📝 Adding lead to tracking database..."
if [ -n "$CLOUDFLARE_D1_DATABASE_ID" ]; then
    bash "$(dirname "$0")/add-lead.sh" "$NAME" "$PHONE" "$AREA" "$NICHE" \
        --contact "$CONTACT_NAME" \
        --score "$SCORE" \
        --demo "$DEMO_URL" \
        --audit "$AUDIT_URL" 2>&1 | grep -v "雷"
    echo ""
else
    echo "   ⚠️ D1 not configured, skipping tracking"
    echo ""
fi

# Step 4: Generate WhatsApp message
echo "📱 Generating WhatsApp outreach message..."
WHATSAPP_OUTPUT=$(bash "$(dirname "$0")/generate-whatsapp.sh" "$CONTACT_NAME" "$PHONE" "$DEMO_ID" \
    --audit "$AUDIT_URL" \
    --demo "$DEMO_URL" 2>&1)
WHATSAPP_URL=$(echo "$WHATSAPP_OUTPUT" | grep "https://wa.me" | head -1 || echo "")

echo ""

echo "═══════════════════════════════════════════════════════════"
echo "                    SUMMARY"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "✅ All outputs generated!"
echo ""
echo "┌─────────────────────────────────────────────────────┐"
echo "│ OUTPUTS                                             │"
echo "├─────────────────────────────────────────────────────┤"
echo "│ Demo URL:     $DEMO_URL"
echo "│ Audit URL:    $AUDIT_URL"
echo "│ WhatsApp:     $WHATSAPP_URL"
echo "└─────────────────────────────────────────────────────┘"
echo ""
echo "NEXT STEPS:"
echo "  1. Create actual demo site (if not using existing URL)"
echo "  2. Deploy audit page to: $AUDIT_FILE"
echo "  3. Send WhatsApp message to prospect"
echo "  4. Track engagement: bash scripts/track-event.sh \"$DEMO_ID\" \"demo_sent\""
echo ""
