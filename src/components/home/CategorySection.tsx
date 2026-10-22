import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight, LayoutGrid } from "lucide-react";
import { Category } from "@/types/database";

interface CategorySectionProps {
  categories?: Category[];
}

export function CategorySection({ categories = [] }: CategorySectionProps) {
  // If categories are empty, don't crash
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-[#191919] tracking-tight">
            Shop by Category
          </h2>
          <Link
            href="/shop"
            className="inline-flex items-center text-xs sm:text-sm font-bold text-[#D71920] hover:text-[#B5121B] transition group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Category Cards Carousel / Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.slice(0, 6).map((cat, idx) => {
            const isFirst = idx === 0;

            return (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className={`group flex flex-col justify-between p-3.5 rounded-lg border transition-all duration-200 bg-white hover:shadow-md ${
                  isFirst
                    ? "border-[#D71920] ring-1 ring-[#D71920]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* Image Container */}
                <div className="relative w-full aspect-square bg-[#F5F5F5] rounded-md overflow-hidden p-2 flex items-center justify-center">
                  {cat.image_url ? (
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="text-xs font-bold text-gray-400">CADO</div>
                  )}
                </div>

                {/* Name & Arrow */}
                <div className="mt-3 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-900 group-hover:text-[#D71920] transition line-clamp-2 leading-tight">
                    {cat.name}
                  </h3>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ml-1 ${
                      isFirst
                        ? "bg-[#D71920] text-white"
                        : "bg-gray-100 text-gray-500 group-hover:bg-red-50 group-hover:text-[#D71920]"
                    }`}
                  >
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            );
          })}

          {/* 7th Card: All Categories Button Card */}
          <Link
            href="/shop"
            className="group flex flex-col items-center justify-center p-4 rounded-lg border border-dashed border-gray-300 hover:border-[#D71920] hover:bg-red-50/30 transition text-center"
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-[#D71920] group-hover:text-white text-gray-600 flex items-center justify-center transition-colors mb-3">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-900 group-hover:text-[#D71920] leading-tight">
              All Categories
            </span>
            <span className="text-[10px] text-gray-400 mt-1">Explore all</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
