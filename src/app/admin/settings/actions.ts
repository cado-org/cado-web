"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";

export async function saveSiteSettings(settings: any) {
  if (!isSupabaseConfigured()) return { error: "Database not configured" };
  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Database service unavailable" };

  try {
    const { error } = await admin
      .from("site_settings")
      .upsert(
        {
          setting_key: "general",
          setting_value: settings,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "setting_key" }
      );

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to save site settings" };
  }
}
