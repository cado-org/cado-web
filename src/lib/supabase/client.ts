import { createBrowserClient } from "@supabase/ssr";
import { ENV, isSupabaseConfigured } from "../env";

export function createClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }
  return createBrowserClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);
}
