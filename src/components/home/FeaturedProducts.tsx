"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageSquare, Check } from "lucide-react";
import { Product } from "@/types/database";
import { useEnquiry } from "@/lib/context/EnquiryContext";

interface FeaturedProductsProps {
  products?: Product[];
}

export function FeaturedProducts({ products = [] }: FeaturedProductsProps) {
  const { openEnquiryModal } = useEnquiry();

  // Exactly 2 featured products as requested
  const displayProducts = (products && products.length > 0)
    ? products.slice(0, 2)
    : [];

  if (displayProducts.length === 0) {
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
            href="/brands/cado"
            className="inline-flex items-center text-xs sm:text-sm font-bold text-[#D71920] hover:text-[#B5121B] transition group"
          >
            <span>View All CADO Products</span>
            <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 2-Card Grid: Left Image, Right Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {displayProducts.map((product) => {
            const specs = product.specifications && product.specifications.length > 0
              ? product.specifications.slice(0, 4)
              : [
                  { label: "Strength", value: "High bonding strength" },
                  { label: "Application", value: "For floor & wall applications" },
                  { label: "Variants", value: "Grey / White options" },
                  { label: "Origin", value: "Made in India" },
                ];

            return (
              <div
                key={product.id}
                className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center sm:items-stretch gap-6 hover:shadow-lg transition-shadow duration-200"
              >
                {/* Left: Product Image */}
                <div className="relative w-44 sm:w-48 h-56 sm:h-64 shrink-0  rounded-xl overflow-hidden p-3 flex items-center justify-center">
                  {product.main_image_url ? (
                    <Image
                      src={product.main_image_url}
                      alt={product.name}
                      fill
                      className="object-contain p-2 hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="text-gray-400 font-bold text-sm">CADO</div>
                  )}
                </div>

                {/* Right: Content */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <Link
                      href={`/products/${product.slug}`}
                      className="hover:text-[#D71920] transition"
                    >
                      <h3 className="font-extrabold text-base sm:text-lg text-gray-900 leading-snug">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Weight / Packaging */}
                    <p className="text-xs font-semibold text-gray-500 mt-1">
                      {product.packaging_details || "20 kg"}
                    </p>

                    {/* Feature Checklist with Red Checkmark Badge */}
                    <div className="mt-4 space-y-2">
                      {specs.map((spec, i) => (
                        <div
                          key={i}
                          className="flex items-center text-xs sm:text-[13px] text-gray-700 font-medium"
                        >
                          <span className="w-4 h-4 rounded-full bg-[#D71920] text-white flex items-center justify-center shrink-0 mr-2.5">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                          <span>{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons: View Details + WhatsApp */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2.5">
                    <Link
                      href={`/products/${product.slug}`}
                      className="py-2.5 px-4 border border-[#D71920] text-[#D71920] hover:bg-red-50 text-xs font-bold rounded-lg text-center transition"
                    >
                      View Details
                    </Link>

                    <button
                      type="button"
                      onClick={() => openEnquiryModal(product)}
                      className="py-2.5 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition shadow-xs cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Enquire on WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
