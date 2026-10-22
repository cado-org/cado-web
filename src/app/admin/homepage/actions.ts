"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";

export async function updateHomepageSection(id: string, payload: any) {
  if (!isSupabaseConfigured()) return { error: "Database not configured" };
  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Database unavailable" };

  try {
    const { error } = await admin
      .from("homepage_sections")
      .update({
        title: payload.title,
        subtitle: payload.subtitle || null,
        description: payload.description || null,
        is_enabled: Boolean(payload.is_enabled),
        display_order: Number(payload.display_order) || 0,
        content: payload.content || {},
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/homepage");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to update homepage section" };
  }
}
