"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Category } from "@/types/database";

interface PopularCategoriesProps {
  categories?: Category[];
}

export function PopularCategories({ categories = [] }: PopularCategoriesProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  // Mobile: Chunk categories into groups of 3
  const mobileChunks: Category[][] = [];
  const chunkSize = 3;
  for (let i = 0; i < categories.length; i += chunkSize) {
    mobileChunks.push(categories.slice(i, i + chunkSize));
  }

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Auto sliding: advances until user touches the screen
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
    }, 3800);

    return () => clearInterval(interval);
  }, [autoPlay, mobileChunks.length]);

  // When user touches the carousel, stop auto-play permanently
  const handleTouchStart = () => {
    setAutoPlay(false);
  };

  // Sync dots dynamically with scroll position
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
    <section className="py-10 md:py-14 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 md:mb-8 gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#191919] tracking-tight">
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

        {/* 1. MOBILE VIEW: 3 IN ONE ROW WITH TOUCH SWIPE & STOP AUTO-MOVING ON TOUCH */}
        <div className="md:hidden select-none">
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
                    href={`/shop/${cat.slug}`}
                    className="group bg-white rounded-xl p-2 flex flex-col justify-between text-center hover:border-gray-300 transition active:scale-95"
                  >
                    {/* Full uncropped image container */}
                    <div className="relative w-full aspect-square  rounded-lg overflow-hidden flex items-center justify-center p-1">
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
                    <h3 className="mt-2 text-[11px] font-bold text-gray-900 group-hover:text-[#D71920] transition line-clamp-1">
                      {cat.name}
                    </h3>
                  </Link>
                ))}
              </div>
            ))}
          </div>

          {/* Bottom Dots for Mobile */}
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
                  aria-label={`Go to popular category slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* 2. DESKTOP VIEW: ONLY 6 CATEGORY CARDS (MORE CATEGORIES CARD REMOVED) */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat.id}
              href={`/shop/${cat.slug}`}
              className="group rounded-lg p-3 flex flex-col items-center text-center hover:border-gray-300 hover:shadow-md transition"
            >
              <div className="relative w-full aspect-4/3 bg-white rounded-md overflow-hidden mb-3 p-2 flex items-center justify-center ">
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
        </div>
      </div>
    </section>
  );
}
