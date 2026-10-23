import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBrandBySlug, getProducts } from "@/lib/data";
import { ProductCard } from "@/components/products/ProductCard";
import { PackageOpen, ExternalLink } from "lucide-react";
import { ENV } from "@/lib/env";

interface BrandDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BrandDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  const baseUrl = ENV.SITE_URL || "https://cado.in";
  const canonicalUrl = `${baseUrl}/brands/${slug}`;

  if (!brand) {
    return {
      title: "Brand Not Found | CADO Building Materials",
    };
  }

  const title = `${brand.name} Building Materials & Products | CADO`;
  const description =
    brand.description ||
    `Browse genuine ${brand.name} products, adhesives, chemicals, and construction solutions at CADO.`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "CADO Building Materials",
      type: "website",
      images: brand.logo_url ? [{ url: brand.logo_url, alt: brand.name }] : undefined,
    },
  };
}

export default async function BrandDetailPage({ params }: BrandDetailPageProps) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  const { products } = await getProducts({
    brandSlug: slug,
    limit: 24,
  });

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-6 flex items-center space-x-2">
          <Link href="/" className="hover:text-[#D71920] transition">
            Home
          </Link>
          <span>/</span>
          <Link href="/brands" className="hover:text-[#D71920] transition">
            Brands
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-bold">{brand.name}</span>
        </nav>

        {/* Brand Header */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-8 shadow-xs flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-44 h-24 bg-gray-50 border border-gray-200 rounded-xl p-3 shrink-0 flex items-center justify-center">
            {brand.logo_url ? (
              <Image
                src={brand.logo_url}
                alt={brand.name}
                fill
                className="object-contain p-2"
              />
            ) : (
              <span className="font-bold text-gray-800">{brand.name}</span>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-[#191919]">
              {brand.name}
            </h1>
            {brand.description && (
              <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl">
                {brand.description}
              </p>
            )}

            {brand.website_url && (
              <a
                href={brand.website_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-xs font-semibold text-[#D71920] hover:underline mt-2"
              >
                <span>Official Brand Website</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            )}
          </div>
        </div>

        {/* Products */}
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-xs">
            <PackageOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900">
              No products found under {brand.name}.
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Please check back shortly or explore other brands in our catalog.
            </p>
            <div className="mt-5">
              <Link
                href="/shop"
                className="px-4 py-2 bg-[#D71920] text-white text-xs font-bold rounded"
              >
                Browse All Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
