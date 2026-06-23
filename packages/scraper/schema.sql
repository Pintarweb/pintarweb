CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    phone_normalized TEXT UNIQUE,
    business_name TEXT,
    category TEXT,
    address TEXT,
    maps_url TEXT,
    source TEXT,
    website_url TEXT,
    whatsapp_link TEXT,
    status TEXT DEFAULT 'New',
    lead_score INTEGER DEFAULT 0,
    audit_results TEXT,
    ai_pain_point TEXT,
    source_links TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hunt_logs (
    id TEXT PRIMARY KEY,
    category TEXT,
    location TEXT,
    sources TEXT,
    max_leads INTEGER,
    leads_found INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
