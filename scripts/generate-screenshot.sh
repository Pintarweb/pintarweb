#!/bin/bash
# Generate screenshot of a demo site using Playwright
# Usage: bash scripts/generate-screenshot.sh --url "https://..." --output "/path/to/output.png"
#
# Requires: Playwright (from pintarweb-scraper/node_modules)
# Playwright browsers must be installed: npx playwright install chromium

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRAPER_NODE_MODULES="/home/yusmarin/projects/pintarweb-scraper/node_modules"

URL=""
OUTPUT=""

while [ $# -gt 0 ]; do
    case "$1" in
        --url)
            URL="$2"
            shift 2
            ;;
        --output)
            OUTPUT="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            shift
            ;;
    esac
done

if [ -z "$URL" ] || [ -z "$OUTPUT" ]; then
    echo "Usage: bash scripts/generate-screenshot.sh --url \"https://...\" --output \"/path/to/output.png\""
    echo ""
    echo "Required:"
    echo "  --url     Full URL of the page to screenshot"
    echo "  --output  Output file path (PNG)"
    exit 1
fi

OUTPUT_DIR="$(dirname "$OUTPUT")"
mkdir -p "$OUTPUT_DIR"

echo ""
echo "📸 Generating screenshot..."
echo "   URL: $URL"
echo "   Output: $OUTPUT"
echo ""

# Create a temporary JS script to run with Playwright
NODE_SCRIPT="/tmp/_screenshot_playwright_$$.mjs"

cat > "$NODE_SCRIPT" << 'NODEEOF'
import { chromium } from '/SCRAPER_NODE_MODULES/playwright/index.mjs';

const url = process.argv[2];
const outputPath = process.argv[3];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
});

const page = await context.newPage();
await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(1000);

await page.screenshot({ path: outputPath, fullPage: false, type: 'png' });
await browser.close();

console.log('✅ Screenshot saved to: ' + outputPath);
NODEEOF

# Replace placeholder with actual path
sed -i "s|/SCRAPER_NODE_MODULES/playwright|$SCRAPER_NODE_MODULES/playwright|g" "$NODE_SCRIPT"

# Run the script
node "$NODE_SCRIPT" "$URL" "$OUTPUT"

# Clean up
rm -f "$NODE_SCRIPT"

echo ""
echo "Done: $OUTPUT"
