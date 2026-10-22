import React from "react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { HomepageSectionManager } from "./HomepageSectionManager";

export default async function AdminHomepageSectionsPage() {
  let sections: any[] = [];

  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data } = await supabase
        .from("homepage_sections")
        .select("*")
        .order("display_order", { ascending: true });
      sections = data || [];
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <HomepageSectionManager sections={sections} />
    </div>
  );
}
