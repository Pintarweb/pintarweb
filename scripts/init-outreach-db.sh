#!/bin/bash
# Initialize D1 database for outreach tracking
# Usage: bash scripts/init-outreach-db.sh

set -e

# Load .env if exists
if [ -f "$(dirname "$0")/../.env" ]; then
    export $(grep -v '^#' "$(dirname "$0")/../.env" | xargs)
fi

D1_DB_ID="${CLOUDFLARE_D1_DATABASE_ID:-}"

if [ -z "$D1_DB_ID" ]; then
    echo "Error: CLOUDFLARE_D1_DATABASE_ID not found in .env"
    echo "Please add it to your .env file"
    exit 1
fi

echo "Initializing D1 database: $D1_DB_ID"
echo ""

# Create tables using wrangler
echo "Creating tables..."

cd "$(dirname "$0")/.." && npx wrangler d1 execute "$D1_DB_ID" --remote --yes --command="
CREATE TABLE IF NOT EXISTS outreach_leads (
    id TEXT PRIMARY KEY,
    business_name TEXT NOT NULL,
    contact_name TEXT,
    phone TEXT NOT NULL,
    area TEXT,
    niche TEXT,
    demo_url TEXT,
    audit_url TEXT,
    status TEXT DEFAULT 'new' CHECK(status IN ('new', 'contacted', 'demo_viewed', 'wa_clicked', 'replied', 'paid', 'closed', 'bounced')),
    score INTEGER DEFAULT 0,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
"

echo "  ✅ outreach_leads table created"

cd "$(dirname "$0")/.." && npx wrangler d1 execute "$D1_DB_ID" --remote --yes --command="
CREATE TABLE IF NOT EXISTS outreach_events (
    id TEXT PRIMARY KEY,
    lead_id TEXT NOT NULL REFERENCES outreach_leads(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK(event_type IN ('lead_created', 'demo_sent', 'audit_sent', 'wa_clicked', 'demo_viewed', 'audit_viewed', 'replied', 'payment_link_sent', 'paid', 'closed', 'bounced')),
    metadata TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);
"

echo "  ✅ outreach_events table created"

# Create index for faster lookups
cd "$(dirname "$0")/.." && npx wrangler d1 execute "$D1_DB_ID" --remote --yes --command="
CREATE INDEX IF NOT EXISTS idx_events_lead_id ON outreach_events(lead_id);
"

echo "  ✅ Indexes created"

echo ""
echo "✅ D1 database initialized successfully!"
echo ""
echo "Tables:"
echo "  - outreach_leads: Stores prospect information"
echo "  - outreach_events: Tracks all interactions"
