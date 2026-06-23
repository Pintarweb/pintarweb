CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    phone_normalized TEXT UNIQUE,
    business_name TEXT NOT NULL,
    category TEXT,
    address TEXT,
    area TEXT,
    niche TEXT,
    maps_url TEXT,
    source TEXT,
    website_url TEXT,
    has_website INTEGER DEFAULT 0,
    whatsapp_link TEXT,
    instagram_handle TEXT,
    instagram_active INTEGER DEFAULT 0,
    tiktok_active INTEGER DEFAULT 0,
    google_rating REAL,
    review_count INTEGER,
    status TEXT DEFAULT 'New',
    outreach_status TEXT DEFAULT 'new',
    lead_score INTEGER DEFAULT 0,
    audit_results TEXT,
    ai_pain_point TEXT,
    source_links TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_outreach ON leads(outreach_status);
CREATE INDEX IF NOT EXISTS idx_leads_area ON leads(area);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(lead_score);
