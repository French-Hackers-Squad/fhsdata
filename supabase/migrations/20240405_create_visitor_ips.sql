-- Create visitor_ips table
CREATE TABLE IF NOT EXISTS visitor_ips (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ip_address INET NOT NULL,
    user_agent TEXT,
    visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    page_visited TEXT,
    country TEXT,
    city TEXT,
    username TEXT,
    is_logged_in BOOLEAN DEFAULT FALSE,
    visit_count INTEGER DEFAULT 1
);

-- Create index on ip_address for faster lookups
CREATE INDEX IF NOT EXISTS idx_visitor_ips_ip_address ON visitor_ips(ip_address);

-- Create index on visited_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_visitor_ips_visited_at ON visitor_ips(visited_at);

-- Create index on username for user-based queries
CREATE INDEX IF NOT EXISTS idx_visitor_ips_username ON visitor_ips(username);

-- Enable RLS
ALTER TABLE visitor_ips ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert and update their own IP records
CREATE POLICY "Allow anonymous users to insert their IP"
ON visitor_ips
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow anonymous users to update their IP"
ON visitor_ips
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- Allow authenticated users to view all records
CREATE POLICY "Allow authenticated users to view all IPs"
ON visitor_ips
FOR SELECT
TO authenticated
USING (true); 