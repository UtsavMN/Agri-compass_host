-- 🌾 AGRI COMPASS — COMPLETE DATABASE SETUP (CLEAN VERSION)
-- Safe for re-runs (uses IF NOT EXISTS + drops duplicates)

-- =========================
-- 🧹 1️⃣ CLEANUP OLD POLICIES
-- =========================
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN SELECT schemaname, tablename, policyname FROM pg_policies
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "%s" ON %I.%I;', pol.policyname, pol.schemaname, pol.tablename);
  END LOOP;
END $$;

-- =========================
-- 👤 2️⃣ PROFILES TABLE
-- =========================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  full_name text,
  phone text,
  location text,
  language_preference text DEFAULT 'en',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- Auto profile creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, language_preference)
  VALUES (NEW.id, NEW.email, split_part(NEW.email, '@', 1), 'en');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger function runs with a privileged owner so it can
-- create rows in `public.profiles` even when invoked by the anon/guest
-- connection during sign-up. Setting the owner to `postgres` (or the
-- database superuser) lets the SECURITY DEFINER function bypass RLS for
-- this specific operation. If your Supabase project uses a different
-- superuser name, adjust accordingly.
ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- =========================
-- 🚜 3️⃣ FARMS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS public.farms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  location text NOT NULL,
  area_acres numeric,
  soil_type text,
  irrigation_type text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE farms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own farms"
  ON farms FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =========================
-- 🌱 4️⃣ CROPS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS public.crops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  category text,
  season text,
  duration_days integer,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE crops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view crops"
  ON crops FOR SELECT
  TO authenticated
  USING (true);

-- =========================
-- 💰 5️⃣ EXPENSES TABLE
-- =========================
CREATE TABLE IF NOT EXISTS public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id uuid REFERENCES farms(id) ON DELETE CASCADE,
  category text,
  amount numeric,
  description text,
  date date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own expenses"
  ON expenses FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM farms WHERE farms.id = expenses.farm_id AND farms.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM farms WHERE farms.id = expenses.farm_id AND farms.user_id = auth.uid())
  );

-- =========================
-- 🌾 6️⃣ YIELDS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS public.yields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id uuid REFERENCES farms(id) ON DELETE CASCADE,
  quantity numeric,
  unit text,
  quality_grade text,
  harvest_date date,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE yields ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own yields"
  ON yields FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM farms WHERE farms.id = yields.farm_id AND farms.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM farms WHERE farms.id = yields.farm_id AND farms.user_id = auth.uid())
  );

-- =========================
-- 🏛️ 7️⃣ GOVERNMENT SCHEMES
-- =========================
CREATE TABLE IF NOT EXISTS public.government_schemes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  description text,
  eligibility text,
  benefits text,
  application_process text,
  contact_info text,
  state text,
  category text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE government_schemes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active schemes"
  ON government_schemes FOR SELECT
  TO authenticated
  USING (active = true);

-- =========================
-- 🧑‍🌾 8️⃣ SOCIAL FEATURES
-- =========================
-- Community Posts
CREATE TABLE IF NOT EXISTS public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text,
  content text,
  category text,
  images text[],
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Post Comments
CREATE TABLE IF NOT EXISTS public.post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text,
  created_at timestamptz DEFAULT now()
);

-- Post Likes
CREATE TABLE IF NOT EXISTS public.post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Community Posts Policies
CREATE POLICY "Anyone can view community posts"
  ON community_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own posts"
  ON community_posts FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Comments Policies
CREATE POLICY "Anyone can view comments"
  ON post_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own comments"
  ON post_comments FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Likes Policies
CREATE POLICY "Anyone can view likes"
  ON post_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own likes"
  ON post_likes FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create functions to manage counts
CREATE OR REPLACE FUNCTION public.handle_post_like()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE community_posts
    SET likes_count = likes_count + 1
    WHERE id = NEW.post_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE community_posts
    SET likes_count = likes_count - 1
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_post_comment()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE community_posts
    SET comments_count = comments_count + 1
    WHERE id = NEW.post_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE community_posts
    SET comments_count = comments_count - 1
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for counts
DROP TRIGGER IF EXISTS trig_post_like ON post_likes;
CREATE TRIGGER trig_post_like
AFTER INSERT OR DELETE ON post_likes
FOR EACH ROW
EXECUTE FUNCTION handle_post_like();

DROP TRIGGER IF EXISTS trig_post_comment ON post_comments;
CREATE TRIGGER trig_post_comment
AFTER INSERT OR DELETE ON post_comments
FOR EACH ROW
EXECUTE FUNCTION handle_post_comment();

-- =========================
-- 💬 9️⃣ CHAT & NOTIFICATIONS
-- =========================
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text,
  is_bot boolean DEFAULT false,
  context json,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text,
  data json,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own chat"
  ON chat_messages FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own notifications"
  ON notifications FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =========================
-- 🌾 🔟 SEED SAMPLE DATA
-- =========================
INSERT INTO crops (name, category, season, duration_days, description, image_url)
VALUES
  ('Rice', 'Cereal', 'Kharif', 120, 'Staple food crop', 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg'),
  ('Wheat', 'Cereal', 'Rabi', 120, 'Winter crop', 'https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg'),
  ('Tomato', 'Vegetable', 'All Season', 90, 'Popular vegetable', 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg')
ON CONFLICT (name) DO NOTHING;

INSERT INTO government_schemes (name, description, eligibility, benefits, category, active)
VALUES
  ('PM-KISAN', '₹6000 per year income support', 'All farmers', 'Financial Support', 'Financial', true),
  ('Soil Health Card Scheme', 'Provides soil testing for nutrient management', 'All farmers', 'Soil improvement', 'Soil Management', true)
ON CONFLICT DO NOTHING;

-- ✅ DONE