"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpDown,
  ChevronDown,
  SlidersHorizontal,
  X,
  Check,
} from "lucide-react";
import { Category, Brand } from "@/types/database";
import { buildShopUrl } from "@/lib/urls";

/* ------------------------------------------------------------------ */
/*  1. ShopSortSelect: Functional Interactive Sort Control             */
/* ------------------------------------------------------------------ */

interface ShopSortSelectProps {
  currentSort: string;
  currentCategory?: string;
  currentSubcategory?: string;
  currentBrand?: string;
  currentSearch?: string;
}

export function ShopSortSelect({
  currentSort,
  currentCategory,
  currentSubcategory,
  currentBrand,
  currentSearch,
}: ShopSortSelectProps) {
  const router = useRouter();

  const handleSortChange = (newSort: string) => {
    router.push(
      buildShopUrl({
        category: currentCategory,
        subcategory: currentSubcategory,
        brand: currentBrand,
        q: currentSearch,
        sort: newSort,
      })
    );
  };

  const getLabel = () => {
    if (currentSort === "name_asc") return "Name: A to Z";
    if (currentSort === "name_desc") return "Name: Z to A";
    return "Sort: Newest";
  };

  return (
    <div className="relative inline-flex items-center">
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold shadow-2xs transition pointer-events-none">
        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
        <span>{getLabel()}</span>
        <ChevronDown className="w-3 h-3 text-gray-400 ml-0.5" />
      </div>
      <select
        value={currentSort || "newest"}
        onChange={(e) => handleSortChange(e.target.value)}
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full text-xs"
        aria-label="Sort products"
      >
        <option value="newest">Sort: Newest</option>
        <option value="name_asc">Name: A to Z</option>
        <option value="name_desc">Name: Z to A</option>
      </select>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  2. CategoryFilterAccordion: Desktop Sidebar Category List         */
/* ------------------------------------------------------------------ */

interface CategoryFilterAccordionProps {
  categories: Category[];
  currentCategory: string;
  currentSubcategory: string;
  currentBrand?: string;
  currentSort?: string;
  currentSearch?: string;
}

export function CategoryFilterAccordion({
  categories,
  currentCategory,
  currentSubcategory,
  currentBrand,
  currentSort,
  currentSearch,
}: CategoryFilterAccordionProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (currentCategory) {
      initial[currentCategory] = true;
    }
    return initial;
  });

  // Keep expanded in sync if user navigates
  useEffect(() => {
    if (currentCategory) {
      setExpanded((prev) => ({ ...prev, [currentCategory]: true }));
    }
  }, [currentCategory]);

  const toggleExpand = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpanded((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  const buildUrl = (catSlug?: string, subSlug?: string) => {
    return buildShopUrl({
      category: catSlug,
      subcategory: subSlug,
      brand: currentBrand,
      q: currentSearch,
      sort: currentSort,
    });
  };

  return (
    <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
      {/* All Categories Option */}
      <Link
        href={buildUrl()}
        className={`block px-2.5 py-1.5 rounded text-xs transition ${
          !currentCategory && !currentSubcategory
            ? "bg-red-50 text-[#D71920] font-bold"
            : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        All Categories
      </Link>

      {categories.map((cat) => {
        const hasSubs = cat.subcategories && cat.subcategories.length > 0;
        const isCatActive = currentCategory === cat.slug && !currentSubcategory;
        const isParentOfActiveSub = currentCategory === cat.slug && !!currentSubcategory;
        const isExpanded = !!expanded[cat.slug] || isParentOfActiveSub || currentCategory === cat.slug;

        return (
          <div key={cat.id} className="rounded">
            <div
              className={`flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition ${
                isCatActive
                  ? "bg-red-50 text-[#D71920] font-bold"
                  : isParentOfActiveSub
                  ? "text-[#D71920] font-semibold hover:bg-gray-50"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Link href={buildUrl(cat.slug)} className="flex-1 truncate">
                {cat.name}
              </Link>

              {hasSubs && (
                <button
                  type="button"
                  onClick={(e) => toggleExpand(cat.slug, e)}
                  className="p-1 -mr-1 rounded hover:bg-gray-200/70 text-gray-400 hover:text-gray-700 transition"
                  aria-label={isExpanded ? `Collapse ${cat.name}` : `Expand ${cat.name}`}
                >
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isExpanded ? "rotate-0 text-[#D71920]" : "-rotate-90 text-gray-400"
                    }`}
                  />
                </button>
              )}
            </div>

            {/* Subcategories list when expanded */}
            {hasSubs && isExpanded && (
              <div className="pl-3 pr-1 py-1 space-y-1 border-l-2 border-red-200 ml-3.5 my-1">
                {cat.subcategories!.map((sub) => {
                  const isSubActive =
                    currentCategory === cat.slug && currentSubcategory === sub.slug;
                  return (
                    <Link
                      key={sub.id}
                      href={buildUrl(cat.slug, sub.slug)}
                      className={`block px-2 py-1 rounded text-[11px] transition ${
                        isSubActive
                          ? "bg-red-50 text-[#D71920] font-bold"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      {sub.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  3. MobileFilters: Bottom sheet with expandable subcategories       */
/* ------------------------------------------------------------------ */

interface MobileFiltersProps {
  categories: Category[];
  brands: Brand[];
  currentCategory: string;
  currentSubcategory: string;
  currentBrand: string;
  currentSort: string;
  currentSearch: string;
}

export function MobileFilters({
  categories,
  brands,
  currentCategory,
  currentSubcategory,
  currentBrand,
  currentSort,
  currentSearch,
}: MobileFiltersProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(currentCategory);
  const [subcategory, setSubcategory] = useState(currentSubcategory);
  const [brand, setBrand] = useState(currentBrand);
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    if (currentCategory) init[currentCategory] = true;
    return init;
  });

  const activeCount =
    (currentCategory ? 1 : 0) +
    (currentSubcategory ? 1 : 0) +
    (currentBrand ? 1 : 0);

  const pendingCount =
    (category ? 1 : 0) +
    (subcategory ? 1 : 0) +
    (brand ? 1 : 0);

  const openSheet = () => {
    setCategory(currentCategory);
    setSubcategory(currentSubcategory);
    setBrand(currentBrand);
    if (currentCategory) {
      setExpandedCats((prev) => ({ ...prev, [currentCategory]: true }));
    }
    setOpen(true);
  };

  // Lock body scroll on mobile sheet open
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const toggleExpand = (catSlug: string) => {
    setExpandedCats((prev) => ({ ...prev, [catSlug]: !prev[catSlug] }));
  };

  const applyFilters = () => {
    router.push(
      buildShopUrl({
        category,
        subcategory,
        brand,
        q: currentSearch,
        sort: currentSort,
      })
    );
    setOpen(false);
  };

  const clearAll = () => {
    setCategory("");
    setSubcategory("");
    setBrand("");
  };

  const brandChipClass = (selected: boolean) =>
    `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
      selected
        ? "bg-red-50 border-[#D71920] text-[#D71920]"
        : "bg-white border-gray-200 text-gray-700 active:bg-gray-100"
    }`;

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={openSheet}
        className="lg:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold cursor-pointer active:scale-95 transition shadow-2xs"
      >
        <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
        <span>Filters</span>
        {activeCount > 0 && (
          <span className="min-w-[16px] h-[16px] px-1 rounded-full bg-[#D71920] text-white text-[10px] leading-[16px] text-center font-bold">
            {activeCount}
          </span>
        )}
      </button>

      {/* Bottom Sheet */}
      <div
        className={`fixed inset-0 z-[100] lg:hidden transition-[visibility] duration-0 ${
          open ? "visible" : "invisible delay-300"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Filter products"
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <button
          type="button"
          aria-label="Close filters"
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Sheet Content */}
        <div
          className={`absolute inset-x-0 bottom-0 max-h-[85vh] flex flex-col bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out ${
            open ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {/* Drag Handle */}
          <div className="pt-2.5 pb-1 flex justify-center">
            <span className="w-10 h-1 rounded-full bg-gray-300" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <h2 className="text-base font-black text-[#191919]">Filters</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close filters"
              className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center cursor-pointer active:bg-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
            {/* Categories & Subcategories */}
            <section>
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Categories &amp; Subcategories
                </h3>
                {(category || subcategory) && (
                  <button
                    type="button"
                    onClick={() => {
                      setCategory("");
                      setSubcategory("");
                    }}
                    className="text-[11px] text-[#D71920] font-semibold hover:underline cursor-pointer"
                  >
                    Clear Category
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {categories.map((cat) => {
                  const hasSubs = cat.subcategories && cat.subcategories.length > 0;
                  const isCatSelected = category === cat.slug;
                  const isExpanded = !!expandedCats[cat.slug] || isCatSelected;

                  return (
                    <div
                      key={cat.id}
                      className={`rounded-xl border transition ${
                        isCatSelected
                          ? "border-red-300 bg-red-50/20"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between p-2.5">
                        <button
                          type="button"
                          onClick={() => {
                            if (isCatSelected) {
                              setCategory("");
                              setSubcategory("");
                            } else {
                              setCategory(cat.slug);
                              setSubcategory("");
                              if (hasSubs) {
                                setExpandedCats((prev) => ({
                                  ...prev,
                                  [cat.slug]: true,
                                }));
                              }
                            }
                          }}
                          className="flex-1 flex items-center gap-2 text-left text-xs font-semibold cursor-pointer"
                        >
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isCatSelected
                                ? "border-[#D71920] bg-[#D71920] text-white"
                                : "border-gray-300 bg-white"
                            }`}
                          >
                            {isCatSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </span>
                          <span
                            className={
                              isCatSelected ? "text-[#D71920] font-bold" : "text-gray-800"
                            }
                          >
                            {cat.name}
                          </span>
                        </button>

                        {hasSubs && (
                          <button
                            type="button"
                            onClick={() => toggleExpand(cat.slug)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition flex items-center gap-1 cursor-pointer"
                            aria-label={
                              isExpanded
                                ? `Hide subcategories for ${cat.name}`
                                : `Show subcategories for ${cat.name}`
                            }
                          >
                            <span className="text-[10px] text-gray-400 font-normal">
                              {cat.subcategories?.length}
                            </span>
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${
                                isExpanded
                                  ? "rotate-0 text-[#D71920]"
                                  : "-rotate-90 text-gray-400"
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {/* Subcategories (accordion shown on arrow click) */}
                      {hasSubs && isExpanded && (
                        <div className="px-3 pb-3 pt-1 border-t border-gray-100 bg-gray-50/70 rounded-b-xl">
                          <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-2">
                            Select Subcategory:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {cat.subcategories!.map((sub) => {
                              const isSubSelected =
                                category === cat.slug && subcategory === sub.slug;
                              return (
                                <button
                                  key={sub.id}
                                  type="button"
                                  onClick={() => {
                                    if (isSubSelected) {
                                      setSubcategory("");
                                    } else {
                                      setCategory(cat.slug);
                                      setSubcategory(sub.slug);
                                    }
                                  }}
                                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition ${
                                    isSubSelected
                                      ? "bg-[#D71920] text-white font-bold shadow-xs"
                                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                                  }`}
                                >
                                  {isSubSelected && (
                                    <Check className="w-3 h-3 stroke-[2.5]" />
                                  )}
                                  <span>{sub.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Brands */}
            <section>
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Brands
                </h3>
                {brand && (
                  <button
                    type="button"
                    onClick={() => setBrand("")}
                    className="text-[11px] text-[#D71920] font-semibold hover:underline cursor-pointer"
                  >
                    Clear Brand
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {brands.map((b) => {
                  const selected = brand === b.slug;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBrand(selected ? "" : b.slug)}
                      className={brandChipClass(selected)}
                    >
                      {selected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                      <span>{b.name}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Sticky Footer */}
          <div className="flex items-center gap-3 px-5 py-3 border-t border-gray-100 bg-white pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={clearAll}
              disabled={pendingCount === 0}
              className="px-4 py-3 rounded-xl border border-gray-300 text-sm font-bold text-gray-700 disabled:opacity-40 cursor-pointer"
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={applyFilters}
              className="flex-1 py-3 rounded-xl bg-[#D71920] active:bg-[#B5121B] text-white text-sm font-bold cursor-pointer"
            >
              {pendingCount > 0 ? `Apply filters (${pendingCount})` : "Show all products"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
