import { createClient } from "@supabase/supabase-js";
import { ENV, isSupabaseConfigured } from "../env";

export function getSupabaseAdmin() {
  if (!isSupabaseConfigured()) {
    return null;
  }
  const key = ENV.SUPABASE_SERVICE_ROLE_KEY || ENV.SUPABASE_ANON_KEY;
  if (!key) {
    return null;
  }

  return createClient(ENV.SUPABASE_URL, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
