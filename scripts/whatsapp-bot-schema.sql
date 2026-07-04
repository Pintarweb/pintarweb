-- WhatsApp Bot Configuration Tables
-- Run this against your remote D1 database:
-- npx wrangler d1 execute pintarweb-outreach-db --remote --file=scripts/watsapp-bot-schema.sql

-- Per-client WhatsApp bot configuration
CREATE TABLE IF NOT EXISTS whatsapp_bot_config (
    waba_id TEXT PRIMARY KEY,
    business_name TEXT NOT NULL,
    services TEXT NOT NULL,
    pricing TEXT NOT NULL,
    area TEXT NOT NULL,
    owner_notification TEXT NOT NULL,
    greeting_sent INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Track which customers have received the greeting (to send it only once)
CREATE TABLE IF NOT EXISTS whatsapp_bot_greetings (
    waba_id TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    sent_at TEXT NOT NULL,
    PRIMARY KEY (waba_id, customer_phone)
);

-- Lead notifications sent to owner
CREATE TABLE IF NOT EXISTS whatsapp_bot_leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    waba_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    message TEXT NOT NULL,
    owner_notified INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Conversation history per customer (last 6 messages for context)
CREATE TABLE IF NOT EXISTS whatsapp_bot_conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    waba_id TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    role TEXT NOT NULL, -- 'customer' or 'assistant'
    message TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Index for fast lookup of recent conversations
CREATE INDEX IF NOT EXISTS idx_conversations_lookup
ON whatsapp_bot_conversations(waba_id, customer_phone, created_at DESC);
