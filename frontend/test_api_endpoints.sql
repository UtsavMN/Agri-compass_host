-- 🌾 AGRI COMPASS — API ENDPOINTS TESTING SCRIPT
-- Simulates GET/POST requests to validate backend functionality

-- ============================================
-- SETUP: Create test user and farm for testing
-- ============================================

-- Create a test user (simulate auth.users)
-- Note: In real Supabase, this would be handled by authentication
INSERT INTO auth.users (id, email, created_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    'test@example.com',
    now()
) ON CONFLICT (id) DO NOTHING;

-- Create test profile
INSERT INTO profiles (id, username, full_name, phone, location)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    'testuser',
    'Test User',
    '+91-9876543210',
    'Bangalore'
) ON CONFLICT (id) DO NOTHING;

-- Create test farm
INSERT INTO farms (user_id, name, location, area_acres, soil_type, irrigation_type)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    'Test Farm',
    'Bangalore Rural',
    5.5,
    'Red Soil',
    'Drip Irrigation'
) ON CONFLICT DO NOTHING;

-- ============================================
-- 1️⃣ TEST GET ENDPOINTS
-- ============================================

-- GET /api/profiles/me
-- Should return authenticated user's profile
SELECT
    id,
    username,
    full_name,
    phone,
    location,
    language_preference,
    avatar_url,
    created_at,
    updated_at
FROM profiles
WHERE id = '550e8400-e29b-41d4-a716-446655440000'::uuid;

-- GET /api/farms
-- Should return user's farms
SELECT
    f.id,
    f.name,
    f.location,
    f.area_acres,
    f.soil_type,
    f.irrigation_type,
    f.created_at,
    f.updated_at,
    json_build_object(
        'id', p.id,
        'username', p.username,
        'full_name', p.full_name
    ) AS owner
FROM farms f
JOIN profiles p ON f.user_id = p.id
WHERE f.user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid
ORDER BY f.created_at DESC;

-- GET /api/crops
-- Should return all available crops
SELECT
    id,
    name,
    category,
    season,
    duration_days,
    description,
    image_url,
    created_at
FROM crops
ORDER BY name;

-- GET /api/government-schemes
-- Should return active schemes
SELECT
    id,
    name,
    description,
    eligibility,
    benefits,
    application_process,
    contact_info,
    state,
    category,
    active,
    created_at,
    updated_at
FROM government_schemes
WHERE active = true
ORDER BY created_at DESC;

-- GET /api/community/posts
-- Should return community posts with author info
SELECT
    cp.id,
    cp.title,
    cp.content,
    cp.category,
    cp.images,
    cp.likes_count,
    cp.comments_count,
    cp.created_at,
    cp.updated_at,
    json_build_object(
        'id', p.id,
        'username', p.username,
        'full_name', p.full_name,
        'avatar_url', p.avatar_url
    ) AS author
FROM community_posts cp
JOIN profiles p ON cp.user_id = p.id
ORDER BY cp.created_at DESC
LIMIT 10;

-- GET /api/weather/logs/:farm_id
-- Should return weather logs for specific farm
SELECT
    wl.id,
    wl.district,
    wl.temperature,
    wl.humidity,
    wl.wind_speed,
    wl.description,
    wl.precipitation,
    wl.recorded_at,
    json_build_object(
        'id', f.id,
        'name', f.name,
        'location', f.location
    ) AS farm
FROM weather_logs wl
JOIN farms f ON wl.farm_id = f.id
WHERE wl.farm_id = (SELECT id FROM farms WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid LIMIT 1)
    AND wl.recorded_at >= now() - interval '7 days'
ORDER BY wl.recorded_at DESC;

-- ============================================
-- 2️⃣ TEST POST ENDPOINTS (Data Creation)
-- ============================================

-- POST /api/farms
-- Create a new farm
INSERT INTO farms (user_id, name, location, area_acres, soil_type, irrigation_type)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    'New Test Farm',
    'Mysore',
    10.0,
    'Black Soil',
    'Sprinkler'
)
RETURNING
    id,
    name,
    location,
    area_acres,
    soil_type,
    irrigation_type,
    created_at;

-- POST /api/expenses
-- Add expense to farm
INSERT INTO expenses (farm_id, category, amount, description, date)
VALUES (
    (SELECT id FROM farms WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid LIMIT 1),
    'Fertilizer',
    2500.00,
    'NPK Fertilizer purchase',
    CURRENT_DATE
)
RETURNING
    id,
    category,
    amount,
    description,
    date,
    created_at;

-- POST /api/yields
-- Record yield for farm
INSERT INTO yields (farm_id, quantity, unit, quality_grade, harvest_date, notes)
VALUES (
    (SELECT id FROM farms WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid LIMIT 1),
    500.0,
    'kg',
    'Grade A',
    CURRENT_DATE - INTERVAL '7 days',
    'Excellent harvest this season'
)
RETURNING
    id,
    quantity,
    unit,
    quality_grade,
    harvest_date,
    notes,
    created_at;

-- POST /api/community/posts
-- Create a community post
INSERT INTO community_posts (user_id, title, content, category)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    'Test Community Post',
    'This is a test post to validate community features. Sharing my experience with organic farming!',
    'Organic Farming'
)
RETURNING
    id,
    title,
    content,
    category,
    likes_count,
    comments_count,
    created_at;

-- POST /api/post-comments
-- Add comment to post
INSERT INTO post_comments (post_id, user_id, content)
VALUES (
    (SELECT id FROM community_posts WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid LIMIT 1),
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    'Great post! Thanks for sharing your experience.'
)
RETURNING
    id,
    content,
    created_at;

-- POST /api/post-likes
-- Like a post
INSERT INTO post_likes (post_id, user_id)
VALUES (
    (SELECT id FROM community_posts WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid LIMIT 1),
    '550e8400-e29b-41d4-a716-446655440000'::uuid
)
ON CONFLICT (post_id, user_id) DO NOTHING
RETURNING id, created_at;

-- POST /api/chat-messages
-- Send chat message
INSERT INTO chat_messages (user_id, content, is_bot, context)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    'Hello, I need help with crop recommendations',
    false,
    '{"type": "crop_recommendation", "location": "Bangalore"}'::json
)
RETURNING
    id,
    content,
    is_bot,
    context,
    created_at;

-- ============================================
-- 3️⃣ TEST UPDATE ENDPOINTS
-- ============================================

-- PUT /api/profiles/me
-- Update user profile
UPDATE profiles
SET
    full_name = 'Updated Test User',
    phone = '+91-9876543211',
    location = 'Bangalore Urban',
    updated_at = now()
WHERE id = '550e8400-e29b-41d4-a716-446655440000'::uuid
RETURNING
    id,
    username,
    full_name,
    phone,
    location,
    updated_at;

-- PUT /api/farms/:id
-- Update farm details
UPDATE farms
SET
    name = 'Updated Test Farm',
    area_acres = 12.5,
    irrigation_type = 'Drip Irrigation',
    updated_at = now()
WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid
    AND name = 'New Test Farm'
RETURNING
    id,
    name,
    location,
    area_acres,
    irrigation_type,
    updated_at;

-- ============================================
-- 4️⃣ TEST DELETE ENDPOINTS
-- ============================================

-- DELETE /api/post-likes/:id
-- Unlike a post
DELETE FROM post_likes
WHERE post_id = (SELECT id FROM community_posts WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid LIMIT 1)
    AND user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid
RETURNING id;

-- ============================================
-- 5️⃣ VALIDATE DATA INTEGRITY AFTER OPERATIONS
-- ============================================

-- Check if counts were updated correctly after like/unlike
SELECT
    cp.id,
    cp.title,
    cp.likes_count,
    cp.comments_count,
    COUNT(pl.id) AS actual_likes,
    COUNT(pc.id) AS actual_comments
FROM community_posts cp
LEFT JOIN post_likes pl ON cp.id = pl.post_id
LEFT JOIN post_comments pc ON cp.id = pc.post_id
WHERE cp.user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid
GROUP BY cp.id, cp.title, cp.likes_count, cp.comments_count;

-- Check all created data
SELECT
    'farms' AS table_name, COUNT(*) AS count FROM farms WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid
UNION ALL
SELECT 'expenses', COUNT(*) FROM expenses WHERE farm_id IN (SELECT id FROM farms WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid)
UNION ALL
SELECT 'yields', COUNT(*) FROM yields WHERE farm_id IN (SELECT id FROM farms WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid)
UNION ALL
SELECT 'community_posts', COUNT(*) FROM community_posts WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid
UNION ALL
SELECT 'post_comments', COUNT(*) FROM post_comments WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid
UNION ALL
SELECT 'chat_messages', COUNT(*) FROM chat_messages WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid;

-- ============================================
-- 6️⃣ CLEANUP TEST DATA
-- ============================================

-- Remove test data (uncomment to clean up)
-- DELETE FROM chat_messages WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid;
-- DELETE FROM post_comments WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid;
-- DELETE FROM post_likes WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid;
-- DELETE FROM community_posts WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid;
-- DELETE FROM yields WHERE farm_id IN (SELECT id FROM farms WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid);
-- DELETE FROM expenses WHERE farm_id IN (SELECT id FROM farms WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid);
-- DELETE FROM weather_logs WHERE farm_id IN (SELECT id FROM farms WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid);
-- DELETE FROM farms WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid;
-- DELETE FROM profiles WHERE id = '550e8400-e29b-41d4-a716-446655440000'::uuid;
-- DELETE FROM auth.users WHERE id = '550e8400-e29b-41d4-a716-446655440000'::uuid;

-- ✅ END OF API TESTING SCRIPT
