-- 1. Users / Creator Accounts
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    artist_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'CREATOR',
    accrued_royalties INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Digital DSP Releases
CREATE TABLE IF NOT EXISTS dsp_releases (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    artist VARCHAR(100) NOT NULL,
    genre VARCHAR(50) NOT NULL,
    upc_code VARCHAR(50),
    isrc_code VARCHAR(50),
    audio_url VARCHAR(512),
    status VARCHAR(50) DEFAULT 'DRAFT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Sync Placement Briefs (Opportunities)
CREATE TABLE IF NOT EXISTS sync_briefs (
    id SERIAL PRIMARY KEY,
    project_title VARCHAR(200) NOT NULL,
    client_name VARCHAR(150) NOT NULL,
    budget_fee INT NOT NULL,
    required_genre VARCHAR(100) NOT NULL,
    required_mood VARCHAR(100) NOT NULL,
    deadline_text VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- 4. Escrow Splits Ledger (Pitches & Invoices)
CREATE TABLE IF NOT EXISTS escrow_splits (
    id SERIAL PRIMARY KEY,
    brief_id INT REFERENCES sync_briefs(id),
    user_id INT REFERENCES users(id),
    song_title VARCHAR(200) NOT NULL,
    artist VARCHAR(100) NOT NULL,
    disbursal_status VARCHAR(50) DEFAULT 'ESCROW_HOLD',
    agency_split_pct DECIMAL(5,2) DEFAULT 30.00,
    platform_split_pct DECIMAL(5,2) DEFAULT 25.00,
    creator_split_pct DECIMAL(5,2) DEFAULT 45.00,
    calculated_agency_share INT,
    calculated_platform_share INT,
    calculated_creator_share INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Advice Blog Articles
CREATE TABLE IF NOT EXISTS blog_articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image VARCHAR(512),
    read_time VARCHAR(50),
    category VARCHAR(100),
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. User Activated Ecosystem Apps
CREATE TABLE IF NOT EXISTS user_apps (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    app_id VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    activated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_app UNIQUE(user_id, app_id)
);

-- 7. DNS Custom Domain Mappings
CREATE TABLE IF NOT EXISTS domain_mappings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    host_domain VARCHAR(255) UNIQUE NOT NULL,
    target_mapping VARCHAR(100) NOT NULL,
    verification_status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
