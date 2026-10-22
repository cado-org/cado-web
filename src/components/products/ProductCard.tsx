"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  Plus,
  Check,
  Package,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Product } from "@/types/database";
import { useEnquiry } from "@/lib/context/EnquiryContext";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { openEnquiryModal, addToCart } = useEnquiry();
  const [added, setAdded] = React.useState(false);
  const [imgError, setImgError] = React.useState(false);

  const handleAddToCart = () => {
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const specs = product.specifications || [];

  return (
    <div className="relative bg-white border border-gray-200 rounded-xl p-2.5 sm:p-4 flex flex-col justify-between hover:shadow-md hover:border-gray-300 active:scale-[0.98] lg:active:scale-100 transition-all duration-200 group">
      <div>
        {/* Product Image */}
        <div className="relative w-full aspect-square bg-[#F8FAFC] rounded-lg overflow-hidden p-3 flex items-center justify-center">
          {product.main_image_url && !imgError ? (
            <Image
              src={product.main_image_url}
              alt={product.name}
              fill
              onError={() => setImgError(true)}
              className="object-contain p-2 group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-gray-300">
              <Package className="w-8 h-8" />
              <span className="text-gray-400 font-bold text-xs">CADO</span>
            </div>
          )}

          {product.packaging_details && (
            <span className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 max-w-[80%] truncate bg-white/95 text-[9px] sm:text-[10px] font-bold text-gray-700 px-1.5 sm:px-2 py-0.5 rounded border border-gray-200 shadow-xs">
              {product.packaging_details}
            </span>
          )}

          {product.brand && (
            <span className="absolute bottom-1.5 left-1.5 sm:bottom-2.5 sm:left-2.5 bg-gray-900/80 text-[9px] sm:text-[10px] font-bold text-white px-1.5 sm:px-2 py-0.5 rounded">
              {product.brand.name}
            </span>
          )}
        </div>

        {/* Title & SKU */}
        <div className="mt-2.5 sm:mt-3.5">
          {/*
            Mobile: this link is stretched over the whole card (after:absolute after:inset-0)
            so tapping anywhere opens the detail page. Desktop (lg): normal title link.
          */}
          <Link
            href={`/products/${product.slug}`}
            className="hover:text-[#D71920] transition after:absolute after:inset-0 lg:after:hidden"
          >
            <h3 className="font-bold text-[13px] sm:text-sm text-gray-900 line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
          {product.sku && (
            <p className="text-[10px] sm:text-[11px] font-mono text-gray-400 mt-0.5 truncate">
              Code: {product.sku}
            </p>
          )}
        </div>

        {/* Technical Highlights / Bullets */}
        {specs.length > 0 && (
          <div className="mt-2 sm:mt-2.5 space-y-1">
            {specs.slice(0, 3).map((spec, i) => (
              <div
                key={i}
                className={`items-start text-[10px] sm:text-[11px] text-gray-600 leading-tight ${
                  i === 2 ? "hidden sm:flex" : "flex"
                }`}
              >
                <span className="w-1 h-1 rounded-full bg-[#D71920] shrink-0 mt-1.5 mr-1.5" />
                <span className="line-clamp-1">{spec.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buttons: View Details (desktop only) + Enquire + Add */}
      <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-gray-100 flex items-center gap-2">
        <Link
          href={`/products/${product.slug}`}
          className="hidden lg:block flex-1 py-2 px-2.5 border border-gray-300 hover:border-gray-400 text-gray-800 text-xs font-bold rounded-lg text-center transition"
        >
          View Details
        </Link>

        <button
          type="button"
          onClick={() => openEnquiryModal(product)}
          className="relative z-10 flex-1 min-w-0 py-2 px-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition shadow-xs cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5 shrink-0" />
          <span>Enquire</span>
        </button>

        <button
          type="button"
          onClick={handleAddToCart}
          className={`relative z-10 shrink-0 flex items-center justify-center w-9 h-9 lg:w-auto lg:h-auto lg:p-2 border rounded-lg transition cursor-pointer ${
            added
              ? "bg-green-50 border-green-500 text-green-600"
              : "border-gray-300 hover:border-[#D71920] hover:text-[#D71920] text-gray-600"
          }`}
          title="Add to enquiry list"
          aria-label="Add to enquiry list"
        >
          {added ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile filter bottom-sheet (used by the shop page, mobile only)    */
/* ------------------------------------------------------------------ */

interface FilterOption {
  id: string | number;
  name: string;
  slug: string;
}

interface MobileFiltersProps {
  categories: FilterOption[];
  brands: FilterOption[];
  currentCategory: string;
  currentBrand: string;
  currentSort: string;
  currentSearch: string;
}

export function MobileFilters({
  categories,
  brands,
  currentCategory,
  currentBrand,
  currentSort,
  currentSearch,
}: MobileFiltersProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [category, setCategory] = React.useState(currentCategory);
  const [brand, setBrand] = React.useState(currentBrand);

  const activeCount = (currentCategory ? 1 : 0) + (currentBrand ? 1 : 0);
  const pendingCount = (category ? 1 : 0) + (brand ? 1 : 0);

  const openSheet = () => {
    // Start from whatever is currently applied
    setCategory(currentCategory);
    setBrand(currentBrand);
    setOpen(true);
  };

  // Lock page scroll + close on Escape while the sheet is open
  React.useEffect(() => {
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

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (brand) params.set("brand", brand);
    if (currentSearch) params.set("q", currentSearch);
    if (currentSort) params.set("sort", currentSort);
    const qs = params.toString();
    router.push(qs ? `/shop?${qs}` : "/shop");
    setOpen(false);
  };

  const clearAll = () => {
    setCategory("");
    setBrand("");
  };

  const chipClass = (selected: boolean) =>
    `inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-semibold transition cursor-pointer ${
      selected
        ? "bg-red-50 border-[#D71920] text-[#D71920]"
        : "bg-white border-gray-200 text-gray-700 active:bg-gray-100"
    }`;

  return (
    <>
      {/* Trigger button (mobile / tablet only) */}
      <button
        type="button"
        onClick={openSheet}
        className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gray-900 text-white text-xs font-bold cursor-pointer active:scale-95 transition"
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
        <span>Filters</span>
        {activeCount > 0 && (
          <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#D71920] text-white text-[10px] leading-[18px] text-center">
            {activeCount}
          </span>
        )}
      </button>

      {/* Bottom sheet */}
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

        {/* Sheet */}
        <div
          className={`absolute inset-x-0 bottom-0 max-h-[85vh] flex flex-col bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out ${
            open ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {/* Drag handle */}
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

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
            <section>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-3">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const selected = category === cat.slug;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(selected ? "" : cat.slug)}
                      className={chipClass(selected)}
                    >
                      {selected && <Check className="w-3.5 h-3.5" />}
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-3">
                Brands
              </h3>
              <div className="flex flex-wrap gap-2">
                {brands.map((b) => {
                  const selected = brand === b.slug;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBrand(selected ? "" : b.slug)}
                      className={chipClass(selected)}
                    >
                      {selected && <Check className="w-3.5 h-3.5" />}
                      {b.name}
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Sticky footer */}
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