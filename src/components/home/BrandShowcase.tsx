"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, FileText, Headphones, Target } from "lucide-react";
import { useEnquiry } from "@/lib/context/EnquiryContext";
import { HomepageSection } from "@/types/database";

interface BrandShowcaseProps {
  section?: HomepageSection | null;
}

export function BrandShowcase({ section }: BrandShowcaseProps) {
  const { openEnquiryModal } = useEnquiry();

  const content = (section?.content as any) || {};
  let eyebrow = content.eyebrow || "Our Own Brand";
  let mainTitle = "CADO";

  const rawHeading = content.heading ? String(content.heading).trim() : "Our Own Brand\nCADO";
  if (rawHeading.includes("\n")) {
    const parts = rawHeading.split("\n");
    eyebrow = parts[0]?.trim() || eyebrow;
    mainTitle = parts[1]?.trim() || mainTitle;
  } else if (/cado/i.test(rawHeading)) {
    const match = rawHeading.match(/^(.*?)(CADO.*)$/i);
    if (match && match[1]?.trim()) {
      eyebrow = match[1].trim();
      mainTitle = match[2].trim();
    } else {
      mainTitle = rawHeading;
    }
  } else if (content.heading) {
    mainTitle = content.heading;
  }

  const subheading =
    content.subheading ||
    "High performance adhesives, epoxy and grout solutions for modern construction.";
  const ctaLabel = content.cta_label || "Explore CADO Range";
  const ctaUrl = content.cta_url || "/brands/cado";

  const quoteTitle = content.quote_card_title || "Need Large Quantity?";
  const quoteDesc =
    content.quote_card_description ||
    "We supply to dealers, contractors and businesses across Kerala and beyond.";
  const quoteFeatures = content.quote_features || [
    "Best Pricing for Bulk Orders",
    "Dedicated Support",
    "Quick Response on WhatsApp",
  ];
  const quoteCtaLabel =
    content.quote_cta_label && content.quote_cta_label !== "GET A QUOTE ON WHATSAPP"
      ? content.quote_cta_label
      : "Get a Quote on WhatsApp";

  return (
    <section className="py-8 sm:py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Single, unified horizontal section with zero gap and square corners */}
        <div className="flex flex-col lg:flex-row items-stretch w-full rounded-none overflow-hidden border border-gray-200/90 shadow-none">
          {/* Left Split (approx 70% width): CADO Brand Banner */}
          <div className="relative w-full lg:w-[69%] xl:w-[70%] aspect-[16/9] sm:aspect-auto min-h-[200px] sm:min-h-[360px] lg:min-h-[420px] flex flex-col justify-center p-4 sm:p-10 lg:p-12 xl:p-14 overflow-hidden rounded-none bg-[#1d1e20]">
            {/* Background Graphic: CADO-Tile.png with product bags on right */}
            <div className="absolute inset-0 pointer-events-none">
              <Image
                src="/CADO-Tile.png"
                alt="CADO Tile Adhesives"
                fill
                priority
                className="object-cover object-right"
              />
              {/* White fade on the left so text is crystal clear on mobile and desktop */}
              <div className="hidden sm:block absolute inset-y-0 left-0 w-[65%] z-[1] bg-gradient-to-r from-white via-white/80 to-transparent" />
              <div className="sm:hidden absolute inset-0 z-[1] bg-gradient-to-r from-white/95 via-white/75 to-transparent" />
            </div>

            {/* Left Content Overlay */}
            <div className="relative z-10 max-w-[65%] sm:max-w-sm md:max-w-md space-y-2 sm:space-y-3.5 my-auto">
              <p className="text-[10px] sm:text-xs font-black tracking-widest uppercase text-[#D71920]">
                {eyebrow}
              </p>
              <h2 className="text-xl sm:text-4xl lg:text-5xl font-black text-[#191919] tracking-tight leading-none">
                {mainTitle}
              </h2>
              <p className="text-[11px] sm:text-sm text-gray-700 font-medium leading-tight sm:leading-relaxed text-balance line-clamp-2 sm:line-clamp-none">
                {subheading}
              </p>

              <div className="pt-1 sm:pt-2">
                <Link
                  href={ctaUrl}
                  className="inline-flex items-center px-3.5 py-1.5 sm:px-6 sm:py-3 bg-[#D71920] hover:bg-[#B5121B] text-white text-[11px] sm:text-sm font-bold rounded-md shadow-sm transition-transform active:scale-95 space-x-1.5 sm:space-x-2"
                >
                  <span>{ctaLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5 sm:ml-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Split (approx 30% width): Bulk Enquiry Panel */}
          <div className="w-full lg:w-[31%] xl:w-[30%] bg-[#F7F5F0] p-6 sm:p-8 lg:p-6 xl:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-200/90 rounded-none">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#191919] leading-tight tracking-tight">
                  {quoteTitle}
                </h3>
                <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                  {quoteDesc}
                </p>
              </div>

              {/* 3 Benefits with small red outlined circular icons */}
              <div className="space-y-3 pt-1">
                {quoteFeatures.map((feat: string, i: number) => {
                  let Icon = FileText;
                  if (i === 1 || feat.toLowerCase().includes("support")) {
                    Icon = Headphones;
                  } else if (
                    i === 2 ||
                    feat.toLowerCase().includes("whatsapp") ||
                    feat.toLowerCase().includes("response")
                  ) {
                    Icon = Target;
                  }

                  let title = feat;
                  let subtitle: string | null = null;
                  if (feat.includes(" for ")) {
                    const parts = feat.split(" for ");
                    title = parts[0];
                    subtitle = `for ${parts[1]}`;
                  } else if (feat.includes(" on ")) {
                    const parts = feat.split(" on ");
                    title = parts[0];
                    subtitle = `on ${parts[1]}`;
                  }

                  return (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="w-7 h-7 rounded-full border border-[#D71920] text-[#D71920] flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5 stroke-[2]" />
                      </div>
                      <div className="leading-tight">
                        <span className="text-xs font-bold text-[#191919] block">
                          {title}
                        </span>
                        {subtitle && (
                          <span className="text-[11px] text-gray-500 font-medium block mt-0.5">
                            {subtitle}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Quote Button */}
            <div className="pt-6">
              <button
                type="button"
                onClick={() => openEnquiryModal(null)}
                className="w-full py-3 px-4 bg-[#D71920] hover:bg-[#B5121B] text-white text-xs sm:text-sm font-bold rounded-md shadow-sm flex items-center justify-center space-x-2 transition cursor-pointer active:scale-[0.99]"
              >
                {/* WhatsApp Icon */}
                <svg
                  className="w-4 h-4 fill-current shrink-0"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.966.527 1.761.781 2.802.781 3.182 0 5.768-2.587 5.769-5.767.001-3.182-2.583-5.767-5.775-5.775zm7.558 5.766c-.002 4.162-3.388 7.547-7.551 7.547-1.328 0-2.583-.346-3.676-.954l-4.089 1.072 1.092-3.991c-.672-1.141-1.028-2.45-1.03-3.674.002-4.162 3.388-7.548 7.552-7.548 4.164 0 7.502 3.386 7.502 7.548z" />
                </svg>
                <span>{quoteCtaLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
