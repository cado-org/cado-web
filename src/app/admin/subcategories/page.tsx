import React from "react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/env";
import { SubcategoryManager } from "./SubcategoryManager";

export default async function AdminSubcategoriesPage() {
  let subcategories: any[] = [];
  const categories = await getCategories();

  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data } = await supabase
        .from("subcategories")
        .select("*, category:categories(name, id)")
        .order("display_order", { ascending: true });
      subcategories = data || [];
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <SubcategoryManager subcategories={subcategories} categories={categories} />
    </div>
  );
}
