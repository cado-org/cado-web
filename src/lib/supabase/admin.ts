import { createClient } from "@supabase/supabase-js";
import { ENV, isSupabaseAdminConfigured } from "../env";

export function getSupabaseAdmin() {
  if (!isSupabaseAdminConfigured()) {
    return null;
  }
  return createClient(ENV.SUPABASE_URL, ENV.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
