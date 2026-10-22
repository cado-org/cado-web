import React from "react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { EnquiryInbox } from "./EnquiryInbox";

export default async function AdminEnquiriesPage() {
  let enquiries: any[] = [];

  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data } = await supabase
        .from("enquiries")
        .select("*, items:enquiry_items(*)")
        .order("created_at", { ascending: false });
      enquiries = data || [];
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <EnquiryInbox enquiries={enquiries} />
    </div>
  );
}
