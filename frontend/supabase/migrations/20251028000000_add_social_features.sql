-- Add social features schema

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    kn_caption TEXT,
    images TEXT[] DEFAULT '{}',
    video_url TEXT,
    hashtags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    farm_id UUID REFERENCES farms(id),
    crop_id UUID REFERENCES crops(id),
    location TEXT
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES comments(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, post_id)
);

-- Follows table
CREATE TABLE IF NOT EXISTS follows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_bot BOOLEAN DEFAULT false,
    context JSON,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    data JSON NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Posts policies
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

-- Comments policies
CREATE POLICY "Anyone can read comments"
    ON comments FOR SELECT
    USING (true);

CREATE POLICY "Users can create comments"
    ON comments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
    ON comments FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
    ON comments FOR DELETE
    USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Anyone can read likes"
    ON likes FOR SELECT
    USING (true);

CREATE POLICY "Users can create/delete own likes"
    ON likes FOR ALL
    USING (auth.uid() = user_id);

-- Follows policies
CREATE POLICY "Anyone can read follows"
    ON follows FOR SELECT
    USING (true);

CREATE POLICY "Users can manage own follows"
    ON follows FOR ALL
    USING (auth.uid() = follower_id);

-- Chat messages policies
CREATE POLICY "Users can read own chat messages"
    ON chat_messages FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create chat messages"
    ON chat_messages FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can read own notifications"
    ON notifications FOR SELECT
    USING (auth.uid() = user_id);

-- Functions and triggers
CREATE OR REPLACE FUNCTION public.handle_new_post()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify followers
  INSERT INTO notifications (user_id, type, data)
  SELECT 
    follower_id,
    'new_post',
    json_build_object(
      'post_id', NEW.id,
      'user_id', NEW.user_id,
      'content', substring(NEW.content, 1, 100)
    )
  FROM follows
  WHERE following_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_new_post
  AFTER INSERT ON posts
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_post();

-- Create indices for better performance
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);