#!/bin/bash
set -e
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd "$(dirname "$0")/.."

LEAD_ID="$1"
NICHE="$2"
CLIENT_DIR="${3:-packages/site-generator/clients/$LEAD_ID}"
IMAGES_DIR="$CLIENT_DIR/images"

if [ -z "$LEAD_ID" ] || [ -z "$NICHE" ]; then
    echo "Usage: bash scripts/prepare-demo-images.sh <lead-id> <niche> [client-dir]"
    echo ""
    echo "Arguments:"
    echo "  lead-id     Lead UUID or slug (e.g. a1b2c3d4 or demo-kl-aircond-pro)"
    echo "  niche       Niche: aircond-contractor, plumbing, electrical, renovation, general"
    echo "  client-dir  Optional override (default: packages/site-generator/clients/<lead-id>)"
    exit 1
fi

case "$NICHE" in
    aircond-contractor) STOCK_CATEGORY="aircond-service" ;;
    plumbing)           STOCK_CATEGORY="plumbing" ;;
    electrical)         STOCK_CATEGORY="electrical" ;;
    renovation)         STOCK_CATEGORY="renovation" ;;
    general)            STOCK_CATEGORY="" ;;
    *)                  STOCK_CATEGORY="" ;;
esac

STOCK_DIR="packages/site-generator/design-system/references/image-collections/$STOCK_CATEGORY"

echo "═══════════════════════════════════════════"
echo "  Prepare Demo Images"
echo "═══════════════════════════════════════════"
echo "  Lead:    $LEAD_ID"
echo "  Niche:   $NICHE"
echo "  Target:  $IMAGES_DIR"
echo "  Stock:   ${STOCK_DIR:-"(none)"}"
echo ""

mkdir -p "$IMAGES_DIR"

file_exists() {
    local base="$1"
    local dir="$2"
    ls "$dir/$base".* 2>/dev/null | head -1 | grep -q .
}

# Download from R2 public URL if possible
r2_base="https://pub-${CLOUDFLARE_ACCOUNT_ID:-ACCOUNT}.r2.dev/pintarweb-client-images"

download_r2() {
    local prefix="$1"
    local target="$2"
    for ext in webp png jpg jpeg svg; do
        local u="$r2_base/$LEAD_ID/$prefix"
        u="${u/%\*/$ext}"
        if curl -sf -o "$target" "$u" 2>/dev/null; then
            echo "  Downloaded R2: $(basename "$target")"
            return 0
        fi
    done
    return 1
}

echo "Step 1: Downloading from R2..."
if [ -n "$CLOUDFLARE_ACCOUNT_ID" ]; then
    download_r2 "logo.*" "$IMAGES_DIR/logo.webp" || true
    download_r2 "hero.*" "$IMAGES_DIR/hero.webp" || true
    for gi in 1 2 3; do
        download_r2 "gallery-00$gi.*" "$IMAGES_DIR/gallery-$gi.webp" || true
    done
else
    echo "  CLOUDFLARE_ACCOUNT_ID not set, skipping R2 download"
fi

echo ""
echo "Step 2: Filling missing images from stock..."
if [ -n "$STOCK_CATEGORY" ] && [ -d "$STOCK_DIR" ]; then
    for img in hero.webp service-1.webp service-2.webp service-3.webp gallery-1.webp gallery-2.webp gallery-3.webp; do
        if [ ! -f "$IMAGES_DIR/$img" ] && [ -f "$STOCK_DIR/$img" ]; then
            cp "$STOCK_DIR/$img" "$IMAGES_DIR/$img"
            echo "  Filled from stock: $img"
        fi
    done
else
    echo "  No stock images available for niche '$NICHE'"
fi

echo ""
echo "Step 3: Checking logo..."
if ! file_exists "logo" "$IMAGES_DIR"; then
    BUSINESS_NAME=""
    if [ -f "$CLIENT_DIR/config.json" ]; then
        BUSINESS_NAME=$(grep -o '"business_name"[[:space:]]*:[[:space:]]*"[^"]*"' "$CLIENT_DIR/config.json" 2>/dev/null | head -1 | sed 's/.*"business_name"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')
    fi
    if [ -z "$BUSINESS_NAME" ]; then
        BUSINESS_NAME=$(echo "$LEAD_ID" | sed 's/^demo-//' | sed 's/-/ /g')
    fi

    INITIALS=$(echo "$BUSINESS_NAME" | sed 's/\(.\)[^ ]* */\1/g' | tr '[:lower:]' '[:upper:]' | sed 's/ //g' | cut -c1-3)
    if [ -z "$INITIALS" ]; then
        INITIALS="PW"
    fi

    PRIMARY_COLOR="#1B4332"
    if [ -f "$CLIENT_DIR/config.json" ]; then
        MOOD=$(grep -o '"mood"[[:space:]]*:[[:space:]]*"[^"]*"' "$CLIENT_DIR/config.json" 2>/dev/null | head -1 | sed 's/.*"mood"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')
        case "$MOOD" in
            bold-urgent)   PRIMARY_COLOR="#111111" ;;
            premium-modern) PRIMARY_COLOR="#111827" ;;
        esac
    fi

    cat > "$IMAGES_DIR/logo.svg" << LOGOSVG
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <rect width="200" height="200" rx="40" fill="$PRIMARY_COLOR"/>
  <text x="100" y="120" font-family="Plus Jakarta Sans, sans-serif" font-size="80" font-weight="700" fill="white" text-anchor="middle" dominant-baseline="middle">$INITIALS</text>
</svg>
LOGOSVG
    echo "  Generated initials logo: $INITIALS ($IMAGES_DIR/logo.svg)"
else
    echo "  Logo exists, skipping"
fi

echo ""
echo "✅ Images ready in: $IMAGES_DIR"
ls -la "$IMAGES_DIR/" 2>/dev/null
