-- Migration 001: Multi-Tenant Schema
-- Replaces waba_id-keyed tables with client_id primary tenant key
-- Executed: 2026-07-12

-- ============================================================
-- STEP 1: Create new tables
-- ============================================================

-- Existing `clients` table is empty — rename it and recreate properly.
-- We do this in 3 steps: (a) rename old, (b) create new, (c) copy data

ALTER TABLE clients RENAME TO clients_old;

CREATE TABLE clients (
    id TEXT PRIMARY KEY,                    -- UUID v4
    company_name TEXT NOT NULL,             -- Legal / display name
    subscription_status TEXT DEFAULT 'trial', -- 'trial' | 'active' | 'suspended' | 'cancelled'
    subscription_tier TEXT,                 -- 'asas' | 'bisnes' | 'pro'
    subscription_start TEXT,                -- ISO date
    subscription_end TEXT,                  -- ISO date
    billing_cycle TEXT DEFAULT 'monthly',    -- 'monthly' | 'quarterly' | 'biannual' | 'annual'
    owner_name TEXT,
    owner_email TEXT,
    owner_phone TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    config_json TEXT                        -- Arbitrary extra config
);

-- Copy any existing data from old clients table (expected: empty at migration time)
INSERT INTO clients (id, company_name, subscription_status, created_at)
SELECT id, business_name, status, created_at FROM clients_old;
DROP TABLE clients_old;

-- WABA accounts mapping (one client can have many phone numbers)
CREATE TABLE waba_accounts (
    id TEXT PRIMARY KEY,                    -- UUID v4
    client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    waba_id TEXT NOT NULL,                 -- Meta's WABA ID (external)
    phone_number_id TEXT NOT NULL,         -- Meta's phone number ID (external)
    phone_number TEXT,                     -- Human-readable e.g. +60121111111
    access_token TEXT NOT NULL,            -- Meta long-lived access token
    business_account_id TEXT,              -- Meta business account ID
    display_name TEXT,                     -- Friendly label e.g. "Aircond Division"
    is_default INTEGER DEFAULT 0,          -- 1 = primary number for outbound
    status TEXT DEFAULT 'active',          -- 'active' | 'suspended' | 'pending'
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Per-client feature flags (supersedes hardcoded tier logic)
CREATE TABLE client_features (
    id TEXT PRIMARY KEY,                    -- UUID v4
    client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    feature TEXT NOT NULL,                -- e.g. 'auto_reply_limit', 'booking', 'voice_agent'
    enabled INTEGER DEFAULT 0,              -- 1 = enabled, 0 = disabled
    value TEXT,                            -- Optional value e.g. "100" for limit
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    UNIQUE(client_id, feature)
);

-- Knowledge base entries (replaces whatsapp_bot_niche_knowledge)
-- Supports shared KB (all WABAs of client) or per-department (specific WABA)
CREATE TABLE kb_knowledge (
    id TEXT PRIMARY KEY,                    -- UUID v4
    client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    waba_id TEXT,                          -- NULL = shared across all WABAs; TEXT = specific WABA
    knowledge_scope TEXT DEFAULT 'shared',  -- 'shared' | 'department'
    niche TEXT NOT NULL,                   -- e.g. 'pintarweb' | 'aircond' | 'plumbing'
    faq_json TEXT NOT NULL,                -- JSON array of FAQ entries
    price_ranges_json TEXT,                -- JSON object of price ranges
    objections_json TEXT,                  -- JSON array of objection-response pairs
    version INTEGER DEFAULT 1,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- System prompts (global per client, replaces whatsapp_bot_system_prompts)
CREATE TABLE bot_system_prompts (
    id TEXT PRIMARY KEY,                    -- UUID v4
    client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    prompt_type TEXT NOT NULL,            -- 'base' | 'fallback'
    prompt_text TEXT NOT NULL,
    version INTEGER DEFAULT 1,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    UNIQUE(client_id, prompt_type)
);

-- ============================================================
-- STEP 2: Add client_id to existing bot tables
-- ============================================================

-- whatsapp_bot_config: add client_id, keep waba_id as external ref
ALTER TABLE whatsapp_bot_config ADD COLUMN client_id TEXT REFERENCES clients(id);

-- whatsapp_bot_conversations: add client_id
ALTER TABLE whatsapp_bot_conversations ADD COLUMN client_id TEXT REFERENCES clients(id);

-- whatsapp_bot_greetings: add client_id
ALTER TABLE whatsapp_bot_greetings ADD COLUMN client_id TEXT REFERENCES clients(id);

-- whatsapp_bot_leads: add client_id
ALTER TABLE whatsapp_bot_leads ADD COLUMN client_id TEXT REFERENCES clients(id);

-- whatsapp_bot_pending_llm_requests: add client_id
ALTER TABLE whatsapp_bot_pending_llm_requests ADD COLUMN client_id TEXT REFERENCES clients(id);

-- ============================================================
-- STEP 3: Indexes for performance
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_waba_accounts_client_id ON waba_accounts(client_id);
CREATE INDEX IF NOT EXISTS idx_waba_accounts_phone_number_id ON waba_accounts(phone_number_id);
CREATE INDEX IF NOT EXISTS idx_waba_accounts_waba_id ON waba_accounts(waba_id);
CREATE INDEX IF NOT EXISTS idx_client_features_client_id ON client_features(client_id);
CREATE INDEX IF NOT EXISTS idx_kb_knowledge_client_id ON kb_knowledge(client_id);
CREATE INDEX IF NOT EXISTS idx_kb_knowledge_waba_id ON kb_knowledge(waba_id);
CREATE INDEX IF NOT EXISTS idx_bot_system_prompts_client_id ON bot_system_prompts(client_id);
CREATE INDEX IF NOT EXISTS idx_config_client_id ON whatsapp_bot_config(client_id);
CREATE INDEX IF NOT EXISTS idx_conversations_client_id ON whatsapp_bot_conversations(client_id);
CREATE INDEX IF NOT EXISTS idx_greetings_client_id ON whatsapp_bot_greetings(client_id);
CREATE INDEX IF NOT EXISTS idx_leads_client_id ON whatsapp_bot_leads(client_id);
CREATE INDEX IF NOT EXISTS idx_pending_client_id ON whatsapp_bot_pending_llm_requests(client_id);
