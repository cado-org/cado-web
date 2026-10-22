import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  getCategories,
  getBrands,
  getProducts,
} from "@/lib/data";
import { Filter, ArrowUpDown, Search, PackageOpen, X } from "lucide-react";
import { ProductCard, MobileFilters } from "@/components/products/ProductCard";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    sort?: "newest" | "name_asc" | "name_desc";
    q?: string;
    page?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const sp = await searchParams;
  const currentCategory = sp.category || "";
  const currentBrand = sp.brand || "";
  const currentSort = sp.sort || "newest";
  const currentSearch = sp.q || "";
  const currentPage = parseInt(sp.page || "1", 10) || 1;
  const limit = 12;
  const offset = (currentPage - 1) * limit;

  const [categories, brands, { products, count }] = await Promise.all([
    getCategories(),
    getBrands(),
    getProducts({
      categorySlug: currentCategory || undefined,
      brandSlug: currentBrand || undefined,
      search: currentSearch || undefined,
      sortBy: currentSort,
      limit,
      offset,
    }),
  ]);

  const totalPages = Math.ceil(count / limit);

  // Active filter names (shown as removable chips on mobile)
  const activeCategoryName = currentCategory
    ? categories.find((c) => c.slug === currentCategory)?.name || currentCategory
    : "";
  const activeBrandName = currentBrand
    ? brands.find((b) => b.slug === currentBrand)?.name || currentBrand
    : "";

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-4 sm:mb-6 flex items-center space-x-2">
          <Link href="/" className="hover:text-[#D71920] transition">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-bold">Building Materials Shop</span>
        </nav>

        {/* Page Header */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 mb-5 sm:mb-8 shadow-xs">
          <h1 className="text-xl sm:text-3xl font-black text-[#191919]">
            {currentCategory
              ? categories.find((c) => c.slug === currentCategory)?.name || "Products"
              : currentBrand
              ? `${brands.find((b) => b.slug === currentBrand)?.name || "Brand"} Products`
              : "All Building Materials & Chemicals"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Browse genuine tile adhesives, construction chemicals, sealants, plumbing fittings and accessories.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 lg:gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1 space-y-4 lg:space-y-6">
            {/* Search within shop */}
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3 flex items-center space-x-2">
                <Search className="w-3.5 h-3.5" />
                <span>Search Catalog</span>
              </h2>
              <form action="/shop" method="GET">
                {currentCategory && (
                  <input type="hidden" name="category" value={currentCategory} />
                )}
                {currentBrand && (
                  <input type="hidden" name="brand" value={currentBrand} />
                )}
                <div className="relative">
                  <input
                    type="text"
                    name="q"
                    defaultValue={currentSearch}
                    placeholder="Search product name..."
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#D71920] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D71920]"
                    aria-label="Submit search"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Categories Filter (desktop only — mobile uses the Filters pop-up) */}
            <div className="hidden lg:block bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center space-x-2">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Categories</span>
                </h2>
                {currentCategory && (
                  <Link
                    href={`/shop?${new URLSearchParams({
                      ...(currentBrand ? { brand: currentBrand } : {}),
                      ...(currentSort ? { sort: currentSort } : {}),
                    }).toString()}`}
                    className="text-[11px] text-[#D71920] hover:underline"
                  >
                    Clear
                  </Link>
                )}
              </div>

              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                <Link
                  href={`/shop?${new URLSearchParams({
                    ...(currentBrand ? { brand: currentBrand } : {}),
                    ...(currentSort ? { sort: currentSort } : {}),
                  }).toString()}`}
                  className={`block px-2.5 py-1.5 rounded text-xs transition ${
                    !currentCategory
                      ? "bg-red-50 text-[#D71920] font-bold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  All Categories
                </Link>

                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?${new URLSearchParams({
                      category: cat.slug,
                      ...(currentBrand ? { brand: currentBrand } : {}),
                      ...(currentSort ? { sort: currentSort } : {}),
                    }).toString()}`}
                    className={`block px-2.5 py-1.5 rounded text-xs transition ${
                      currentCategory === cat.slug
                        ? "bg-red-50 text-[#D71920] font-bold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Brands Filter (desktop only — mobile uses the Filters pop-up) */}
            <div className="hidden lg:block bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Brands
                </h2>
                {currentBrand && (
                  <Link
                    href={`/shop?${new URLSearchParams({
                      ...(currentCategory ? { category: currentCategory } : {}),
                      ...(currentSort ? { sort: currentSort } : {}),
                    }).toString()}`}
                    className="text-[11px] text-[#D71920] hover:underline"
                  >
                    Clear
                  </Link>
                )}
              </div>

              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                <Link
                  href={`/shop?${new URLSearchParams({
                    ...(currentCategory ? { category: currentCategory } : {}),
                    ...(currentSort ? { sort: currentSort } : {}),
                  }).toString()}`}
                  className={`block px-2.5 py-1.5 rounded text-xs transition ${
                    !currentBrand
                      ? "bg-red-50 text-[#D71920] font-bold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  All Brands
                </Link>

                {brands.map((b) => (
                  <Link
                    key={b.id}
                    href={`/shop?${new URLSearchParams({
                      brand: b.slug,
                      ...(currentCategory ? { category: currentCategory } : {}),
                      ...(currentSort ? { sort: currentSort } : {}),
                    }).toString()}`}
                    className={`block px-2.5 py-1.5 rounded text-xs transition ${
                      currentBrand === b.slug
                        ? "bg-red-50 text-[#D71920] font-bold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {b.name}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Catalog View */}
          <main className="lg:col-span-3 space-y-4 sm:space-y-6">
            {/* Top Toolbar: Filters button (mobile) + Result count + Sorting */}
            <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center justify-between gap-3">
                <MobileFilters
                  categories={categories}
                  brands={brands}
                  currentCategory={currentCategory}
                  currentBrand={currentBrand}
                  currentSort={currentSort}
                  currentSearch={currentSearch}
                />
                <p className="text-xs text-gray-500">
                  Showing <span className="font-bold text-gray-900">{products.length}</span> of{" "}
                  <span className="font-bold text-gray-900">{count}</span> products
                </p>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-500">Sort:</span>
                <div className="flex items-center space-x-1">
                  <Link
                    href={`/shop?${new URLSearchParams({
                      ...(currentCategory ? { category: currentCategory } : {}),
                      ...(currentBrand ? { brand: currentBrand } : {}),
                      ...(currentSearch ? { q: currentSearch } : {}),
                      sort: "newest",
                    }).toString()}`}
                    className={`px-2.5 py-1 rounded text-xs font-semibold ${
                      currentSort === "newest"
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Newest
                  </Link>
                  <Link
                    href={`/shop?${new URLSearchParams({
                      ...(currentCategory ? { category: currentCategory } : {}),
                      ...(currentBrand ? { brand: currentBrand } : {}),
                      ...(currentSearch ? { q: currentSearch } : {}),
                      sort: "name_asc",
                    }).toString()}`}
                    className={`px-2.5 py-1 rounded text-xs font-semibold ${
                      currentSort === "name_asc"
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Name A-Z
                  </Link>
                </div>
              </div>
            </div>

            {/* Active filter chips (mobile only) */}
            {(currentCategory || currentBrand) && (
              <div className="flex flex-wrap items-center gap-2 lg:hidden">
                {currentCategory && (
                  <Link
                    href={`/shop?${new URLSearchParams({
                      ...(currentBrand ? { brand: currentBrand } : {}),
                      ...(currentSearch ? { q: currentSearch } : {}),
                      ...(currentSort ? { sort: currentSort } : {}),
                    }).toString()}`}
                    className="inline-flex items-center gap-1 pl-3 pr-2 py-1 rounded-full bg-red-50 border border-red-200 text-[11px] font-semibold text-[#D71920]"
                  >
                    {activeCategoryName}
                    <X className="w-3 h-3" />
                  </Link>
                )}
                {currentBrand && (
                  <Link
                    href={`/shop?${new URLSearchParams({
                      ...(currentCategory ? { category: currentCategory } : {}),
                      ...(currentSearch ? { q: currentSearch } : {}),
                      ...(currentSort ? { sort: currentSort } : {}),
                    }).toString()}`}
                    className="inline-flex items-center gap-1 pl-3 pr-2 py-1 rounded-full bg-red-50 border border-red-200 text-[11px] font-semibold text-[#D71920]"
                  >
                    {activeBrandName}
                    <X className="w-3 h-3" />
                  </Link>
                )}
              </div>
            )}

            {/* Product Grid or Empty State */}
            {products.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-16 text-center shadow-xs">
                <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PackageOpen className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  No products are available yet.
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                  There are currently no products matching your selected filters. Please adjust your criteria or check back soon.
                </p>
                <div className="mt-5">
                  <Link
                    href="/shop"
                    className="inline-flex items-center px-4 py-2 bg-[#D71920] hover:bg-[#B5121B] text-white text-xs font-bold rounded"
                  >
                    Reset Filters
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-4 sm:pt-6">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pNum = i + 1;
                  return (
                    <Link
                      key={pNum}
                      href={`/shop?${new URLSearchParams({
                        ...(currentCategory ? { category: currentCategory } : {}),
                        ...(currentBrand ? { brand: currentBrand } : {}),
                        ...(currentSearch ? { q: currentSearch } : {}),
                        ...(currentSort ? { sort: currentSort } : {}),
                        page: String(pNum),
                      }).toString()}`}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold transition ${
                        currentPage === pNum
                          ? "bg-[#D71920] text-white"
                          : "bg-white border border-gray-200 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {pNum}
                    </Link>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}