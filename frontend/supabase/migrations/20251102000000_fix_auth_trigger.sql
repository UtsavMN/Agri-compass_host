-- 🧩 FINAL PATCH: Fix function ownership & permissions for Agri Compass

-- Ensure schema exists
CREATE SCHEMA IF NOT EXISTS public;

-- Drop old trigger/function safely
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate the function with proper role and permissions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  -- This safely bypasses RLS and ensures the profile is created
  INSERT INTO public.profiles (id, username, full_name, language_preference, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    split_part(NEW.email, '@', 1),
    'en',
    now()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ✅ Force ownership of the function to postgres (admin)
ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

-- Recreate the trigger cleanly
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Add Kannada caption column to posts if not exists
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS kn_caption TEXT;

-- Verify profiles table exists
SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_name = 'profiles';

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';