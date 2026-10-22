import React from "react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { BrandManager } from "./BrandManager";

export default async function AdminBrandsPage() {
  let brands: any[] = [];

  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data } = await supabase
        .from("brands")
        .select("*")
        .order("display_order", { ascending: true });
      brands = data || [];
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <BrandManager brands={brands} />
    </div>
  );
}
