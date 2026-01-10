import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL/key missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local')
}

let _supabase: ReturnType<typeof createClient<Database>> | null = null;
try {
  // Attempt to create a client if values are present; wrap in try/catch to avoid throwing at import time
  _supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
} catch (err) {
  console.warn('Failed to initialize Supabase client:', err);
  _supabase = null;
}

export const supabase = _supabase as ReturnType<typeof createClient<Database>> | any;
