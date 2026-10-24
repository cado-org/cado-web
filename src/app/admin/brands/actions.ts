"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";

export async function saveBrand(formData: any, id?: string) {
  if (!isSupabaseConfigured()) return { error: "Database not configured" };
  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Database unavailable" };

  try {
    const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const payload = {
      name: formData.name,
      slug,
      description: formData.description || null,
      logo_url: formData.logo_url || null,
      website_url: formData.website_url || null,
      is_featured: Boolean(formData.is_featured),
      is_active: Boolean(formData.is_active ?? true),
      display_order: Number(formData.display_order) || 0,
      updated_at: new Date().toISOString(),
    };

    if (id) {
      const { error } = await admin.from("brands").update(payload).eq("id", id);
      if (error) throw error;
    } else {
      // Enforce limit of 10 brands
      const { count, error: countErr } = await admin
        .from("brands")
        .select("*", { count: "exact", head: true });
      if (!countErr && (count ?? 0) >= 10) {
        return {
          error:
            "Maximum limit of 10 brands reached. Please delete or edit an existing brand.",
        };
      }

      const { error } = await admin.from("brands").insert(payload);
      if (error) throw error;
    }

    revalidatePath("/admin/brands");
    revalidatePath("/brands");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to save brand" };
  }
}

export async function deleteBrand(id: string) {
  if (!isSupabaseConfigured()) return { error: "Database not configured" };
  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Database unavailable" };

  try {
    const { error } = await admin.from("brands").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/brands");
    revalidatePath("/brands");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to delete brand" };
  }
}
