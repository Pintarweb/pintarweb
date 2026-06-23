CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    business_name TEXT NOT NULL,
    niche TEXT,
    subdomain TEXT,
    status TEXT DEFAULT 'draft',
    created_at TEXT DEFAULT (datetime('now')),
    config_json TEXT
  );

  CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    business_name TEXT NOT NULL,
    phone TEXT,
    area TEXT,
    niche TEXT,
    source TEXT,
    has_website INTEGER DEFAULT 0,
    website_url TEXT,
    instagram_handle TEXT,
    instagram_active INTEGER DEFAULT 0,
    tiktok_active INTEGER DEFAULT 0,
    google_rating REAL,
    review_count INTEGER,
    outreach_status TEXT DEFAULT 'new',
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS outreach_events (
    id TEXT PRIMARY KEY,
    lead_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    timestamp TEXT DEFAULT (datetime('now')),
    notes TEXT,
    FOREIGN KEY (lead_id) REFERENCES leads(id)
  );

  CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(outreach_status);
  CREATE INDEX IF NOT EXISTS idx_leads_area ON leads(area);
  CREATE INDEX IF NOT EXISTS idx_events_lead ON outreach_events(lead_id);