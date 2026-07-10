-- WhatsApp Bot 3-Layer Knowledge Base Migration
-- Run against: npx wrangler d1 execute pintarweb-claude-db --remote --file=scripts/migrate-whatsapp-layers.sql
-- Or for local: npx wrangler d1 execute pintarweb-claude-db --local --file=scripts/migrate-whatsapp-layers.sql

-- Step 1: Rename existing 'pricing' column to 'price_display' for clarity
ALTER TABLE whatsapp_bot_config RENAME COLUMN pricing TO price_display;

-- Step 2: Add Layer 3 fields to whatsapp_bot_config
ALTER TABLE whatsapp_bot_config ADD COLUMN niche TEXT DEFAULT 'pintarweb';
ALTER TABLE whatsapp_bot_config ADD COLUMN business_hours TEXT;
ALTER TABLE whatsapp_bot_config ADD COLUMN closing_flow_enabled INTEGER DEFAULT 1;

-- Step 3: Create system prompts table (Layer 1)
CREATE TABLE IF NOT EXISTS whatsapp_bot_system_prompts (
    id TEXT PRIMARY KEY,
    prompt_type TEXT NOT NULL,           -- 'base' | 'fallback'
    prompt_text TEXT NOT NULL,
    version INTEGER DEFAULT 1,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Step 4: Create niche knowledge table (Layer 2)
CREATE TABLE IF NOT EXISTS whatsapp_bot_niche_knowledge (
    id TEXT PRIMARY KEY,                  -- 'pintarweb' | 'aircond' | 'plumbing' | 'electrical' | 'reno'
    faq_json TEXT NOT NULL,               -- JSON array of {keywords: string[], answer: string, intent: string}
    price_ranges_json TEXT,                -- JSON object of {service: "RM80-150", ...}
    objections_json TEXT,                  -- JSON array of {objection: string, response: string}
    version INTEGER DEFAULT 1,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Step 5: Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_prompts_type_active 
ON whatsapp_bot_system_prompts(prompt_type, is_active);

CREATE INDEX IF NOT EXISTS idx_niche_active 
ON whatsapp_bot_niche_knowledge(id, is_active);

CREATE INDEX IF NOT EXISTS idx_config_niche 
ON whatsapp_bot_config(niche);

-- Step 6: Print confirmation
SELECT 'Migration complete: whatsapp_bot_config extended, whatsapp_bot_system_prompts and whatsapp_bot_niche_knowledge created' AS status;
