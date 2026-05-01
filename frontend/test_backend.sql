-- 🌾 AGRI COMPASS — BACKEND TESTING QUERIES
-- Validates database schema, constraints, and API endpoints

-- ============================================
-- 1️⃣ TABLE EXISTENCE & STRUCTURE VALIDATION
-- ============================================

-- Check if all required tables exist
SELECT
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename IN (
        'profiles',
        'farms',
        'crops',
        'expenses',
        'yields',
        'government_schemes',
        'community_posts',
        'post_comments',
        'post_likes',
        'weather_logs',
        'chat_messages',
        'notifications'
    )
ORDER BY tablename;

-- ============================================
-- 2️⃣ CONSTRAINTS & INDEXES VALIDATION
-- ============================================

-- Check primary keys
SELECT
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
WHERE tc.constraint_type = 'PRIMARY KEY'
    AND tc.table_schema = 'public'
    AND tc.table_name IN (
        'profiles', 'farms', 'crops', 'expenses', 'yields',
        'government_schemes', 'community_posts', 'post_comments',
        'post_likes', 'weather_logs', 'chat_messages', 'notifications'
    )
ORDER BY tc.table_name;

-- Check foreign keys
SELECT
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
    AND tc.table_name IN (
        'profiles', 'farms', 'crops', 'expenses', 'yields',
        'government_schemes', 'community_posts', 'post_comments',
        'post_likes', 'weather_logs', 'chat_messages', 'notifications'
    )
ORDER BY tc.table_name;

-- Check unique constraints
SELECT
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    string_agg(kcu.column_name, ', ') AS columns
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
WHERE tc.constraint_type = 'UNIQUE'
    AND tc.table_schema = 'public'
    AND tc.table_name IN (
        'profiles', 'farms', 'crops', 'expenses', 'yields',
        'government_schemes', 'community_posts', 'post_comments',
        'post_likes', 'weather_logs', 'chat_messages', 'notifications'
    )
GROUP BY tc.table_name, tc.constraint_name, tc.constraint_type
ORDER BY tc.table_name;

-- Check indexes
SELECT
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
    AND tablename IN (
        'profiles', 'farms', 'crops', 'expenses', 'yields',
        'government_schemes', 'community_posts', 'post_comments',
        'post_likes', 'weather_logs', 'chat_messages', 'notifications'
    )
ORDER BY tablename, indexname;

-- ============================================
-- 3️⃣ ROW LEVEL SECURITY (RLS) VALIDATION
-- ============================================

-- Check RLS status for all tables
SELECT
    schemaname,
    tablename,
    rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename IN (
        'profiles', 'farms', 'crops', 'expenses', 'yields',
        'government_schemes', 'community_posts', 'post_comments',
        'post_likes', 'weather_logs', 'chat_messages', 'notifications'
    )
ORDER BY tablename;

-- Check RLS policies
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
    AND tablename IN (
        'profiles', 'farms', 'crops', 'expenses', 'yields',
        'government_schemes', 'community_posts', 'post_comments',
        'post_likes', 'weather_logs', 'chat_messages', 'notifications'
    )
ORDER BY tablename, policyname;

-- ============================================
-- 4️⃣ DATA VALIDATION & SAMPLE QUERIES
-- ============================================

-- Check sample data counts
SELECT
    'profiles' AS table_name, COUNT(*) AS record_count FROM profiles
UNION ALL
SELECT 'farms', COUNT(*) FROM farms
UNION ALL
SELECT 'crops', COUNT(*) FROM crops
UNION ALL
SELECT 'expenses', COUNT(*) FROM expenses
UNION ALL
SELECT 'yields', COUNT(*) FROM yields
UNION ALL
SELECT 'government_schemes', COUNT(*) FROM government_schemes
UNION ALL
SELECT 'community_posts', COUNT(*) FROM community_posts
UNION ALL
SELECT 'post_comments', COUNT(*) FROM post_comments
UNION ALL
SELECT 'post_likes', COUNT(*) FROM post_likes
UNION ALL
SELECT 'weather_logs', COUNT(*) FROM weather_logs
UNION ALL
SELECT 'chat_messages', COUNT(*) FROM chat_messages
UNION ALL
SELECT 'notifications', COUNT(*) FROM notifications
ORDER BY table_name;

-- ============================================
-- 5️⃣ API ENDPOINT TESTING SIMULATION
-- ============================================

-- Simulate GET /api/farms (authenticated user farms)
-- Note: Replace 'user-uuid-here' with actual authenticated user ID
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
WHERE f.user_id = 'user-uuid-here' -- Replace with actual user ID
ORDER BY f.created_at DESC;

-- Simulate GET /api/community/posts
SELECT
    cp.id,
    cp.title,
    cp.content,
    cp.category,
    cp.images,
    cp.likes_count,
    cp.comments_count,
    cp.created_at,
    json_build_object(
        'id', p.id,
        'username', p.username,
        'full_name', p.full_name,
        'avatar_url', p.avatar_url
    ) AS author
FROM community_posts cp
JOIN profiles p ON cp.user_id = p.id
ORDER BY cp.created_at DESC
LIMIT 20;

-- Simulate GET /api/weather/logs/:farm_id
-- Note: Replace 'farm-uuid-here' with actual farm ID
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
WHERE wl.farm_id = 'farm-uuid-here' -- Replace with actual farm ID
    AND wl.recorded_at >= now() - interval '7 days'
ORDER BY wl.recorded_at DESC;

-- Simulate POST /api/community/posts (insert test)
-- Note: This would be executed by the application, not directly
INSERT INTO community_posts (user_id, title, content, category)
VALUES (
    'user-uuid-here', -- Replace with actual user ID
    'Test Post',
    'This is a test community post',
    'General'
)
RETURNING id, title, content, created_at;

-- Simulate POST /api/post-comments (insert test)
-- Note: This would be executed by the application, not directly
INSERT INTO post_comments (post_id, user_id, content)
VALUES (
    'post-uuid-here', -- Replace with actual post ID
    'user-uuid-here', -- Replace with actual user ID
    'This is a test comment'
)
RETURNING id, content, created_at;

-- ============================================
-- 6️⃣ PERFORMANCE & INTEGRITY CHECKS
-- ============================================

-- Check for orphaned records (should return empty results)
SELECT 'Orphaned expenses' AS issue, COUNT(*) AS count
FROM expenses e
LEFT JOIN farms f ON e.farm_id = f.id
WHERE f.id IS NULL

UNION ALL

SELECT 'Orphaned yields', COUNT(*)
FROM yields y
LEFT JOIN farms f ON y.farm_id = f.id
WHERE f.id IS NULL

UNION ALL

SELECT 'Orphaned weather logs', COUNT(*)
FROM weather_logs wl
LEFT JOIN farms f ON wl.farm_id = f.id
WHERE f.id IS NULL

UNION ALL

SELECT 'Orphaned posts', COUNT(*)
FROM community_posts cp
LEFT JOIN profiles p ON cp.user_id = p.id
WHERE p.id IS NULL

UNION ALL

SELECT 'Orphaned comments', COUNT(*)
FROM post_comments pc
LEFT JOIN community_posts cp ON pc.post_id = cp.id
WHERE cp.id IS NULL

UNION ALL

SELECT 'Orphaned likes', COUNT(*)
FROM post_likes pl
LEFT JOIN community_posts cp ON pl.post_id = cp.id
WHERE cp.id IS NULL;

-- Check trigger functions exist
SELECT
    proname AS function_name,
    pg_get_function_identity_arguments(oid) AS arguments
FROM pg_proc
WHERE proname IN (
    'handle_new_user',
    'handle_post_like',
    'handle_post_comment'
)
    AND pg_function_is_visible(oid);

-- Check triggers exist
SELECT
    event_object_table AS table_name,
    trigger_name,
    event_manipulation AS event,
    action_timing AS timing
FROM information_schema.triggers
WHERE event_object_table IN (
    'post_likes',
    'post_comments'
)
    AND trigger_name IN (
        'trig_post_like',
        'trig_post_comment',
        'on_auth_user_created'
    )
ORDER BY event_object_table, trigger_name;

-- ============================================
-- 7️⃣ CLEANUP TEST DATA (Optional)
-- ============================================

-- Uncomment these lines if you want to clean up test data
-- DELETE FROM post_comments WHERE content LIKE 'This is a test%';
-- DELETE FROM community_posts WHERE title LIKE 'Test Post%';
-- DELETE FROM weather_logs WHERE description = 'test data';

-- ✅ END OF TESTING SCRIPT
