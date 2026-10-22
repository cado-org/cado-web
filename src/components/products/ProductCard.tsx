"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageSquare, Plus, Check } from "lucide-react";
import { Product } from "@/types/database";
import { useEnquiry } from "@/lib/context/EnquiryContext";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { openEnquiryModal, addToCart } = useEnquiry();
  const [added, setAdded] = React.useState(false);

  const handleAddToCart = () => {
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const specs = product.specifications || [];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-md hover:border-gray-300 transition-all duration-200 group">
      <div>
        {/* Product Image */}
        <div className="relative w-full aspect-square bg-[#F8FAFC] rounded-lg overflow-hidden p-3 flex items-center justify-center">
          {product.main_image_url ? (
            <Image
              src={product.main_image_url}
              alt={product.name}
              fill
              className="object-contain p-2 group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="text-gray-400 font-bold text-xs">CADO</div>
          )}

          {product.packaging_details && (
            <span className="absolute top-2.5 right-2.5 bg-white/95 text-[10px] font-bold text-gray-700 px-2 py-0.5 rounded border border-gray-200 shadow-xs">
              {product.packaging_details}
            </span>
          )}

          {product.brand && (
            <span className="absolute bottom-2.5 left-2.5 bg-gray-900/80 text-[10px] font-bold text-white px-2 py-0.5 rounded">
              {product.brand.name}
            </span>
          )}
        </div>

        {/* Title & SKU */}
        <div className="mt-3.5">
          <Link
            href={`/products/${product.slug}`}
            className="hover:text-[#D71920] transition"
          >
            <h3 className="font-bold text-sm text-gray-900 line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
          {product.sku && (
            <p className="text-[11px] font-mono text-gray-400 mt-0.5">
              Code: {product.sku}
            </p>
          )}
        </div>

        {/* Technical Highlights / Bullets */}
        {specs.length > 0 && (
          <div className="mt-2.5 space-y-1">
            {specs.slice(0, 3).map((spec, i) => (
              <div
                key={i}
                className="flex items-start text-[11px] text-gray-600 leading-tight"
              >
                <span className="w-1 h-1 rounded-full bg-[#D71920] shrink-0 mt-1.5 mr-1.5" />
                <span className="line-clamp-1">{spec.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buttons: View Details & Enquire on WhatsApp */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
        <Link
          href={`/products/${product.slug}`}
          className="flex-1 py-2 px-2.5 border border-gray-300 hover:border-gray-400 text-gray-800 text-xs font-bold rounded-lg text-center transition"
        >
          View Details
        </Link>

        <button
          type="button"
          onClick={() => openEnquiryModal(product)}
          className="flex-1 py-2 px-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition shadow-xs cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Enquire</span>
        </button>

        <button
          type="button"
          onClick={handleAddToCart}
          className={`p-2 border rounded-lg transition ${
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
