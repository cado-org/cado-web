"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";

export async function saveProduct(formData: any, id?: string) {
  if (!isSupabaseConfigured()) {
    return { error: "Database not configured" };
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return { error: "Database service unavailable" };
  }

  try {
    const payload = {
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      sku: formData.sku || null,
      short_description: formData.short_description || null,
      description: formData.description || null,
      category_id: formData.category_id || null,
      subcategory_id: formData.subcategory_id || null,
      brand_id: formData.brand_id || null,
      main_image_url: formData.main_image_url || null,
      main_image_public_id: formData.main_image_public_id || null,
      packaging_details: formData.packaging_details || null,
      min_order_quantity: Number(formData.min_order_quantity) || 1,
      price: formData.price ? Number(formData.price) : null,
      show_price: Boolean(formData.show_price),
      availability_status: formData.availability_status || "in_stock",
      is_featured: Boolean(formData.is_featured),
      is_active: Boolean(formData.is_active),
      specifications: formData.specifications || [],
      gallery_images: formData.gallery_images || [],
      seo_title: formData.seo_title || null,
      seo_description: formData.seo_description || null,
      updated_at: new Date().toISOString(),
    };

    if (id) {
      const { error } = await admin.from("products").update(payload).eq("id", id);
      if (error) throw error;
    } else {
      const { error } = await admin.from("products").insert(payload);
      if (error) throw error;
    }

    revalidatePath("/shop");
    revalidatePath("/admin/products");
    revalidatePath("/");

    return { success: true };
  } catch (err: any) {
    console.error("Save product error:", err);
    return { error: err.message || "Failed to save product" };
  }
}

export async function deleteProduct(id: string) {
  if (!isSupabaseConfigured()) return { error: "Database not configured" };
  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Database unavailable" };

  try {
    const { error } = await admin.from("products").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/shop");
    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to delete product" };
  }
}

export async function toggleProductActive(id: string, currentState: boolean) {
  if (!isSupabaseConfigured()) return { error: "Database not configured" };
  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Database unavailable" };

  try {
    const { error } = await admin
      .from("products")
      .update({ is_active: !currentState, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}
