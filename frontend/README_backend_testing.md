# 🌾 Agri Compass — Backend Testing Guide

This guide provides comprehensive PostgreSQL queries to validate the database schema, constraints, and API endpoints for the Farmer's Platform.

## 📋 Testing Overview

The testing suite consists of two main SQL scripts:

1. **`test_backend.sql`** - Validates database structure, constraints, and integrity
2. **`test_api_endpoints.sql`** - Simulates GET/POST API endpoints with test data

## 🗄️ Database Tables Validated

The following tables are tested for existence, constraints, and functionality:

- ✅ `profiles` - User profiles with authentication
- ✅ `farms` - Farm management data
- ✅ `crops` - Available crop information
- ✅ `expenses` - Farm expense tracking
- ✅ `yields` - Harvest yield records
- ✅ `government_schemes` - Gov scheme information
- ✅ `community_posts` - Social media posts
- ✅ `post_comments` - Post comments
- ✅ `post_likes` - Post likes system
- ✅ `weather_logs` - Weather data storage
- ✅ `chat_messages` - AI chat history
- ✅ `notifications` - User notifications

## 🔍 Validation Checks

### 1. Table Existence & Structure
- Confirms all required tables exist in the public schema
- Validates table ownership and basic structure

### 2. Constraints & Indexes
- **Primary Keys**: Ensures each table has proper primary key constraints
- **Foreign Keys**: Validates referential integrity relationships
- **Unique Constraints**: Checks username uniqueness, like uniqueness per user
- **Indexes**: Verifies performance indexes on frequently queried columns

### 3. Row Level Security (RLS)
- Confirms RLS is enabled on all tables
- Validates appropriate policies for data access control

### 4. Data Integrity
- Checks for orphaned records (should return empty results)
- Validates trigger functions and automatic counters
- Ensures referential integrity across related tables

## 🚀 API Endpoint Testing

### GET Endpoints Tested
- `GET /api/profiles/me` - User profile retrieval
- `GET /api/farms` - User's farm listings
- `GET /api/crops` - Available crops
- `GET /api/government-schemes` - Active government schemes
- `GET /api/community/posts` - Community posts with author info
- `GET /api/weather/logs/:farm_id` - Weather history for specific farm

### POST Endpoints Tested
- `POST /api/farms` - Create new farm
- `POST /api/expenses` - Add farm expense
- `POST /api/yields` - Record harvest yield
- `POST /api/community/posts` - Create community post
- `POST /api/post-comments` - Add comment to post
- `POST /api/post-likes` - Like/unlike posts
- `POST /api/chat-messages` - Send chat message

### UPDATE/DELETE Endpoints Tested
- `PUT /api/profiles/me` - Update user profile
- `PUT /api/farms/:id` - Update farm details
- `DELETE /api/post-likes/:id` - Remove post like

## 🛠️ How to Run the Tests

### Prerequisites
- PostgreSQL database with Supabase schema
- Access to run SQL queries (via psql, pgAdmin, or Supabase dashboard)

### Step 1: Run Schema Validation
```sql
-- Execute the contents of test_backend.sql
-- This validates table structure, constraints, and RLS policies
```

### Step 2: Run API Endpoint Tests
```sql
-- Execute the contents of test_api_endpoints.sql
-- This creates test data and simulates API operations
```

### Step 3: Review Results
- Check for any errors in query execution
- Verify that SELECT queries return expected data structures
- Confirm INSERT/UPDATE/DELETE operations work correctly
- Ensure counter triggers update automatically (likes_count, comments_count)

## 📊 Expected Results

### Schema Validation Results
- All 12 tables should exist
- Primary keys should be properly defined
- Foreign key relationships should be intact
- RLS should be enabled on all tables
- Appropriate indexes should exist

### API Testing Results
- GET queries should return properly formatted JSON-like data
- POST operations should create records and return them
- UPDATE operations should modify existing records
- DELETE operations should remove records
- Counter fields should update automatically via triggers

## 🔧 Troubleshooting

### Common Issues
1. **Table Not Found**: Ensure migrations have been applied
2. **Permission Denied**: Check RLS policies and user authentication
3. **Foreign Key Violations**: Ensure parent records exist before child records
4. **Trigger Not Working**: Verify trigger functions are properly created

### Cleanup
After testing, uncomment the cleanup section in `test_api_endpoints.sql` to remove test data.

## ✅ Success Criteria

The backend is properly configured if:
- ✅ All tables exist with correct structure
- ✅ All constraints and indexes are in place
- ✅ RLS policies are properly configured
- ✅ API endpoint simulations return valid data
- ✅ Data integrity is maintained across operations
- ✅ Automatic counters work correctly
- ✅ No orphaned records exist

## 📞 Support

If tests fail, check:
1. Database migration status
2. Supabase project configuration
3. Authentication setup
4. Network connectivity to database

For issues with specific endpoints, refer to the API documentation or check server logs.
