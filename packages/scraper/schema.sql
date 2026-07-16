CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    phone_normalized TEXT UNIQUE,
    business_name TEXT,
    category TEXT,
    address TEXT,
    maps_url TEXT,
    source_origin TEXT,
    website_url TEXT,
    whatsapp_link TEXT,
    status TEXT DEFAULT 'New',
    pipeline_stage TEXT DEFAULT 'new',
    lead_score INTEGER DEFAULT 0,
    -- Demo pipeline fields
    tagline TEXT,
    niche TEXT,
    services TEXT,
    testimonials TEXT,
    images_collected INTEGER DEFAULT 0,
    selected_for_pipeline INTEGER DEFAULT 0,
    demo_built_at DATETIME,
    demo_url TEXT,
    audit_url TEXT,
    screenshot_path TEXT,
    outreach_sent_at DATETIME,
    -- Link to production client (after subscription)
    client_id TEXT,
    -- AI enrichment
    audit_results TEXT,
    ai_pain_point TEXT,
    source_links TEXT,
    -- Social media links
    facebook_url TEXT,
    instagram_url TEXT,
    tiktok_url TEXT,
    email TEXT,
    -- Business hours (JSON format)
    business_hours TEXT,
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
    profile_name TEXT,
    category TEXT,
    location TEXT,
    sources TEXT,
    max_leads INTEGER,
    leads_found INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

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
