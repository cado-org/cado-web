import React from "react";
import Link from "next/link";
import { getProducts } from "@/lib/data";
import { ProductCard } from "@/components/products/ProductCard";
import { Search, PackageOpen } from "lucide-react";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q || "";

  const { products, count } = query
    ? await getProducts({ search: query, limit: 30 })
    : { products: [], count: 0 };

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8 shadow-xs">
          <div className="max-w-xl">
            <h1 className="text-2xl sm:text-3xl font-black text-[#191919]">
              Search Results
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {query ? (
                <>
                  Found <span className="font-bold text-gray-900">{count}</span>{" "}
                  result(s) for &ldquo;<span className="text-[#D71920] font-semibold">{query}</span>&rdquo;
                </>
              ) : (
                "Search our product catalog by product name, SKU, or category."
              )}
            </p>

            <form action="/search" method="GET" className="mt-4 relative">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search products, brands or categories..."
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:bg-white focus:border-[#D71920]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </form>
          </div>
        </div>

        {/* Results */}
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-xs">
            <PackageOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900">
              {query ? "No matching products found." : "Start typing to search products."}
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              {query
                ? "Try searching with broader terms like 'adhesive', 'grout', 'PVC', or browse our categories."
                : "Explore our tile adhesives, construction chemicals, and plumbing catalog."}
            </p>
            <div className="mt-5">
              <Link
                href="/shop"
                className="px-4 py-2 bg-[#D71920] text-white text-xs font-bold rounded"
              >
                Browse All Products
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
