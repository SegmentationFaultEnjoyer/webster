-- Create the projects table
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  owner TEXT,
  content JSON NOT NULL,
  aws_banner_key TEXT DEFAULT '',
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE nfts (
  id SERIAL PRIMARY KEY,
  contract_address TEXT NOT NULL,
  token_id BIGINT NOT NULL,
  price TEXT NOT NULL,
  title TEXT NOT NULL,
  buyer TEXT default '',
  seller TEXT NOT NULL,
  token_uri text NOT NULL,
  created_at TIMESTAMP NOT NULL,
  is_enabled BOOLEAN DEFAULT true
);