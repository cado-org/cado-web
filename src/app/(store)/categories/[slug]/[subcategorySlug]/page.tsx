import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getProducts } from "@/lib/data";
import { ProductCard } from "@/components/products/ProductCard";
import { PackageOpen } from "lucide-react";

interface SubcategoryPageProps {
  params: Promise<{ slug: string; subcategorySlug: string }>;
}

export default async function SubcategoryPage({ params }: SubcategoryPageProps) {
  const { slug, subcategorySlug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const subcategory = category.subcategories?.find((s) => s.slug === subcategorySlug);
  if (!subcategory) {
    notFound();
  }

  const { products } = await getProducts({
    categorySlug: slug,
    subcategorySlug,
    limit: 24,
  });

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="text-xs text-gray-500 mb-6 flex items-center space-x-2">
          <Link href="/" className="hover:text-[#D71920] transition">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#D71920] transition">
            Shop
          </Link>
          <span>/</span>
          <Link
            href={`/categories/${category.slug}`}
            className="hover:text-[#D71920] transition"
          >
            {category.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-bold">{subcategory.name}</span>
        </nav>

        {/* Subcategory Header */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-8 shadow-xs">
          <h1 className="text-2xl sm:text-3xl font-black text-[#191919]">
            {subcategory.name}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-2xl leading-relaxed">
            {subcategory.description || `Browse quality ${subcategory.name} from CADO and trusted brands.`}
          </p>
        </div>

        {/* Products Grid or Empty State */}
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-xs">
            <PackageOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900">
              No products found in this subcategory.
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Please check back shortly or explore the parent category.
            </p>
            <div className="mt-5">
              <Link
                href={`/categories/${category.slug}`}
                className="px-4 py-2 bg-[#D71920] text-white text-xs font-bold rounded"
              >
                Back to {category.name}
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
