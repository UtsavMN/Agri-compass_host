-- Enable RLS on the tables we'll be working with
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Create policies that allow authenticated users to see all posts
CREATE POLICY "Anyone can view posts"
ON public.posts FOR SELECT
TO authenticated
USING (true);

-- Allow users to create their own posts
CREATE POLICY "Users can create their own posts"
ON public.posts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own posts
CREATE POLICY "Users can update own posts"
ON public.posts FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Create a sample user using Supabase Auth
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    'test.farmer@example.com',
    crypt('securepassword123', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', ARRAY['email']),
    jsonb_build_object(
        'full_name', 'Test Farmer',
        'username', 'testfarmer',
        'avatar_url', NULL
    ),
    now(),
    now()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'test.farmer@example.com'
);

-- Insert sample posts
WITH user_id AS (
    SELECT id FROM auth.users WHERE email = 'test.farmer@example.com' LIMIT 1
)
INSERT INTO public.posts (
    id,
    user_id,
    title,
    body,
    crop_tags,
    location,
    created_at,
    updated_at
)
SELECT
    uuid_generate_v4(),
    (SELECT id FROM user_id),
    title,
    body,
    tags,
    loc,
    created_at,
    created_at
FROM (
    VALUES
        (
            'Rice Farming Success Story',
            'After implementing new irrigation techniques, my rice yield increased by 25%! Here are the key changes I made:\n\n1. Better water management\n2. Organic fertilizers\n3. Crop rotation\n\nHas anyone else tried these methods?',
            ARRAY['rice', 'irrigation', 'organic']::text[],
            'Coastal Karnataka',
            now() - interval '2 days'
        ),
        (
            'Natural Pest Control Methods',
            'These natural pest control methods have worked wonders in my farm:\n\n- Neem oil spray\n- Companion planting with marigolds\n- Beneficial insects\n\nLet''s discuss sustainable farming!',
            ARRAY['organic', 'pest-control']::text[],
            'Western Ghats',
            now() - interval '1 day'
        ),
        (
            'Preparing for Monsoon Season',
            'Monsoon preparation checklist:\n\n1. Soil testing completed\n2. Drainage systems cleaned\n3. Selected water-resistant crops\n4. Stored emergency supplies\n\nWhat are your monsoon preparations?',
            ARRAY['monsoon', 'planning']::text[],
            'Northern Karnataka',
            now()
        )
) AS t(title, body, tags, loc, created_at);

-- Add comments
WITH user_id AS (
    SELECT id FROM auth.users WHERE email = 'test.farmer@example.com' LIMIT 1
), sample_posts AS (
    SELECT id FROM public.posts LIMIT 3
)
INSERT INTO public.comments (
    id,
    post_id,
    user_id,
    content,
    created_at
)
SELECT
    uuid_generate_v4(),
    post_id,
    user_id,
    'Great insights! Thanks for sharing.',
    now()
FROM (
    SELECT p.id as post_id, u.id as user_id
    FROM sample_posts p
    CROSS JOIN user_id u
) AS t;