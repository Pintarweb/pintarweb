#!/bin/bash
set -e
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd "$(dirname "$0")/.."

LEAD_ID="${1:-}"
NICHE="${2:-}"
LLM_FLAG=""

if [ -z "$LEAD_ID" ]; then
  echo "Usage: bash scripts/generate-site.sh <lead-id> [niche] [--llm]"
  echo ""
  echo "Arguments:"
  echo "  lead-id   Lead UUID or slug (e.g. a1b2c3d4 or test-razif)"
  echo "  niche     Niche override (auto-detected from config.json if omitted)"
  echo "  --llm     Optional LLM polish pass after assembly"
  echo ""
  echo "Example: bash scripts/generate-site.sh a1b2c3d4"
  echo "         bash scripts/generate-site.sh a1b2c3d4 aircond-contractor"
  echo "         bash scripts/generate-site.sh a1b2c3d4 --llm"
  exit 1
fi

if [ "$NICHE" = "--llm" ]; then
  LLM_FLAG="--llm"
  NICHE=""
fi

# Auto-detect niche from config.json if not provided
if [ -z "$NICHE" ]; then
  CONFIG="packages/site-generator/clients/$LEAD_ID/config.json"
  if [ -f "$CONFIG" ]; then
    NICHE=$(grep -o '"niche"[[:space:]]*:[[:space:]]*"[^"]*"' "$CONFIG" 2>/dev/null | head -1 | sed 's/.*"niche"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')
  fi
fi
NICHE="${NICHE:-general}"

echo "═══════════════════════════════════════════"
echo "  Generate Demo Site"
echo "═══════════════════════════════════════════"
echo "  Lead:   $LEAD_ID"
echo "  Niche:  $NICHE"
echo "  LLM:    ${LLM_FLAG:-no}"
echo ""

echo "Step 1/5: Prepare images..."
bash scripts/prepare-demo-images.sh "$LEAD_ID" "$NICHE"
echo ""

echo "Step 2/5: Generate index.html..."
node scripts/generate-site.mjs "$LEAD_ID" $LLM_FLAG
echo ""

echo "Step 2.5/5: Verify integrity..."
node scripts/verify-site.mjs "$LEAD_ID"
echo ""

echo "Step 4/5: Build CSS..."
bash scripts/build-client.sh "$LEAD_ID"
echo ""

echo "Step 5/5: Deploy to preview..."
bash scripts/deploy-preview.sh
echo ""

DEPLOY_URL="https://preview.pintarweb.com/$LEAD_ID/"
echo "═══════════════════════════════════════════
  ✅ Done! Demo site deployed
  📌 URL: $DEPLOY_URL
  📌 To save to D1:
     curl -X PATCH /api/leads/<phone>/demo \\
       -H 'Content-Type: application/json' \\
       -d '{\"demo_url\": \"$DEPLOY_URL\"}'
═══════════════════════════════════════════"
