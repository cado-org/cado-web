"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";

export async function saveProject(formData: any, id?: string) {
  if (!isSupabaseConfigured()) return { error: "Database not configured" };
  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Database unavailable" };

  try {
    const slug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const payload = {
      title: formData.title,
      slug,
      project_type: formData.project_type || "Residential",
      description: formData.description || null,
      location: formData.location || null,
      cover_image_url: formData.cover_image_url,
      completion_date: formData.completion_date || null,
      display_order: Number(formData.display_order) || 0,
      is_active: Boolean(formData.is_active ?? true),
      updated_at: new Date().toISOString(),
    };

    if (id) {
      const { error } = await admin.from("projects").update(payload).eq("id", id);
      if (error) throw error;
    } else {
      // Enforce limit of 10 projects
      const { count, error: countErr } = await admin
        .from("projects")
        .select("*", { count: "exact", head: true });
      if (!countErr && (count ?? 0) >= 10) {
        return {
          error:
            "Maximum limit of 10 projects reached. Please delete or edit an existing project.",
        };
      }

      const { error } = await admin.from("projects").insert(payload);
      if (error) throw error;
    }

    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to save project" };
  }
}

export async function deleteProject(id: string) {
  if (!isSupabaseConfigured()) return { error: "Database not configured" };
  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Database unavailable" };

  try {
    const { error } = await admin.from("projects").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to delete project" };
  }
}
