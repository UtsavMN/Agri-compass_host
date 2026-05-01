import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase URL or anon key in .env - using mock client')
}

export const supabase = createClient(
  supabaseUrl || 'https://mock.supabase.co',
  supabaseAnonKey || 'mock-key'
)
