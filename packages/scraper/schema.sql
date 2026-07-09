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
    -- GMB / Google Business Profile fields
    gmb_listing_found INTEGER DEFAULT 0,
    gmb_verification_status TEXT DEFAULT 'none',
    gmb_listing_complete INTEGER DEFAULT 0,
    gmb_photo_count INTEGER DEFAULT 0,
    gmb_has_hours INTEGER DEFAULT 0,
    gmb_has_description INTEGER DEFAULT 0,
    gmb_review_count INTEGER DEFAULT 0,
    gmb_rating TEXT DEFAULT '0',
    gmb_responds_to_reviews INTEGER DEFAULT 0,
    gmb_attributes TEXT,
    gmb_listing_url TEXT,
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
