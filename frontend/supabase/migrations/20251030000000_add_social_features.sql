-- Add social features: likes, comments, and notifications

-- Create likes table
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('like', 'comment', 'follow', 'mention')),
  ref_id UUID NOT NULL, -- post_id or comment_id
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Likes policies
CREATE POLICY "Anyone can read likes"
  ON likes FOR SELECT
  USING (true);

CREATE POLICY "Users can create likes"
  ON likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes"
  ON likes FOR DELETE
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

-- Notifications policies
CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Functions for notifications
CREATE OR REPLACE FUNCTION notify_like()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create notification if the liker is not the post author
  IF NEW.user_id != (SELECT user_id FROM posts WHERE id = NEW.post_id) THEN
    INSERT INTO notifications (user_id, type, ref_id)
    VALUES (
      (SELECT user_id FROM posts WHERE id = NEW.post_id),
      'like',
      NEW.post_id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION notify_comment()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create notification if the commenter is not the post author
  IF NEW.user_id != (SELECT user_id FROM posts WHERE id = NEW.post_id) THEN
    INSERT INTO notifications (user_id, type, ref_id)
    VALUES (
      (SELECT user_id FROM posts WHERE id = NEW.post_id),
      'comment',
      NEW.post_id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER trigger_notify_like
  AFTER INSERT ON likes
  FOR EACH ROW
  EXECUTE FUNCTION notify_like();

CREATE TRIGGER trigger_notify_comment
  AFTER INSERT ON comments
  FOR EACH ROW
  EXECUTE FUNCTION notify_comment();
