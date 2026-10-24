"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";

export async function saveBanner(formData: any, id?: string) {
  if (!isSupabaseConfigured()) return { error: "Database not configured" };
  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Database unavailable" };

  try {
    const payload = {
      eyebrow: formData.eyebrow || null,
      title: formData.title,
      description: formData.description || null,
      desktop_image_url: formData.desktop_image_url,
      desktop_image_public_id: formData.desktop_image_public_id || null,
      mobile_image_url: formData.mobile_image_url || null,
      mobile_image_public_id: formData.mobile_image_public_id || null,
      primary_cta_label: formData.primary_cta_label || null,
      primary_cta_url: formData.primary_cta_url || null,
      secondary_cta_label: formData.secondary_cta_label || null,
      secondary_cta_url: formData.secondary_cta_url || null,
      text_position: formData.text_position || "left",
      image_position: formData.image_position || "center",
      overlay_opacity: Number(formData.overlay_opacity) || 0.4,
      display_order: Number(formData.display_order) || 0,
      is_active: Boolean(formData.is_active ?? true),
      updated_at: new Date().toISOString(),
    };

    if (id) {
      const { error } = await admin.from("hero_banners").update(payload).eq("id", id);
      if (error) throw error;
    } else {
      // Enforce limit of 3 banners
      const { count, error: countErr } = await admin
        .from("hero_banners")
        .select("*", { count: "exact", head: true });
      if (!countErr && (count ?? 0) >= 3) {
        return {
          error:
            "Maximum limit of 3 hero banner slides reached. Please delete or edit an existing banner.",
        };
      }

      const { error } = await admin.from("hero_banners").insert(payload);
      if (error) throw error;
    }

    revalidatePath("/admin/banners");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to save banner" };
  }
}

export async function deleteBanner(id: string) {
  if (!isSupabaseConfigured()) return { error: "Database not configured" };
  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Database unavailable" };

  try {
    const { error } = await admin.from("hero_banners").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/banners");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to delete banner" };
  }
}
