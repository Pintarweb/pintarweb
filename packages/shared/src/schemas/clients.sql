CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    business_name TEXT NOT NULL,
    niche TEXT,
    subdomain TEXT,
    status TEXT DEFAULT 'draft',
    created_at TEXT DEFAULT (datetime('now')),
    config_json TEXT
);

CREATE TABLE IF NOT EXISTS outreach_events (
    id TEXT PRIMARY KEY,
    lead_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    timestamp TEXT DEFAULT (datetime('now')),
    notes TEXT,
    FOREIGN KEY (lead_id) REFERENCES leads(id)
);

CREATE INDEX IF NOT EXISTS idx_events_lead ON outreach_events(lead_id);

CREATE TABLE IF NOT EXISTS hunt_logs (
    id TEXT PRIMARY KEY,
    category TEXT,
    location TEXT,
    sources TEXT,
    max_leads INTEGER,
    leads_found INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
