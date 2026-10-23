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
        <div className="relative w-full aspect-square  rounded-lg overflow-hidden p-3 flex items-center justify-center">
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
            <span className="hidden sm:inline-block absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 max-w-[80%] truncate bg-white/95 text-[9px] sm:text-[10px] font-bold text-gray-700 px-1.5 sm:px-2 py-0.5 rounded border border-gray-200 shadow-xs">
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
            <p className="hidden sm:block text-[10px] sm:text-[11px] font-mono text-gray-400 mt-0.5 truncate">
              Code: {product.sku}
            </p>
          )}
        </div>

        {/* Technical Highlights / Bullets (hidden on mobile, shown on desktop) */}
        {specs.length > 0 && (
          <div className="hidden sm:block mt-2 sm:mt-2.5 space-y-1">
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

export { MobileFilters } from "./ShopControls";