import { NextRequest, NextResponse } from "next/server";
import { enquiryFormSchema, generateWhatsAppMessage, buildWhatsAppUrl } from "@/lib/validation/enquiry";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = enquiryFormSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    let enquiryId = `temp-${Date.now()}`;
    let targetPhone = "917592958909"; // Default CADO WhatsApp contact

    // If Supabase is configured, persist the enquiry into database
    if (isSupabaseConfigured()) {
      const adminClient = getSupabaseAdmin();
      if (adminClient) {
        // Fetch current whatsapp_number from site_settings if available
        const { data: settingsData } = await adminClient
          .from("site_settings")
          .select("setting_value")
          .eq("setting_key", "general")
          .single();

        if (settingsData?.setting_value?.whatsapp_number) {
          targetPhone = settingsData.setting_value.whatsapp_number;
        }

        // Insert primary enquiry record
        const { data: enquiryRecord, error: enquiryError } = await adminClient
          .from("enquiries")
          .insert({
            customer_name: data.customer_name,
            customer_phone: data.customer_phone,
            customer_email: data.customer_email || null,
            company_name: data.company_name || null,
            location: data.location,
            additional_requirements: data.additional_requirements || null,
            status: "new",
          })
          .select("id")
          .single();

        if (enquiryError) {
          console.error("Supabase enquiry insert failed:", enquiryError);
          return NextResponse.json(
            { error: "Failed to record enquiry in database. Please try again." },
            { status: 500 }
          );
        }

        enquiryId = enquiryRecord.id;

        // Insert line items
        if (data.items && data.items.length > 0) {
          const itemRows = data.items.map((item) => ({
            enquiry_id: enquiryId,
            product_id: item.product_id || null,
            product_name_snapshot: item.product_name,
            product_sku_snapshot: item.product_sku || null,
            requested_quantity: item.requested_quantity,
            packaging_snapshot: item.packaging || null,
          }));

          const { error: itemsError } = await adminClient
            .from("enquiry_items")
            .insert(itemRows);

          if (itemsError) {
            console.error("Enquiry items insert error:", itemsError);
          }
        }
      }
    }

    // Build the formatted WhatsApp message
    const message = generateWhatsAppMessage(data);
    const whatsappUrl = buildWhatsAppUrl(targetPhone, message);

    return NextResponse.json({
      success: true,
      enquiry_id: enquiryId,
      whatsapp_url: whatsappUrl,
      message: "Enquiry saved successfully. You may now continue to WhatsApp.",
    });
  } catch (error: any) {
    console.error("Enquiry submission error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
