"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";
import { EnquiryStatus } from "@/types/database";

export async function updateEnquiryStatus(
  enquiryId: string,
  status: EnquiryStatus,
  adminNotes?: string
) {
  if (!isSupabaseConfigured()) return { error: "Database not configured" };
  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Database unavailable" };

  try {
    const updatePayload: any = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (adminNotes !== undefined) {
      updatePayload.admin_notes = adminNotes;
    }

    const { error } = await admin
      .from("enquiries")
      .update(updatePayload)
      .eq("id", enquiryId);

    if (error) throw error;

    revalidatePath("/admin/enquiries");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to update enquiry" };
  }
}

export async function deleteEnquiry(enquiryId: string) {
  if (!isSupabaseConfigured()) return { error: "Database not configured" };
  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Database unavailable" };

  try {
    const { error } = await admin.from("enquiries").delete().eq("id", enquiryId);
    if (error) throw error;

    revalidatePath("/admin/enquiries");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to delete enquiry" };
  }
}
