import React from "react";
import { getCategories, getBrands } from "@/lib/data";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    getCategories(),
    getBrands(),
  ]);

  return (
    <div className="py-4">
      <ProductForm categories={categories} brands={brands} />
    </div>
  );
}
