import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://udbziscikwhsmcvfyeqn.supabase.co";
const SUPABASE_ANON_KEY = "PASTE_YOUR_PUBLISHABLE_KEY_HERE";

// Check if Supabase is properly configured
export const isSupabaseConfigured =
  SUPABASE_ANON_KEY !== "PASTE_YOUR_PUBLISHABLE_KEY_HERE" &&
  SUPABASE_ANON_KEY.length > 20;

let supabase: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

export { supabase };
export default supabase;
