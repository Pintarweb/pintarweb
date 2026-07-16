-- Migration 001b: Migrate PintarWeb Data
-- Seeds PintarWeb as client #1 and populates new tables with existing data
-- Executed: 2026-07-12

-- ============================================================
-- Client #1: PintarWeb (pilot client)
-- UUID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
-- ============================================================

INSERT INTO clients (id, company_name, subscription_status, subscription_tier, subscription_start, owner_name, owner_phone, created_at, updated_at)
VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'PintarWeb',
    'active',
    'asas',
    '2026-07-01',
    'Yus',
    '+60174456243',
    datetime('now'),
    datetime('now')
);

-- ============================================================
-- WABA Account: PintarWeb's existing bot
-- phone_number_id: 872026605987484 (from env META_PHONE_NUMBER_ID)
-- waba_id: 727271803683109 (from env META_WABA_ID)
-- access_token: stored as META_ACCESS_TOKEN env var initially
-- NOTE: Token will be migrated to this table once admin dashboard is built
-- ============================================================

INSERT INTO waba_accounts (id, client_id, waba_id, phone_number_id, phone_number, access_token, display_name, is_default, status, created_at, updated_at)
VALUES (
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    '727271803683109',
    '872026605987484',
    '+60174456243',
    'META_ACCESS_TOKEN',  -- placeholder; real token stored in Cloudflare secrets, migrated via dashboard
    'PintarWeb HQ',
    1,
    'active',
    datetime('now'),
    datetime('now')
);

-- ============================================================
-- Client Features: PintarWeb (Asas tier defaults)
-- ============================================================

INSERT INTO client_features (id, client_id, feature, enabled, value, created_at, updated_at) VALUES
    ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'auto_reply_limit', 1, '30', datetime('now'), datetime('now')),
    ('d4e5f6a7-b8c9-0123-defa-234567890123', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'booking', 0, NULL, datetime('now'), datetime('now')),
    ('e5f6a7b8-c9d0-1234-efab-345678901234', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'review_automation', 0, NULL, datetime('now'), datetime('now')),
    ('f6a7b8c9-d0e1-2345-fabc-456789012345', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'voice_agent', 0, NULL, datetime('now'), datetime('now')),
    ('a7b8c9d0-e1f2-3456-abcd-567890123456', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'missed_call_reply', 0, NULL, datetime('now'), datetime('now')),
    ('b8c9d0e1-f2a3-4567-bcde-678901234567', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'crm_sync', 0, NULL, datetime('now'), datetime('now'));

-- ============================================================
-- KB Knowledge: migrate from whatsapp_bot_niche_knowledge
-- (global per niche, shared across all clients — seeded once per niche)
-- Existing niche data is re-inserted with proper schema
-- ============================================================

INSERT INTO kb_knowledge (id, client_id, waba_id, knowledge_scope, niche, faq_json, price_ranges_json, objections_json, version, is_active, created_at, updated_at)
SELECT
    lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random() % 4)+1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))),
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    NULL,  -- shared across all WABAs
    'shared',
    id,
    faq_json,
    price_ranges_json,
    objections_json,
    version,
    is_active,
    created_at,
    datetime('now')
FROM whatsapp_bot_niche_knowledge
WHERE is_active = 1;

-- ============================================================
-- System Prompts: migrate from whatsapp_bot_system_prompts
-- ============================================================

INSERT INTO bot_system_prompts (id, client_id, prompt_type, prompt_text, version, is_active, created_at, updated_at)
SELECT
    lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random() % 4)+1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))),
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    prompt_type,
    prompt_text,
    version,
    is_active,
    created_at,
    datetime('now')
FROM whatsapp_bot_system_prompts
WHERE is_active = 1;

-- ============================================================
-- Backfill client_id in existing bot tables (all point to PintarWeb)
-- ============================================================

UPDATE whatsapp_bot_config SET client_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' WHERE waba_id = '727271803683109';
UPDATE whatsapp_bot_conversations SET client_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' WHERE waba_id = '727271803683109';
UPDATE whatsapp_bot_greetings SET client_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' WHERE waba_id = '727271803683109';
UPDATE whatsapp_bot_leads SET client_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' WHERE waba_id = '727271803683109';
UPDATE whatsapp_bot_pending_llm_requests SET client_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' WHERE waba_id = '727271803683109';
