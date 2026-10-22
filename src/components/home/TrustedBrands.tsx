import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Brand } from "@/types/database";

interface TrustedBrandsProps {
  brands?: Brand[];
}

export function TrustedBrands({ brands = [] }: TrustedBrandsProps) {
  // Only display if brands exist
  if (!brands || brands.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Dark Editorial Banner */}
          <div className="lg:col-span-5 bg-[#171717] rounded-xl p-8 sm:p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-md min-h-[340px]">
            {/* Background design */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <Image
                src="/images/projects/bathroom-walls.svg"
                alt="Bathroom Interior Background"
                fill
                className="object-cover"
              />
            </div>

            <div className="relative z-10 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Trusted Brands Under One Roof
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-sm">
                Explore a wide range of building products, fittings, chemicals and accessories from leading brands.
              </p>
            </div>

            <div className="relative z-10 pt-6">
              <Link
                href="/brands"
                className="inline-flex items-center px-5 py-2.5 bg-[#D71920] hover:bg-[#B5121B] text-white text-xs font-bold uppercase tracking-wider rounded transition space-x-2"
              >
                <span>Shop All Brands</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Brand Logo Grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {brands.slice(0, 8).map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.slug}`}
                  className="bg-white border border-gray-200 rounded-lg p-4 h-24 flex items-center justify-center hover:border-gray-400 hover:shadow-sm transition group"
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

            <div className="mt-4 text-center sm:text-right">
              <Link
                href="/brands"
                className="inline-flex items-center text-xs font-bold text-[#D71920] hover:text-[#B5121B] transition group"
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
