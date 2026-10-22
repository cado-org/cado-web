"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Category } from "@/types/database";

interface CategorySectionProps {
  categories?: Category[];
}

export function CategorySection({ categories = [] }: CategorySectionProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  // Mobile: Chunk categories into groups of 3 for 3-in-a-row swipeable slides
  const mobileChunks: Category[][] = [];
  const chunkSize = 3;
  for (let i = 0; i < categories.length; i += chunkSize) {
    mobileChunks.push(categories.slice(i, i + chunkSize));
  }

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Auto sliding: advances until the user touches/interacts with the mobile screen
  useEffect(() => {
    if (!autoPlay || mobileChunks.length <= 1) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => {
        const next = (prev + 1) % mobileChunks.length;
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            left: next * scrollRef.current.clientWidth,
            behavior: "smooth",
          });
        }
        return next;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [autoPlay, mobileChunks.length]);

  // When user touches the carousel on mobile, stop auto-moving permanently
  const handleTouchStart = () => {
    setAutoPlay(false);
  };

  // Sync pagination dots dynamically with swipe position
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const width = scrollRef.current.clientWidth;
    if (width > 0) {
      const pageIndex = Math.round(scrollLeft / width);
      setActiveSlide(pageIndex);
    }
  };

  const scrollToSlide = (idx: number) => {
    setAutoPlay(false);
    setActiveSlide(idx);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: idx * scrollRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#191919] tracking-tight">
            Shop by Category
          </h2>
          <Link
            href="/shop"
            className="inline-flex items-center text-xs sm:text-sm font-bold text-[#D71920] hover:text-[#B5121B] transition group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 1. MOBILE VIEW: 3 IN ONE ROW WITH TOUCH SWIPE & STOP AUTO-MOVING ON TOUCH */}
        <div className="md:hidden select-none">
          {/* Scroll Snap Touch-Swipe Track */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            onTouchStart={handleTouchStart}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth touch-pan-x"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {mobileChunks.map((chunk, slideIdx) => (
              <div
                key={slideIdx}
                className="w-full shrink-0 snap-center grid grid-cols-3 gap-2 px-0.5"
              >
                {chunk.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className="group flex flex-col justify-between bg-white border border-gray-200 rounded-xl p-2 text-center hover:border-gray-300 transition active:scale-95"
                  >
                    {/* Full uncropped image inside card */}
                    <div className="relative w-full aspect-square bg-[#F8FAFC] rounded-lg overflow-hidden flex items-center justify-center p-1">
                      {cat.image_url ? (
                        <Image
                          src={cat.image_url}
                          alt={cat.name}
                          fill
                          className="object-contain p-1"
                        />
                      ) : (
                        <div className="text-[10px] font-bold text-gray-400">
                          CADO
                        </div>
                      )}
                    </div>
                    <h3 className="mt-2 text-[11px] font-bold text-gray-900 group-hover:text-[#D71920] transition line-clamp-2 leading-tight">
                      {cat.name}
                    </h3>
                  </Link>
                ))}
              </div>
            ))}
          </div>

          {/* Bottom Pagination Dots for Mobile */}
          {mobileChunks.length > 1 && (
            <div className="flex items-center justify-center space-x-1.5 mt-4">
              {mobileChunks.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => scrollToSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeSlide === idx ? "w-5 bg-[#D71920]" : "w-1.5 bg-gray-300"
                  }`}
                  aria-label={`Go to category slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* 2. DESKTOP VIEW: EXACT FIRST DESIGN - ONLY 6 CATEGORIES, NO ALL CATEGORIES CARD */}
        <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
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
        </div>
      </div>
    </section>
  );
}
