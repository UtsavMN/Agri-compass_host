import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://gbvxltiwlaoquirdjamx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdidnhsdGl3bGFvcXVpcmRqYW14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAzMzk4ODAsImV4cCI6MjAxNTkxNTg4MH0.JKLSu6RxGKuvGblLZKRh79G_bkiqstYRgHHUDwncDzM'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)