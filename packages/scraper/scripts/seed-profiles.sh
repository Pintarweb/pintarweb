#!/usr/bin/env bash
set -euo pipefail

# Seed hunt-profiles.json into D1 /api/profiles/seed
# Run once after deploying the updated worker

DIR="$(cd "$(dirname "$0")/.." && pwd)"
WORKER="${WORKER_URL:-https://pintarweb-scraper.yusmarin.workers.dev}"

if [[ ! -f "$DIR/hunt-profiles.json" ]]; then
    echo "❌ No hunt-profiles.json found"
    exit 1
fi

echo "📤 Seeding profiles from hunt-profiles.json → D1..."
echo "   Worker: $WORKER"
echo ""

# Extract each profile and POST to /api/profiles/seed
curl -sf -X POST "$WORKER/api/profiles/seed" \
  -H "Content-Type: application/json" \
  -d @"$DIR/hunt-profiles.json" || {
    echo "⚠️  Seed via API failed. Trying direct import..."
    echo "   Make sure wrangler is running or the worker is deployed."
    exit 1
}

echo ""
echo "✅ Profiles seeded! Verify at Dashboard → Profiles tab."
echo "   $WORKER/dashboard"
