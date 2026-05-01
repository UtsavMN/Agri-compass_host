-- Create posts table for community features
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  farm_id UUID REFERENCES farms(id),
  title TEXT,
  body TEXT NOT NULL,
  crop_tags TEXT[] DEFAULT '{}',
  location TEXT,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read posts"
  ON posts FOR SELECT
  USING (true);

CREATE POLICY "Users can create posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_crop_tags ON posts USING GIN(crop_tags);
CREATE INDEX IF NOT EXISTS idx_posts_location ON posts(location);
