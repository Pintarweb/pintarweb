#!/bin/bash
# Migrate D1 database to Phase 3 schema (adds billing fields + customer_email)
# Usage: bash scripts/migrate-outreach-db.sh

set -e

if [ -f "$(dirname "$0")/../.env" ]; then
    export $(grep -v '^#' "$(dirname "$0")/../.env" | xargs)
fi

D1_DB_ID="${CLOUDFLARE_D1_DATABASE_ID:-}"

if [ -z "$D1_DB_ID" ]; then
    echo "Error: CLOUDFLARE_D1_DATABASE_ID not found in .env"
    exit 1
fi

echo "Migrating D1 database: $D1_DB_ID"
echo ""

# Columns to add
MIGRATIONS=(
    "setup_paid|INTEGER DEFAULT 0"
    "setup_paid_date|TEXT"
    "setup_amount|INTEGER"
    "invoice_number|TEXT"
    "plan_type|TEXT DEFAULT 'monthly'"
    "subscription_id|TEXT"
    "subscription_start|TEXT"
    "subscription_status|TEXT DEFAULT 'new'"
    "billing_reminder_sent|INTEGER DEFAULT 0"
    "billing_reminder_date|TEXT"
    "customer_email|TEXT"
)

for migration in "${MIGRATIONS[@]}"; do
    COLUMN=$(echo "$migration" | cut -d'|' -f1)
    TYPE=$(echo "$migration" | cut -d'|' -f2)

    # Check if column already exists
    EXISTS=$(cd "$(dirname "$0")/.." && npx wrangler d1 execute "$D1_DB_ID" --remote --yes --command="PRAGMA table_info(outreach_leads);" 2>/dev/null | grep -c "\"$COLUMN\"" || true)

    if [ "$EXISTS" -gt 0 ]; then
        echo "  ⏭️  $COLUMN already exists, skipping"
    else
        echo "  ➕ Adding $COLUMN ($TYPE)..."
        cd "$(dirname "$0")/.." && npx wrangler d1 execute "$D1_DB_ID" --remote --yes --command="ALTER TABLE outreach_leads ADD COLUMN $COLUMN $TYPE;" 2>/dev/null
        echo "  ✅ $COLUMN added"
    fi
done

echo ""
echo "✅ Migration complete!"

# Verify
echo ""
echo "Current schema:"
cd "$(dirname "$0")/.." && npx wrangler d1 execute "$D1_DB_ID" --remote --yes --command="PRAGMA table_info(outreach_leads);" 2>/dev/null | grep -E '"name"' | while read line; do
    COL=$(echo "$line" | grep -o '"[^"]*"' | sed -n '2p' | tr -d '"')
    echo "  - $COL"
done
