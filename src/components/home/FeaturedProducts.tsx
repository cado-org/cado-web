"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageSquare, Plus } from "lucide-react";
import { Product } from "@/types/database";
import { useEnquiry } from "@/lib/context/EnquiryContext";

interface FeaturedProductsProps {
  products?: Product[];
}

export function FeaturedProducts({ products = [] }: FeaturedProductsProps) {
  const { openEnquiryModal, addToCart } = useEnquiry();

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#191919] tracking-tight">
              Featured CADO Products
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Our own brand construction chemicals for professional and home use.
            </p>
          </div>
          <Link
            href="/shop?brand=cado"
            className="inline-flex items-center text-xs sm:text-sm font-bold text-[#D71920] hover:text-[#B5121B] transition group"
          >
            <span>View All CADO Products</span>
            <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const specs = product.specifications || [];

            return (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col justify-between hover:shadow-lg transition-shadow duration-200 group"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative w-full h-56 bg-[#F8FAFC] rounded-lg overflow-hidden p-4 flex items-center justify-center">
                    {product.main_image_url ? (
                      <Image
                        src={product.main_image_url}
                        alt={product.name}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="text-gray-400 font-bold text-sm">CADO</div>
                    )}

                    {product.packaging_details && (
                      <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-[10px] font-bold text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                        {product.packaging_details}
                      </span>
                    )}
                  </div>

                  {/* Title & SKU */}
                  <div className="mt-4">
                    <Link
                      href={`/products/${product.slug}`}
                      className="hover:text-[#D71920] transition"
                    >
                      <h3 className="font-bold text-base text-gray-900 leading-snug">
                        {product.name}
                      </h3>
                    </Link>
                    {product.sku && (
                      <p className="text-[11px] font-mono text-gray-400 mt-0.5">
                        SKU: {product.sku}
                      </p>
                    )}
                  </div>

                  {/* Feature Bullets */}
                  <div className="mt-3 space-y-1.5">
                    {specs.slice(0, 4).map((spec, i) => (
                      <div
                        key={i}
                        className="flex items-start text-xs text-gray-600 leading-tight"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D71920] shrink-0 mt-1 mr-2" />
                        <span>{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions: View Details + Enquire on WhatsApp */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2">
                  <Link
                    href={`/products/${product.slug}`}
                    className="flex-1 py-2.5 px-3 border border-gray-300 hover:border-gray-400 text-gray-800 text-xs font-bold rounded-lg text-center transition"
                  >
                    View Details
                  </Link>

                  <button
                    type="button"
                    onClick={() => openEnquiryModal(product)}
                    className="flex-1 py-2.5 px-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition shadow-xs cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Enquire</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => addToCart(product, 1)}
                    className="p-2.5 border border-gray-300 hover:border-[#D71920] hover:text-[#D71920] text-gray-600 rounded-lg transition"
                    title="Add to multi-item enquiry list"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
