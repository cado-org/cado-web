"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";
import { PaymentStatus, DeliveryStatus, EnquiryStatus } from "@/types/database";

export async function updateOrderStatus(
  orderId: string,
  paymentStatus: PaymentStatus,
  deliveryStatus: DeliveryStatus,
  notes: string = ""
) {
  if (!isSupabaseConfigured()) {
    return { error: "Database not configured" };
  }
  const admin = getSupabaseAdmin();
  if (!admin) {
    return { error: "Database unavailable" };
  }

  try {
    // Map deliveryStatus to valid enquiries status CHECK constraint
    // CHECK (status IN ('new', 'contacted', 'quoted', 'completed', 'cancelled'))
    let mappedStatus: EnquiryStatus = "contacted";
    if (deliveryStatus === "delivered" && paymentStatus === "paid") {
      mappedStatus = "completed";
    } else if (deliveryStatus === "delivered") {
      mappedStatus = "completed";
    } else if (deliveryStatus === "cancelled") {
      mappedStatus = "cancelled";
    } else if (deliveryStatus === "shipped") {
      mappedStatus = "quoted";
    } else {
      mappedStatus = "contacted";
    }

    // Pack order state into admin_notes JSON
    const packedNotes = JSON.stringify({
      payment_status: paymentStatus,
      delivery_status: deliveryStatus,
      notes: notes.trim(),
      updated_at: new Date().toISOString(),
    });

    const { error } = await admin
      .from("enquiries")
      .update({
        status: mappedStatus,
        admin_notes: packedNotes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (error) throw error;

    revalidatePath("/admin/orders");
    revalidatePath("/admin/enquiries");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    console.error("Failed to update order status:", err);
    return { error: err.message || "Failed to update order status" };
  }
}

export async function deleteOrder(orderId: string) {
  if (!isSupabaseConfigured()) {
    return { error: "Database not configured" };
  }
  const admin = getSupabaseAdmin();
  if (!admin) {
    return { error: "Database unavailable" };
  }

  try {
    const { error } = await admin.from("enquiries").delete().eq("id", orderId);
    if (error) throw error;

    revalidatePath("/admin/orders");
    revalidatePath("/admin/enquiries");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to delete order" };
  }
}
