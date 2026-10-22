"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";

export async function saveSubcategory(formData: any, id?: string) {
  if (!isSupabaseConfigured()) return { error: "Database not configured" };
  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Database unavailable" };

  try {
    const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const payload = {
      category_id: formData.category_id,
      name: formData.name,
      slug,
      description: formData.description || null,
      image_url: formData.image_url || null,
      is_active: Boolean(formData.is_active ?? true),
      display_order: Number(formData.display_order) || 0,
      updated_at: new Date().toISOString(),
    };

    if (id) {
      const { error } = await admin.from("subcategories").update(payload).eq("id", id);
      if (error) throw error;
    } else {
      const { error } = await admin.from("subcategories").insert(payload);
      if (error) throw error;
    }

    revalidatePath("/admin/subcategories");
    revalidatePath("/shop");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to save subcategory" };
  }
}

export async function deleteSubcategory(id: string) {
  if (!isSupabaseConfigured()) return { error: "Database not configured" };
  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Database unavailable" };

  try {
    const { error } = await admin.from("subcategories").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/subcategories");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to delete subcategory" };
  }
}
