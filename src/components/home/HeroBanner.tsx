"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageSquare, ArrowRight } from "lucide-react";
import { HeroBanner as HeroBannerType } from "@/types/database";
import { useEnquiry } from "@/lib/context/EnquiryContext";

interface HeroBannerProps {
  banner?: HeroBannerType | null;
}

export function HeroBanner({ banner }: HeroBannerProps) {
  const { openEnquiryModal } = useEnquiry();

  const eyebrow = banner?.eyebrow || "BUILD BETTER WITH CADO";
  const title = banner?.title || "Premium Tile Adhesives for Stronger Spaces";
  const description =
    banner?.description ||
    "High-performance CADO tile adhesives designed for floor and wall applications. Reliable quality for homes, commercial and industrial projects.";
  const primaryCtaLabel = banner?.primary_cta_label || "Shop CADO Products";
  const primaryCtaUrl = banner?.primary_cta_url || "/shop?brand=cado";

  return (
    <section className="relative bg-[#1A1A1A] text-white overflow-hidden min-h-[520px] lg:min-h-[580px] flex items-center">
      {/* Background Graphic Pattern */}
      <div className="absolute inset-0 z-0 opacity-25">
        <Image
          src="/images/hero/hero-tile-installation.svg"
          alt="CADO Tile Installation"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/40 z-1" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-block">
              <span className="text-[#D71920] font-black text-xs sm:text-sm tracking-widest uppercase bg-white/10 px-3 py-1 rounded">
                {eyebrow}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              {title}
            </h1>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl">
              {description}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={primaryCtaUrl}
                className="inline-flex items-center justify-center px-6 py-3.5 bg-[#D71920] hover:bg-[#B5121B] text-white text-sm font-bold rounded-md shadow-lg transition-transform active:scale-95 space-x-2"
              >
                <span>{primaryCtaLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => openEnquiryModal(null)}
                className="inline-flex items-center justify-center px-6 py-3.5 bg-white hover:bg-gray-100 text-[#191919] text-sm font-bold rounded-md shadow-lg transition space-x-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#25D366]" />
                <span>Enquire on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Right Product Showcase (CADO 777 & 666 Packaging) */}
          <div className="lg:col-span-5 relative flex items-center justify-center pt-6 lg:pt-0">
            {/* Script Slogan in the top right */}
            <div className="absolute -top-6 right-2 z-20 text-right hidden sm:block">
              <p
                className="text-white/90 text-2xl font-bold italic tracking-wide"
                style={{ fontFamily: "'Brush Script MT', cursive, sans-serif" }}
              >
                Strong Bonds <br />
                <span className="text-white/80">Lasting Spaces</span>
              </p>
            </div>

            {/* Packaging Bags Composition */}
            <div className="relative flex items-end justify-center space-x-2 sm:space-x-4">
              {/* Green 777 Bag */}
              <div className="w-40 sm:w-48 lg:w-52 h-64 sm:h-76 relative transition-transform hover:scale-105 duration-200">
                <Image
                  src="/images/products/cado-777.svg"
                  alt="CADO Tile Adhesive 777"
                  fill
                  priority
                  className="object-contain drop-shadow-2xl"
                />
              </div>

              {/* Red 666 Bag */}
              <div className="w-40 sm:w-48 lg:w-52 h-64 sm:h-76 relative -ml-6 sm:-ml-8 transition-transform hover:scale-105 duration-200">
                <Image
                  src="/images/products/cado-666.svg"
                  alt="CADO Tile Adhesive 666"
                  fill
                  priority
                  className="object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
