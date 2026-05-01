-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert sample user profiles first
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at)
VALUES 
  (uuid_generate_v4(), 'farmer1@example.com', crypt('test123456', gen_salt('bf')), now(), 
   '{"provider":"email","providers":["email"]}',
   '{"full_name":"Test Farmer","username":"testfarmer"}',
   now())
ON CONFLICT DO NOTHING;

-- Get the user ID we just created
WITH inserted_user AS (
  SELECT id FROM auth.users WHERE email = 'farmer1@example.com' LIMIT 1
)
-- Insert sample posts
INSERT INTO public.posts (
  id,
  title,
  body,
  crop_tags,
  location,
  user_id,
  created_at,
  updated_at
)
SELECT
  uuid_generate_v4() as id,
  unnest(ARRAY[
    'Rice Farming Success Story',
    'Natural Pest Control Methods',
    'Preparing for Monsoon Season'
  ]) as title,
  unnest(ARRAY[
    'After implementing new irrigation techniques, my rice yield increased by 25%! Here are the key changes I made:

1. Better water management
2. Organic fertilizers
3. Crop rotation

Has anyone else tried these methods?',
    'These natural pest control methods have worked wonders in my farm:

- Neem oil spray
- Companion planting with marigolds
- Beneficial insects

Let''s discuss sustainable farming!',
    'Monsoon preparation checklist:

1. Soil testing completed
2. Drainage systems cleaned
3. Selected water-resistant crops
4. Stored emergency supplies

What are your monsoon preparations?'
  ]) as body,
  unnest(ARRAY[
    ARRAY['rice', 'irrigation', 'organic']::text[],
    ARRAY['organic', 'pest-control']::text[],
    ARRAY['monsoon', 'planning']::text[]
  ]) as crop_tags,
  unnest(ARRAY[
    'Coastal Karnataka',
    'Western Ghats',
    'Northern Karnataka'
  ]) as location,
  (SELECT id FROM inserted_user) as user_id,
  now() - interval '1 day' * generate_series(0,2) as created_at,
  now() - interval '1 day' * generate_series(0,2) as updated_at;

-- Add some likes to the posts
WITH inserted_user AS (
  SELECT id FROM auth.users WHERE email = 'farmer1@example.com' LIMIT 1
)
INSERT INTO likes (post_id, user_id, created_at)
SELECT 
  posts.id,
  (SELECT id FROM inserted_user),
  now()
FROM posts;

-- Add some comments to the posts
WITH inserted_user AS (
  SELECT id FROM auth.users WHERE email = 'farmer1@example.com' LIMIT 1
)
INSERT INTO comments (post_id, user_id, content, created_at)
SELECT 
  posts.id,
  (SELECT id FROM inserted_user),
  'Great insights! Thanks for sharing.',
  now()
FROM posts;