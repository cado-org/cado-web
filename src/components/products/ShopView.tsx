import React from "react";
import Link from "next/link";
import {
  getCategories,
  getBrands,
  getProducts,
} from "@/lib/data";
import { Filter, Search, PackageOpen, X } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import {
  CategoryFilterAccordion,
  ShopSortSelect,
  MobileFilters,
} from "@/components/products/ShopControls";
import { buildShopUrl } from "@/lib/urls";

interface ShopViewProps {
  currentCategory?: string;
  currentSubcategory?: string;
  currentBrand?: string;
  currentSort?: "newest" | "name_asc" | "name_desc";
  currentSearch?: string;
  currentPage?: number;
  canonicalPath?: string;
}

export async function ShopView({
  currentCategory = "",
  currentSubcategory = "",
  currentBrand = "",
  currentSort = "newest",
  currentSearch = "",
  currentPage = 1,
}: ShopViewProps) {
  const limit = 12;
  const offset = (currentPage - 1) * limit;

  const [categories, brands, { products, count }] = await Promise.all([
    getCategories(),
    getBrands(),
    getProducts({
      categorySlug: currentCategory || undefined,
      subcategorySlug: currentSubcategory || undefined,
      brandSlug: currentBrand || undefined,
      search: currentSearch || undefined,
      sortBy: currentSort,
      limit,
      offset,
    }),
  ]);

  const totalPages = Math.ceil(count / limit);

  // Active filter names (shown in header and removable chips)
  const activeCategory = categories.find((c) => c.slug === currentCategory);
  const activeCategoryName = activeCategory?.name || currentCategory;

  const activeSubcategory =
    activeCategory?.subcategories?.find((s) => s.slug === currentSubcategory) ||
    categories.flatMap((c) => c.subcategories || []).find((s) => s.slug === currentSubcategory);
  const activeSubcategoryName = activeSubcategory?.name || currentSubcategory;

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
          <Link
            href="/shop"
            className={currentCategory || currentBrand ? "hover:text-[#D71920] transition" : "text-gray-900 font-bold"}
          >
            Shop
          </Link>
          {currentCategory && (
            <>
              <span>/</span>
              <Link
                href={buildShopUrl({ category: currentCategory })}
                className={currentSubcategory ? "hover:text-[#D71920] transition" : "text-gray-900 font-bold"}
              >
                {activeCategoryName}
              </Link>
            </>
          )}
          {currentSubcategory && (
            <>
              <span>/</span>
              <span className="text-gray-900 font-bold">{activeSubcategoryName}</span>
            </>
          )}
          {currentBrand && !currentCategory && (
            <>
              <span>/</span>
              <span className="text-gray-900 font-bold">{activeBrandName}</span>
            </>
          )}
        </nav>

        {/* Page Header */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 mb-5 sm:mb-8 shadow-xs">
          <h1 className="text-xl sm:text-3xl font-black text-[#191919]">
            {currentSubcategory
              ? activeSubcategoryName
              : currentCategory
              ? activeCategoryName
              : currentBrand
              ? `${activeBrandName} Products`
              : "All Building Materials & Chemicals"}
          </h1>
          {activeCategory?.description && !currentSubcategory && !currentBrand && (
            <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-3xl leading-relaxed">
              {activeCategory.description}
            </p>
          )}
          {activeSubcategory?.description && (
            <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-3xl leading-relaxed">
              {activeSubcategory.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 lg:gap-8">
          {/* Sidebar Filters (hidden on mobile, visible on desktop) */}
          <aside className="hidden lg:block lg:col-span-1 space-y-4 lg:space-y-6">
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
                {currentSubcategory && (
                  <input type="hidden" name="subcategory" value={currentSubcategory} />
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

            {/* Categories Filter with Expandable Subcategories */}
            <div className="hidden lg:block bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center space-x-2">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Categories</span>
                </h2>
                {(currentCategory || currentSubcategory) && (
                  <Link
                    href={buildShopUrl({
                      brand: currentBrand,
                      q: currentSearch,
                      sort: currentSort,
                    })}
                    className="text-[11px] text-[#D71920] hover:underline"
                  >
                    Clear
                  </Link>
                )}
              </div>

              <CategoryFilterAccordion
                categories={categories}
                currentCategory={currentCategory}
                currentSubcategory={currentSubcategory}
                currentBrand={currentBrand}
                currentSort={currentSort}
                currentSearch={currentSearch}
              />
            </div>

            {/* Brands Filter */}
            <div className="hidden lg:block bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Brands
                </h2>
                {currentBrand && (
                  <Link
                    href={buildShopUrl({
                      category: currentCategory,
                      subcategory: currentSubcategory,
                      q: currentSearch,
                      sort: currentSort,
                    })}
                    className="text-[11px] text-[#D71920] hover:underline"
                  >
                    Clear
                  </Link>
                )}
              </div>

              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                <Link
                  href={buildShopUrl({
                    category: currentCategory,
                    subcategory: currentSubcategory,
                    q: currentSearch,
                    sort: currentSort,
                  })}
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
                    href={buildShopUrl({
                      category: currentCategory,
                      subcategory: currentSubcategory,
                      brand: b.slug,
                      q: currentSearch,
                      sort: currentSort,
                    })}
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
            {/* Top Toolbar: Filters + Functional Sort Dropdown + Result count all in ONE LINE */}
            <div className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-2">
                <MobileFilters
                  categories={categories}
                  brands={brands}
                  currentCategory={currentCategory}
                  currentSubcategory={currentSubcategory}
                  currentBrand={currentBrand}
                  currentSort={currentSort}
                  currentSearch={currentSearch}
                />

                {/* Working Sort Control */}
                <ShopSortSelect
                  currentSort={currentSort}
                  currentCategory={currentCategory}
                  currentSubcategory={currentSubcategory}
                  currentBrand={currentBrand}
                  currentSearch={currentSearch}
                />
              </div>

              {/* Showing count */}
              <p className="text-[11px] sm:text-xs text-gray-500 shrink-0">
                <span className="hidden sm:inline">Showing </span>
                <span className="font-bold text-gray-900">{products.length}</span> of{" "}
                <span className="font-bold text-gray-900">{count}</span>
                <span className="hidden sm:inline"> products</span>
              </p>
            </div>

            {/* Active filter chips (mobile only) */}
            {(currentCategory || currentSubcategory || currentBrand) && (
              <div className="flex flex-wrap items-center gap-2 lg:hidden">
                {currentCategory && (
                  <Link
                    href={buildShopUrl({
                      brand: currentBrand,
                      q: currentSearch,
                      sort: currentSort,
                    })}
                    className="inline-flex items-center gap-1 pl-3 pr-2 py-1 rounded-full bg-red-50 border border-red-200 text-[11px] font-semibold text-[#D71920]"
                  >
                    <span>{activeCategoryName}</span>
                    <X className="w-3 h-3" />
                  </Link>
                )}
                {currentSubcategory && (
                  <Link
                    href={buildShopUrl({
                      category: currentCategory,
                      brand: currentBrand,
                      q: currentSearch,
                      sort: currentSort,
                    })}
                    className="inline-flex items-center gap-1 pl-3 pr-2 py-1 rounded-full bg-red-50 border border-red-200 text-[11px] font-semibold text-[#D71920]"
                  >
                    <span>{activeSubcategoryName}</span>
                    <X className="w-3 h-3" />
                  </Link>
                )}
                {currentBrand && (
                  <Link
                    href={buildShopUrl({
                      category: currentCategory,
                      subcategory: currentSubcategory,
                      q: currentSearch,
                      sort: currentSort,
                    })}
                    className="inline-flex items-center gap-1 pl-3 pr-2 py-1 rounded-full bg-red-50 border border-red-200 text-[11px] font-semibold text-[#D71920]"
                  >
                    <span>{activeBrandName}</span>
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
                      href={buildShopUrl({
                        category: currentCategory,
                        subcategory: currentSubcategory,
                        brand: currentBrand,
                        q: currentSearch,
                        sort: currentSort,
                        page: pNum,
                      })}
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
