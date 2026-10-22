import React from "react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { BannerManager } from "./BannerManager";

export default async function AdminBannersPage() {
  let banners: any[] = [];

  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data } = await supabase
        .from("hero_banners")
        .select("*")
        .order("display_order", { ascending: true });
      banners = data || [];
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <BannerManager banners={banners} />
    </div>
  );
}
