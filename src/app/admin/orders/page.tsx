import React from "react";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";
import { Order, OrderItem, PaymentStatus, DeliveryStatus } from "@/types/database";
import { OrderManager } from "./OrderManager";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  let orders: Order[] = [];

  if (isSupabaseConfigured()) {
    const admin = getSupabaseAdmin();
    if (admin) {
      const { data, error } = await admin
        .from("enquiries")
        .select("*, items:enquiry_items(*)")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch orders:", error);
      } else if (data) {
        orders = data.map((row: any) => {
          let paymentStatus: PaymentStatus = "pending";
          let deliveryStatus: DeliveryStatus = "processing";
          let cleanNotes = row.admin_notes || "";

          // Attempt to parse packed order metadata from admin_notes JSON
          if (row.admin_notes && row.admin_notes.trim().startsWith("{")) {
            try {
              const parsed = JSON.parse(row.admin_notes);
              if (parsed.payment_status) paymentStatus = parsed.payment_status;
              if (parsed.delivery_status) deliveryStatus = parsed.delivery_status;
              if (parsed.notes !== undefined) cleanNotes = parsed.notes;
            } catch {
              // fallback to status mapping
            }
          } else {
            // Smart defaults based on legacy status column
            if (row.status === "completed") {
              paymentStatus = "paid";
              deliveryStatus = "delivered";
            } else if (row.status === "cancelled") {
              deliveryStatus = "cancelled";
            } else if (row.status === "quoted") {
              deliveryStatus = "shipped";
            } else if (row.status === "contacted") {
              deliveryStatus = "processing";
            }
          }

          const rawItems = Array.isArray(row.items) ? row.items : [];
          const items: OrderItem[] = rawItems.map((item: any) => ({
            id: item.id,
            order_id: row.id,
            product_id: item.product_id,
            product_name: item.product_name_snapshot || "Building Material Product",
            product_sku: item.product_sku_snapshot,
            quantity: Number(item.requested_quantity) || 1,
            packaging: item.packaging_snapshot,
          }));

          const totalQuantity = items.reduce((acc, curr) => acc + curr.quantity, 0);

          return {
            id: row.id,
            order_number: `ORD-${row.id.slice(0, 8).toUpperCase()}`,
            customer_name: row.customer_name,
            customer_phone: row.customer_phone,
            customer_email: row.customer_email || null,
            company_name: row.company_name || null,
            location: row.location || "Kerala",
            additional_requirements: row.additional_requirements || null,
            payment_status: paymentStatus,
            delivery_status: deliveryStatus,
            admin_notes: cleanNotes,
            created_at: row.created_at,
            updated_at: row.updated_at,
            items,
            total_quantity: totalQuantity || 1,
          };
        });
      }
    }
  }

  return <OrderManager initialOrders={orders} />;
}
