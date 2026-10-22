import React from "react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { CategoryManager } from "./CategoryManager";

export default async function AdminCategoriesPage() {
  let categories: any[] = [];

  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data } = await supabase
        .from("categories")
        .select("*, subcategories(count), products(count)")
        .order("display_order", { ascending: true });
      categories = data || [];
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <CategoryManager categories={categories} />
    </div>
  );
}
