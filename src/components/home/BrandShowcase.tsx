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
    <section className="py-10 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Split: Dark Brand Editorial Banner */}
          <div className="lg:col-span-8 bg-[#171717] rounded-xl p-8 sm:p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-md">
            {/* Dark background graphic */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <Image
                src="/images/hero/hero-tile-installation.svg"
                alt="CADO Brand Background"
                fill
                className="object-cover"
              />
            </div>

            <div className="relative z-10 max-w-md space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-red-500">
                Our Own Brand
              </p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                CADO
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {subheading}
              </p>

              <div className="pt-2">
                <Link
                  href={ctaUrl}
                  className="inline-flex items-center px-5 py-2.5 bg-[#D71920] hover:bg-[#B5121B] text-white text-xs font-bold uppercase tracking-wider rounded transition space-x-2"
                >
                  <span>{ctaLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Bags in bottom right */}
            <div className="relative z-10 mt-6 sm:mt-0 sm:absolute sm:bottom-4 sm:right-6 flex items-end space-x-2">
              <div className="w-24 sm:w-28 h-36 sm:h-44 relative">
                <Image
                  src="/images/products/cado-777.svg"
                  alt="CADO 777"
                  fill
                  className="object-contain drop-shadow-xl"
                />
              </div>
              <div className="w-24 sm:w-28 h-36 sm:h-44 relative -ml-4">
                <Image
                  src="/images/products/cado-666.svg"
                  alt="CADO 666"
                  fill
                  className="object-contain drop-shadow-xl"
                />
              </div>
              <div className="w-20 sm:w-24 h-32 sm:h-40 relative -ml-4">
                <Image
                  src="/images/products/cado-epoxy-grout.svg"
                  alt="CADO Epoxy Grout"
                  fill
                  className="object-contain drop-shadow-xl"
                />
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
