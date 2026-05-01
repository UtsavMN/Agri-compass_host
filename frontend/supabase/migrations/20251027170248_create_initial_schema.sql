/*
  # Initial Agri Compass Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text, unique)
      - `full_name` (text)
      - `phone` (text)
      - `location` (text)
      - `language_preference` (text, default 'en')
      - `avatar_url` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `farms`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `name` (text)
      - `location` (text)
      - `area_acres` (numeric)
      - `soil_type` (text)
      - `irrigation_type` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `crops`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `category` (text)
      - `season` (text)
      - `duration_days` (integer)
      - `description` (text)
      - `image_url` (text)
      - `created_at` (timestamptz)
    
    - `farm_crops`
      - `id` (uuid, primary key)
      - `farm_id` (uuid, references farms)
      - `crop_id` (uuid, references crops)
      - `planted_date` (date)
      - `expected_harvest_date` (date)
      - `area_acres` (numeric)
      - `status` (text, default 'planted')
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `expenses`
      - `id` (uuid, primary key)
      - `farm_crop_id` (uuid, references farm_crops)
      - `category` (text)
      - `amount` (numeric)
      - `description` (text)
      - `date` (date)
      - `created_at` (timestamptz)
    
    - `yields`
      - `id` (uuid, primary key)
      - `farm_crop_id` (uuid, references farm_crops)
      - `quantity` (numeric)
      - `unit` (text)
      - `quality_grade` (text)
      - `harvest_date` (date)
      - `notes` (text)
      - `created_at` (timestamptz)
    
    - `market_prices`
      - `id` (uuid, primary key)
      - `crop_id` (uuid, references crops)
      - `location` (text)
      - `price_per_unit` (numeric)
      - `unit` (text)
      - `market_name` (text)
      - `date` (date)
      - `created_at` (timestamptz)
    
    - `government_schemes`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `eligibility` (text)
      - `benefits` (text)
      - `application_process` (text)
      - `contact_info` (text)
      - `state` (text)
      - `category` (text)
      - `active` (boolean, default true)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `community_posts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `content` (text)
      - `category` (text)
      - `images` (text[])
      - `likes_count` (integer, default 0)
      - `comments_count` (integer, default 0)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `post_comments`
      - `id` (uuid, primary key)
      - `post_id` (uuid, references community_posts)
      - `user_id` (uuid, references profiles)
      - `content` (text)
      - `created_at` (timestamptz)
    
    - `post_likes`
      - `id` (uuid, primary key)
      - `post_id` (uuid, references community_posts)
      - `user_id` (uuid, references profiles)
      - `created_at` (timestamptz)
    
    - `expert_questions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `question` (text)
      - `category` (text)
      - `images` (text[])
      - `status` (text, default 'open')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `expert_answers`
      - `id` (uuid, primary key)
      - `question_id` (uuid, references expert_questions)
      - `expert_id` (uuid, references profiles)
      - `answer` (text)
      - `helpful_count` (integer, default 0)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access where appropriate
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
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

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- Create farms table
CREATE TABLE IF NOT EXISTS farms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  location text NOT NULL,
  area_acres numeric NOT NULL,
  soil_type text,
  irrigation_type text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE farms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own farms"
  ON farms FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own farms"
  ON farms FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own farms"
  ON farms FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own farms"
  ON farms FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create crops table
CREATE TABLE IF NOT EXISTS crops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  category text NOT NULL,
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

-- Create farm_crops table
CREATE TABLE IF NOT EXISTS farm_crops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id uuid REFERENCES farms(id) ON DELETE CASCADE NOT NULL,
  crop_id uuid REFERENCES crops(id) ON DELETE CASCADE NOT NULL,
  planted_date date NOT NULL,
  expected_harvest_date date,
  area_acres numeric NOT NULL,
  status text DEFAULT 'planted',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE farm_crops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own farm crops"
  ON farm_crops FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM farms
    WHERE farms.id = farm_crops.farm_id
    AND farms.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own farm crops"
  ON farm_crops FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM farms
    WHERE farms.id = farm_crops.farm_id
    AND farms.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own farm crops"
  ON farm_crops FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM farms
    WHERE farms.id = farm_crops.farm_id
    AND farms.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM farms
    WHERE farms.id = farm_crops.farm_id
    AND farms.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own farm crops"
  ON farm_crops FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM farms
    WHERE farms.id = farm_crops.farm_id
    AND farms.user_id = auth.uid()
  ));

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_crop_id uuid REFERENCES farm_crops(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL,
  amount numeric NOT NULL,
  description text,
  date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own expenses"
  ON expenses FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM farm_crops
    JOIN farms ON farms.id = farm_crops.farm_id
    WHERE farm_crops.id = expenses.farm_crop_id
    AND farms.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own expenses"
  ON expenses FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM farm_crops
    JOIN farms ON farms.id = farm_crops.farm_id
    WHERE farm_crops.id = expenses.farm_crop_id
    AND farms.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own expenses"
  ON expenses FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM farm_crops
    JOIN farms ON farms.id = farm_crops.farm_id
    WHERE farm_crops.id = expenses.farm_crop_id
    AND farms.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM farm_crops
    JOIN farms ON farms.id = farm_crops.farm_id
    WHERE farm_crops.id = expenses.farm_crop_id
    AND farms.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own expenses"
  ON expenses FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM farm_crops
    JOIN farms ON farms.id = farm_crops.farm_id
    WHERE farm_crops.id = expenses.farm_crop_id
    AND farms.user_id = auth.uid()
  ));

-- Create yields table
CREATE TABLE IF NOT EXISTS yields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_crop_id uuid REFERENCES farm_crops(id) ON DELETE CASCADE NOT NULL,
  quantity numeric NOT NULL,
  unit text NOT NULL,
  quality_grade text,
  harvest_date date NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE yields ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own yields"
  ON yields FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM farm_crops
    JOIN farms ON farms.id = farm_crops.farm_id
    WHERE farm_crops.id = yields.farm_crop_id
    AND farms.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own yields"
  ON yields FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM farm_crops
    JOIN farms ON farms.id = farm_crops.farm_id
    WHERE farm_crops.id = yields.farm_crop_id
    AND farms.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own yields"
  ON yields FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM farm_crops
    JOIN farms ON farms.id = farm_crops.farm_id
    WHERE farm_crops.id = yields.farm_crop_id
    AND farms.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM farm_crops
    JOIN farms ON farms.id = farm_crops.farm_id
    WHERE farm_crops.id = yields.farm_crop_id
    AND farms.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own yields"
  ON yields FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM farm_crops
    JOIN farms ON farms.id = farm_crops.farm_id
    WHERE farm_crops.id = yields.farm_crop_id
    AND farms.user_id = auth.uid()
  ));

-- Create market_prices table
CREATE TABLE IF NOT EXISTS market_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_id uuid REFERENCES crops(id) ON DELETE CASCADE NOT NULL,
  location text NOT NULL,
  price_per_unit numeric NOT NULL,
  unit text NOT NULL,
  market_name text,
  date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE market_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view market prices"
  ON market_prices FOR SELECT
  TO authenticated
  USING (true);

-- Create government_schemes table
CREATE TABLE IF NOT EXISTS government_schemes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  eligibility text,
  benefits text,
  application_process text,
  contact_info text,
  state text,
  category text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE government_schemes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active government schemes"
  ON government_schemes FOR SELECT
  TO authenticated
  USING (active = true);

-- Create community_posts table
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  images text[],
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view community posts"
  ON community_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own posts"
  ON community_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON community_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON community_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create post_comments table
CREATE TABLE IF NOT EXISTS post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comments"
  ON post_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own comments"
  ON post_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON post_comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create post_likes table
CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view likes"
  ON post_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own likes"
  ON post_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes"
  ON post_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create expert_questions table
CREATE TABLE IF NOT EXISTS expert_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  question text NOT NULL,
  category text NOT NULL,
  images text[],
  status text DEFAULT 'open',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE expert_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view expert questions"
  ON expert_questions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own questions"
  ON expert_questions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own questions"
  ON expert_questions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own questions"
  ON expert_questions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create expert_answers table
CREATE TABLE IF NOT EXISTS expert_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid REFERENCES expert_questions(id) ON DELETE CASCADE NOT NULL,
  expert_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  answer text NOT NULL,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE expert_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view expert answers"
  ON expert_answers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert answers"
  ON expert_answers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = expert_id);

CREATE POLICY "Users can update own answers"
  ON expert_answers FOR UPDATE
  TO authenticated
  USING (auth.uid() = expert_id)
  WITH CHECK (auth.uid() = expert_id);

CREATE POLICY "Users can delete own answers"
  ON expert_answers FOR DELETE
  TO authenticated
  USING (auth.uid() = expert_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_farms_user_id ON farms(user_id);
CREATE INDEX IF NOT EXISTS idx_farm_crops_farm_id ON farm_crops(farm_id);
CREATE INDEX IF NOT EXISTS idx_farm_crops_crop_id ON farm_crops(crop_id);
CREATE INDEX IF NOT EXISTS idx_expenses_farm_crop_id ON expenses(farm_crop_id);
CREATE INDEX IF NOT EXISTS idx_yields_farm_crop_id ON yields(farm_crop_id);
CREATE INDEX IF NOT EXISTS idx_market_prices_crop_id ON market_prices(crop_id);
CREATE INDEX IF NOT EXISTS idx_market_prices_location ON market_prices(location);
CREATE INDEX IF NOT EXISTS idx_market_prices_date ON market_prices(date);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_expert_questions_user_id ON expert_questions(user_id);
CREATE INDEX IF NOT EXISTS idx_expert_answers_question_id ON expert_answers(question_id);