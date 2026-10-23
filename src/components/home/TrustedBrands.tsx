import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Brand, HomepageSection } from "@/types/database";

interface TrustedBrandsProps {
  brands?: Brand[];
  section?: HomepageSection | null;
}

export function TrustedBrands({ brands = [], section }: TrustedBrandsProps) {
  // Only display if brands exist
  if (!brands || brands.length === 0) {
    return null;
  }

  // Filter out 'cado' from partner brands showcase (CADO has its own dedicated brand section above),
  // ensuring the 8 partner brands match the reference grid:
  // Row 1: MYK LATICRETE, Supreme, Jaquar, Finolex
  // Row 2: DOWSIL, ASTRAL PIPES, HAFELE, weber
  const partnerBrands = brands.filter((b) => b.slug !== "cado");
  const displayBrands = (partnerBrands.length >= 8 ? partnerBrands : brands).slice(0, 8);

  const content = (section?.content as any) || {};
  const heading = content.heading || section?.title || "Trusted Brands Under One Roof";
  const subheading =
    content.subheading ||
    section?.description ||
    "Explore a wide range of building products, fittings, chemicals and accessories from leading brands.";
  const ctaLabel = content.cta_label || "Shop All Brands";
  const ctaUrl = content.cta_url || "/brands";

  return (
    <section className="py-8 sm:py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Single horizontal connected container with zero gap and square corners */}
        <div className="flex flex-col lg:flex-row items-stretch w-full rounded-none overflow-hidden border border-gray-200/90 shadow-none">
          {/* Left Promotional Banner (approx 45% width) */}
          <div className="relative w-full lg:w-[45%] min-h-[340px] sm:min-h-[380px] lg:min-h-[400px] flex flex-col justify-center p-7 sm:p-10 lg:p-10 xl:p-12 overflow-hidden rounded-none bg-[#171717]">
            {/* Background Image: Luxury modern bathroom/interior */}
            <div className="absolute inset-0 pointer-events-none">
              <Image
                src="/images/brands/trusted-brands-banner.jpg"
                alt="Trusted Brands Under One Roof"
                fill
                priority
                className="object-cover object-center"
              />
              {/* Subtle dark gradient overlay for sharp white typography contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/35 lg:to-black/20" />
            </div>

            {/* Left Content Overlay */}
            <div className="relative z-10 space-y-3.5 my-auto max-w-sm sm:max-w-md">
              <h2 className="text-2xl sm:text-3xl lg:text-[32px] xl:text-4xl font-black text-white tracking-tight leading-tight">
                {heading}
              </h2>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
                {subheading}
              </p>

              <div className="pt-3">
                <Link
                  href={ctaUrl}
                  className="inline-flex items-center px-6 py-3 bg-[#D71920] hover:bg-[#B5121B] text-white text-xs sm:text-sm font-bold rounded-md shadow-sm transition-transform active:scale-95 space-x-2"
                >
                  <span>{ctaLabel}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Brand Logo Grid (approx 55% width) */}
          <div className="w-full lg:w-[55%] bg-[#F8F9FA] p-6 sm:p-8 lg:p-7 xl:p-9 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-200/90 rounded-none">
            {/* 4-column logo grid on desktop, 2-column on mobile */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-auto">
              {displayBrands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.slug}`}
                  className="bg-white border border-gray-200/80 rounded-none p-3 h-24 flex items-center justify-center hover:border-gray-400 transition-colors group shadow-2xs"
                  title={brand.name}
                >
                  {brand.logo_url ? (
                    <div className="relative w-full h-12">
                      <Image
                        src={brand.logo_url}
                        alt={brand.name}
                        fill
                        className="object-contain p-1 group-hover:scale-105 transition-transform"
                      />
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-gray-800">
                      {brand.name}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* View All Brands link below the grid, right-aligned */}
            <div className="pt-4 text-right">
              <Link
                href="/brands"
                className="inline-flex items-center text-xs sm:text-sm font-bold text-[#D71920] hover:text-[#B5121B] transition group"
              >
                <span>View All Brands</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
