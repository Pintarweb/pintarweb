#!/bin/bash
# View outreach dashboard from D1 database
# Usage: bash scripts/view-outreach.sh [--limit 20]

set -e

# Load .env if exists
if [ -f "$(dirname "$0")/../.env" ]; then
    export $(grep -v '^#' "$(dirname "$0")/../.env" | xargs)
fi

D1_DB_ID="${CLOUDFLARE_D1_DATABASE_ID:-}"
LIMIT="${1:-20}"

if [ -z "$D1_DB_ID" ]; then
    echo "Error: CLOUDFLARE_D1_DATABASE_ID not found in .env"
    exit 1
fi

echo ""
echo "═══════════════════════════════════════════════"
echo "         PINTARWEB OUTREACH DASHBOARD"
echo "═══════════════════════════════════════════════"
echo ""

# Status breakdown
echo "📊 STATUS BREAKDOWN"
echo "───────────────────────────────────────────────"

STATUS_SQL="
SELECT status, COUNT(*) as count
FROM outreach_leads
GROUP BY status
ORDER BY count DESC;
"

cd "$(dirname "$0")/.." && npx wrangler d1 execute "$D1_DB_ID" --remote --yes --command="$STATUS_SQL" 2>/dev/null | while read line; do
    echo "  $line"
done

echo ""

# Total leads
TOTAL_SQL="SELECT COUNT(*) as total FROM outreach_leads;"
TOTAL=$(cd "$(dirname "$0")/.." && npx wrangler d1 execute "$D1_DB_ID" --remote --yes --command="$TOTAL_SQL" 2>/dev/null | grep -E "^[0-9]+$" || echo "0")
echo "📈 Total Leads: $TOTAL"
echo ""

# High priority leads
echo "⭐ HIGH PRIORITY LEADS"
echo "───────────────────────────────────────────────"

HIGH_SQL="
SELECT id, business_name, phone, area, score, status
FROM outreach_leads
WHERE score >= 60
ORDER BY score DESC
LIMIT 10;
"

cd "$(dirname "$0")/.." && npx wrangler d1 execute "$D1_DB_ID" --remote --yes --command="$HIGH_SQL" 2>/dev/null

echo ""

# Recent activity
echo "🕐 RECENT ACTIVITY"
echo "───────────────────────────────────────────────"

ACTIVITY_SQL="
SELECT
    e.event_type,
    l.business_name,
    e.created_at
FROM outreach_events e
JOIN outreach_leads l ON e.lead_id = l.id
ORDER BY e.created_at DESC
LIMIT 5;
"

cd "$(dirname "$0")/.." && npx wrangler d1 execute "$D1_DB_ID" --remote --yes --command="$ACTIVITY_SQL" 2>/dev/null

echo ""

# Conversion funnel
echo "🎯 CONVERSION FUNNEL"
echo "───────────────────────────────────────────────"

FUNNEL_SQL="
SELECT
    SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_leads,
    SUM(CASE WHEN status = 'contacted' THEN 1 ELSE 0 END) as contacted,
    SUM(CASE WHEN status = 'demo_viewed' THEN 1 ELSE 0 END) as demo_viewed,
    SUM(CASE WHEN status = 'wa_clicked' THEN 1 ELSE 0 END) as wa_clicked,
    SUM(CASE WHEN status = 'replied' THEN 1 ELSE 0 END) as replied,
    SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid
FROM outreach_leads;
"

cd "$(dirname "$0")/.." && npx wrangler d1 execute "$D1_DB_ID" --remote --yes --command="$FUNNEL_SQL" 2>/dev/null

echo ""
echo "═══════════════════════════════════════════════"
