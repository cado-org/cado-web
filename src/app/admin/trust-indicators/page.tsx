import React from "react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { TrustIndicatorManager } from "./TrustIndicatorManager";

export default async function AdminTrustIndicatorsPage() {
  let indicators: any[] = [];

  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data } = await supabase
        .from("trust_indicators")
        .select("*")
        .order("display_order", { ascending: true });
      indicators = data || [];
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <TrustIndicatorManager indicators={indicators} />
    </div>
  );
}
