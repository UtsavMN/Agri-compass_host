import { createClient } from '@supabase/supabase-js'
import type { Database } from '../src/lib/database.types'

const supabaseUrl = 'https://gbvxltiwlaoquirdjamx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdidnhsdGl3bGFvcXVpcmRqYW14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NTQ2MTMsImV4cCI6MjA3NzIzMDYxM30.7rVns68fOsBRoRfyr8VbQ7IYTiFeTU4NJB-rpQWdu50'

// Create Supabase client
const supabase = createClient<Database>(supabaseUrl, supabaseKey)

export { supabase }