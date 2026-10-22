"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";

export async function saveTrustIndicator(formData: any, id?: string) {
  if (!isSupabaseConfigured()) return { error: "Database not configured" };
  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Database unavailable" };

  try {
    const payload = {
      title: formData.title,
      description: formData.description,
      icon_name: formData.icon_name || "ShieldCheck",
      display_order: Number(formData.display_order) || 0,
      is_active: Boolean(formData.is_active ?? true),
      updated_at: new Date().toISOString(),
    };

    if (id) {
      const { error } = await admin.from("trust_indicators").update(payload).eq("id", id);
      if (error) throw error;
    } else {
      const { error } = await admin.from("trust_indicators").insert(payload);
      if (error) throw error;
    }

    revalidatePath("/admin/trust-indicators");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to save trust indicator" };
  }
}

export async function deleteTrustIndicator(id: string) {
  if (!isSupabaseConfigured()) return { error: "Database not configured" };
  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Database unavailable" };

  try {
    const { error } = await admin.from("trust_indicators").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/trust-indicators");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to delete trust indicator" };
  }
}
