import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Layers } from "lucide-react";
import { Category } from "@/types/database";

interface PopularCategoriesProps {
  categories?: Category[];
}

export function PopularCategories({ categories = [] }: PopularCategoriesProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#191919] tracking-tight">
              Popular Categories
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Everything you need for construction, renovation and interiors.
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center text-xs sm:text-sm font-bold text-[#D71920] hover:text-[#B5121B] transition group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 6 Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.slice(0, 5).map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group bg-[#F8FAFC] border border-gray-200 rounded-lg p-3 flex flex-col items-center text-center hover:border-gray-300 hover:shadow-md transition"
            >
              <div className="relative w-full aspect-4/3 bg-white rounded-md overflow-hidden mb-3 p-2 flex items-center justify-center border border-gray-100">
                {cat.image_url ? (
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    fill
                    className="object-contain p-1 group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="text-xs font-bold text-gray-400">CADO</div>
                )}
              </div>
              <h3 className="text-xs font-bold text-gray-900 group-hover:text-[#D71920] transition line-clamp-1">
                {cat.name}
              </h3>
            </Link>
          ))}

          {/* 6th Card: More Categories */}
          <Link
            href="/shop"
            className="group bg-[#F8FAFC] border border-dashed border-gray-300 rounded-lg p-3 flex flex-col items-center justify-center text-center hover:border-[#D71920] hover:bg-red-50/20 transition"
          >
            <div className="w-12 h-12 rounded-full bg-white border border-gray-200 group-hover:bg-[#D71920] group-hover:text-white text-gray-600 flex items-center justify-center transition-colors mb-2">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-gray-900 group-hover:text-[#D71920]">
              More Categories
            </h3>
            <span className="text-[10px] text-gray-400 mt-0.5">Explore catalog</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
