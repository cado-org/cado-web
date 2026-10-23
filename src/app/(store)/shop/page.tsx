import React from "react";
import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { ShopView } from "@/components/products/ShopView";
import { buildShopUrl } from "@/lib/urls";
import { ENV } from "@/lib/env";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
    brand?: string;
    sort?: "newest" | "name_asc" | "name_desc";
    q?: string;
    page?: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = ENV.SITE_URL || "https://cado.in";
  const canonicalUrl = `${baseUrl}/shop`;

  return {
    title: "All Building Materials & Chemicals Catalog | CADO",
    description:
      "Explore CADO's complete catalog of high-performance tile adhesives, epoxy grouts, waterproofing membranes, and construction chemicals.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: "All Building Materials & Chemicals Catalog | CADO",
      description:
        "Explore CADO's complete catalog of high-performance tile adhesives, epoxy grouts, waterproofing membranes, and construction chemicals.",
      url: canonicalUrl,
      siteName: "CADO Building Materials",
      type: "website",
    },
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const sp = await searchParams;

  // 301 Permanent Redirect if legacy query parameters exist
  if (sp.category || sp.brand) {
    const cleanUrl = buildShopUrl({
      category: sp.category,
      subcategory: sp.subcategory,
      brand: sp.brand,
      sort: sp.sort,
      q: sp.q,
      page: sp.page,
    });

    if (cleanUrl !== "/shop") {
      permanentRedirect(cleanUrl);
    }
  }

  const currentSort = sp.sort || "newest";
  const currentSearch = sp.q || "";
  const currentPage = parseInt(sp.page || "1", 10) || 1;

  return (
    <ShopView
      currentSort={currentSort}
      currentSearch={currentSearch}
      currentPage={currentPage}
      canonicalPath="/shop"
    />
  );
}