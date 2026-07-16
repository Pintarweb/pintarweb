-- Migration 002: Add hunt_profiles, rotation_state tables + profile_name to hunt_logs
-- Run: npx wrangler d1 execute pintarweb-scraper-db --file=migrations/002_hunt_profiles.sql

CREATE TABLE IF NOT EXISTS hunt_profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    label TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    `limit` INTEGER DEFAULT 50,
    sources TEXT DEFAULT 'Maps,FB',
    sort_order INTEGER DEFAULT 0,
    enabled INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rotation_state (
    id INTEGER PRIMARY KEY DEFAULT 1,
    current_index INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO rotation_state (id, current_index) VALUES (1, 0);

ALTER TABLE hunt_logs ADD COLUMN profile_name TEXT;

-- Seed existing profiles from hunt-profiles.json (run manually if needed)
-- These will be created via dashboard UI or seed endpoint
