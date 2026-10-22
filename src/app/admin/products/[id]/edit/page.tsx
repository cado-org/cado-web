import React from "react";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCategories, getBrands } from "@/lib/data";
import { ProductForm } from "@/components/admin/ProductForm";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    notFound();
  }

  const [{ data: product }, categories, brands] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    getCategories(),
    getBrands(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="py-4">
      <ProductForm
        initialData={product}
        categories={categories}
        brands={brands}
      />
    </div>
  );
}
