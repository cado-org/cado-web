"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Truck,
  Headphones,
  PackageCheck,
} from "lucide-react";
import { HeroBanner as HeroBannerType } from "@/types/database";
import { useEnquiry } from "@/lib/context/EnquiryContext";

interface HeroBannerProps {
  banner?: HeroBannerType | null;
  banners?: HeroBannerType[];
}

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: "Trusted Quality",
    subtitle: "Reliable products",
  },
  {
    icon: Truck,
    title: "Bulk Supply",
    subtitle: "Best pricing",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    subtitle: "Instant quotes via WhatsApp",
  },
  {
    icon: PackageCheck,
    title: "Pan India Supply",
    subtitle: "For industrial & real estate",
  },
];

export function HeroBanner({ banner, banners = [] }: HeroBannerProps) {
  const { openEnquiryModal } = useEnquiry();

  // Combine banner props into an array
  const bannerList: HeroBannerType[] =
    banners && banners.length > 0
      ? banners
      : banner
      ? [banner]
      : [
          {
            id: "default-banner",
            title: "Premium Tile Adhesives for Stronger Spaces",
            eyebrow: "BUILD BETTER WITH CADO",
            description:
              "High performance CADO tile adhesives designed for floor and wall applications. Reliable quality for homes, commercial and industrial projects.",
            primary_cta_label: "Shop CADO Products",
            primary_cta_url: "/shop?brand=cado",
            desktop_image_url: "/images/hero/hero-tile-installation.svg",
            mobile_image_url: "/images/hero/hero-tile-installation.svg",
            is_active: true,
            display_order: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } as unknown as HeroBannerType,
        ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance banner slides every 5 seconds if more than 1 banner
  useEffect(() => {
    if (bannerList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [bannerList.length]);

  const activeBanner = bannerList[currentIndex] || bannerList[0];

  const eyebrow = activeBanner?.eyebrow || "BUILD BETTER WITH CADO";
  const title =
    activeBanner?.title || "Premium Tile Adhesives for Stronger Spaces";
  const description =
    activeBanner?.description ||
    "High performance CADO tile adhesives designed for floor and wall applications. Reliable quality for homes, commercial and industrial projects.";
  const primaryCtaLabel =
    activeBanner?.primary_cta_label || "Shop CADO Products";
  const primaryCtaUrl =
    activeBanner?.primary_cta_url || "/shop?brand=cado";

  const desktopImage =
    activeBanner?.desktop_image_url ||
    (activeBanner as any)?.image_url ||
    "/images/hero/hero-tile-installation.svg";
  const mobileImage = activeBanner?.mobile_image_url || desktopImage;

  return (
    <section className="relative w-full aspect-[9/16] sm:aspect-[4/3] md:aspect-[16/9] min-h-[520px] md:min-h-[580px] max-h-[85vh] bg-[#F5F5F7] overflow-hidden flex flex-col justify-end">
      {/* Background Banner Image (Clean - NO dark/black fade overlay) */}
      <div className="absolute inset-0 z-0">
        {/* Desktop 16:9 Banner */}
        <div className="relative w-full h-full hidden md:block">
          <Image
            src={desktopImage}
            alt={title}
            fill
            priority
            unoptimized
            className="object-cover object-center transition-opacity duration-500"
          />
        </div>

        {/* Mobile 9:16 Banner */}
        <div className="relative w-full h-full block md:hidden">
          <Image
            src={mobileImage}
            alt={title}
            fill
            priority
            unoptimized
            className="object-cover object-center transition-opacity duration-500"
          />
        </div>
      </div>

      {/* Content Container (Mobile: Bottom Left, Desktop: Content center + Trust Indicators at bottom) */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-4 md:pt-14 pb-6 md:pb-6 w-full flex flex-col justify-end md:justify-between h-full pointer-events-none">
        <div className="max-w-xl lg:max-w-2xl space-y-3 md:space-y-5 text-left pointer-events-auto mt-auto md:mt-0 md:my-auto">
          {/* Eyebrow */}
          <div>
            <span className="text-[#D71920] font-black text-xs sm:text-sm tracking-widest uppercase">
              {eyebrow}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-[#191919] leading-tight tracking-tight drop-shadow-xs">
            {title}
          </h1>

          {/* Description */}
          <p className="text-gray-700 text-xs sm:text-base leading-relaxed max-w-xl font-normal drop-shadow-xs line-clamp-3 md:line-clamp-none">
            {description}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 md:gap-4 pt-1">
            <Link
              href={primaryCtaUrl}
              className="inline-flex items-center justify-center px-5 py-2.5 md:px-6 md:py-3.5 bg-[#D71920] hover:bg-[#B5121B] text-white text-xs sm:text-sm font-bold rounded-md shadow-md transition-transform active:scale-95 space-x-2"
            >
              <span>{primaryCtaLabel}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <button
              type="button"
              onClick={() => openEnquiryModal(null)}
              className="inline-flex items-center justify-center px-5 py-2.5 md:px-6 md:py-3.5 bg-white hover:bg-gray-50 border border-gray-300 text-[#191919] text-xs sm:text-sm font-bold rounded-md shadow-sm transition space-x-2 cursor-pointer active:scale-95"
            >
              <MessageSquare className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
              <span>Enquire on WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Desktop Bottom Strip: 4 Trust Indicators (Left to Center) + Slide Dots (Right) */}
        {/* Hidden on mobile screen as requested */}
        <div className="hidden md:flex items-center justify-between pt-6 mt-8 border-t border-black/10 w-full pointer-events-auto">
          {/* Trust Indicators: Left to Center */}
          <div className="flex items-center flex-wrap gap-4 lg:gap-8">
            {TRUST_ITEMS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-full bg-red-50 text-[#D71920] flex items-center justify-center shrink-0 border border-red-100">
                    <Icon className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#191919] leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 font-medium leading-tight mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                  {idx < TRUST_ITEMS.length - 1 && (
                    <span className="h-5 w-px bg-gray-300 ml-4 hidden xl:block" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Slide Dots on the Right */}
          {bannerList.length > 1 && (
            <div className="flex items-center space-x-2 shrink-0 ml-4">
              {bannerList.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setCurrentIndex(dotIdx)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === dotIdx
                      ? "w-7 bg-[#D71920]"
                      : "w-2.5 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Slide ${dotIdx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
