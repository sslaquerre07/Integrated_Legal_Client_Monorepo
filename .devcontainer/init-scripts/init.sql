CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. The Nodes table manages the folder structure and file identities
CREATE TABLE IF NOT EXISTS nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    is_folder BOOLEAN NOT NULL,
    parent_id UUID REFERENCES nodes(id) ON DELETE CASCADE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);