-- WhatsApp Bot Async LLM Migration
-- Add pending requests table for async LLM processing
-- Run: npx wrangler d1 execute pintarweb-claude-db --remote --file=scripts/migrate-whatsapp-async.sql

CREATE TABLE IF NOT EXISTS whatsapp_bot_pending_llm_requests (
    id TEXT PRIMARY KEY,
    waba_id TEXT NOT NULL,
    phone_number_id TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    message_id TEXT NOT NULL,
    prompt TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    error_message TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    completed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_pending_status_created
ON whatsapp_bot_pending_llm_requests(status, created_at);

CREATE INDEX IF NOT EXISTS idx_pending_waba_phone
ON whatsapp_bot_pending_llm_requests(waba_id, customer_phone);

SELECT 'Migration complete: whatsapp_bot_pending_llm_requests created' AS status;
