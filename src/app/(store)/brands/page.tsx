import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getBrands } from "@/lib/data";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-6 flex items-center space-x-2">
          <Link href="/" className="hover:text-[#D71920] transition">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-bold">Trusted Brands</span>
        </nav>

        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-10 shadow-xs">
          <div className="flex items-center space-x-2 text-[#D71920] font-bold text-xs uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Authorized Distributors &amp; Manufacturers</span>
          </div>
          <h1 className="text-3xl font-black text-[#191919]">
            Trusted Brands Under One Roof
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-2xl leading-relaxed">
            We partner with industry-leading manufacturers of tile adhesives, plumbing pipes, bathroom fixtures, and construction chemicals.
          </p>
        </div>

        {/* Brand Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-between hover:shadow-md hover:border-[#D71920] transition group text-center"
            >
              <div className="relative w-full h-24 mb-4 flex items-center justify-center">
                {brand.logo_url ? (
                  <Image
                    src={brand.logo_url}
                    alt={brand.name}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <span className="text-lg font-bold text-gray-800">
                    {brand.name}
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-bold text-sm text-gray-900 group-hover:text-[#D71920] transition">
                  {brand.name}
                </h3>
                {brand.description && (
                  <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-snug">
                    {brand.description}
                  </p>
                )}
              </div>

              <span className="mt-4 inline-flex items-center text-xs font-bold text-[#D71920] group-hover:translate-x-1 transition-transform">
                <span>View Products</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
