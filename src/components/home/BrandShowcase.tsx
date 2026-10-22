"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, MessageSquare } from "lucide-react";
import { useEnquiry } from "@/lib/context/EnquiryContext";
import { HomepageSection } from "@/types/database";

interface BrandShowcaseProps {
  section?: HomepageSection | null;
}

export function BrandShowcase({ section }: BrandShowcaseProps) {
  const { openEnquiryModal } = useEnquiry();

  const content = (section?.content as any) || {};
  const heading = content.heading || "Our Own Brand\nCADO";
  const subheading =
    content.subheading ||
    "High-performance adhesives, epoxy and grout solutions for modern construction.";
  const ctaLabel = content.cta_label || "Explore CADO Range";
  const ctaUrl = content.cta_url || "/shop?brand=cado";

  const quoteTitle = content.quote_card_title || "Need Large Quantity?";
  const quoteDesc =
    content.quote_card_description ||
    "We supply to dealers, contractors and businesses across Kerala and beyond.";
  const quoteFeatures = content.quote_features || [
    "Best Pricing for Bulk Orders",
    "Dedicated Support",
    "Quick Response on WhatsApp",
  ];
  const quoteCtaLabel = content.quote_cta_label || "GET A QUOTE ON WHATSAPP";

  return (
    <section className="py-10 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Split: CADO Brand Editorial Banner with CADO-Tile.png Background */}
          <div className="lg:col-span-8  rounded-xl p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between shadow-md min-h-[340px] border border-gray-200">
            {/* Background Graphic: CADO-Tile.png */}
            <div className="absolute inset-0 pointer-events-none">
              <Image
                src="/CADO-Tile.png"
                alt="CADO Tile Adhesives"
                fill
                priority
                className="object-cover object-right md:object-center"
              />
              {/* Soft left gradient so text is razor-sharp while products on right stay fully visible */}
              <div className="absolute inset-0 " />
            </div>

            <div className="relative z-10 max-w-sm sm:max-w-md space-y-4 my-auto">
              <p className="text-xs font-black uppercase tracking-widest text-[#D71920]">
                Our Own Brand
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#191919] tracking-tight leading-tight">
                CADO
              </h2>
              <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
                {subheading}
              </p>

              <div className="pt-2">
                <Link
                  href={ctaUrl}
                  className="inline-flex items-center px-6 py-3 bg-[#D71920] hover:bg-[#B5121B] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-md transition-transform active:scale-95 space-x-2"
                >
                  <span>{ctaLabel}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Split: Bulk Quantity Support Card */}
          <div className="lg:col-span-4 bg-white rounded-xl p-8 border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-black text-[#191919] leading-tight">
                {quoteTitle}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {quoteDesc}
              </p>

              <div className="space-y-3 pt-2">
                {quoteFeatures.map((feat: string, i: number) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-5 h-5 rounded-full bg-red-100 text-[#D71920] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-gray-800">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => openEnquiryModal(null)}
                className="w-full py-3 px-4 bg-[#D71920] hover:bg-[#B5121B] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow flex items-center justify-center space-x-2 transition cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{quoteCtaLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
