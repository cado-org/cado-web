"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";

export async function saveCategory(formData: any, id?: string) {
  if (!isSupabaseConfigured()) return { error: "Database not configured" };
  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Database service unavailable" };

  try {
    const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const payload = {
      name: formData.name,
      slug,
      description: formData.description || null,
      image_url: formData.image_url || null,
      is_active: Boolean(formData.is_active ?? true),
      is_featured: Boolean(formData.is_featured),
      display_order: Number(formData.display_order) || 0,
      updated_at: new Date().toISOString(),
    };

    if (id) {
      const { error } = await admin.from("categories").update(payload).eq("id", id);
      if (error) throw error;
    } else {
      // Enforce limit of 10 categories (subcategories have separate management)
      const { count, error: countErr } = await admin
        .from("categories")
        .select("*", { count: "exact", head: true });
      if (!countErr && (count ?? 0) >= 10) {
        return {
          error:
            "Maximum limit of 10 categories reached. Please delete or edit an existing category.",
        };
      }

      const { error } = await admin.from("categories").insert(payload);
      if (error) throw error;
    }

    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to save category" };
  }
}

export async function deleteCategory(id: string) {
  if (!isSupabaseConfigured()) return { error: "Database not configured" };
  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Database service unavailable" };

  try {
    const { error } = await admin.from("categories").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to delete category" };
  }
}
