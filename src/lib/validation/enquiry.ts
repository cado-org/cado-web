import { z } from "zod";

export const enquiryItemSchema = z.object({
  product_id: z.string().optional().nullable(),
  product_name: z.string().min(1, "Product name is required"),
  product_sku: z.string().optional().nullable(),
  requested_quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  packaging: z.string().optional().nullable(),
});

export const enquiryFormSchema = z.object({
  customer_name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be under 100 characters"),
  customer_phone: z
    .string()
    .min(10, "Please enter a valid 10-digit mobile number")
    .regex(/^[0-9+\s-]{10,15}$/, "Please enter a valid phone number"),
  customer_email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  company_name: z.string().max(100).optional().or(z.literal("")),
  location: z
    .string()
    .min(2, "Delivery city/location is required")
    .max(150, "Location too long"),
  additional_requirements: z.string().max(1000).optional().or(z.literal("")),
  items: z.array(enquiryItemSchema).min(1, "At least one product is required"),
});

export type EnquiryFormData = z.infer<typeof enquiryFormSchema>;

export function generateWhatsAppMessage(
  data: EnquiryFormData,
  companyName: string = "CADO Building Products"
): string {
  const isGeneral =
    data.items.length === 1 &&
    (!data.items[0].product_id ||
      data.items[0].product_name === "General Building Materials Enquiry");

  const lines: string[] = [
    `*Hello ${companyName} Team,*`,
    "",
  ];

  if (isGeneral) {
    lines.push("I would like to enquire about bulk / large quantity building materials supply.");
    lines.push("");
  } else {
    lines.push("I would like to enquire about the following building product(s):");
    lines.push("");

    data.items.forEach((item, index) => {
      lines.push(`*Item ${index + 1}:* ${item.product_name}`);
      if (item.product_sku) lines.push(`  • Code/SKU: ${item.product_sku}`);
      if (item.requested_quantity && item.requested_quantity > 1) {
        lines.push(`  • Quantity: ${item.requested_quantity} ${item.packaging ? `(${item.packaging})` : ""}`);
      } else if (item.packaging) {
        lines.push(`  • Packaging: ${item.packaging}`);
      }
      lines.push("");
    });
  }

  lines.push("*Customer Details:*");
  lines.push(`• Name: ${data.customer_name}`);
  lines.push(`• Phone: ${data.customer_phone}`);
  if (data.company_name) lines.push(`• Company: ${data.company_name}`);
  if (data.customer_email) lines.push(`• Email: ${data.customer_email}`);
  lines.push(`• Delivery Location: ${data.location}`);

  if (data.additional_requirements) {
    lines.push("");
    lines.push(`*Requirements / Notes:* ${data.additional_requirements}`);
  }

  lines.push("");
  lines.push("Please share product availability, best bulk pricing, and quotation.");
  lines.push("Thank you!");

  return lines.join("\n");
}

export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  // Normalize phone number to digits only
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}
