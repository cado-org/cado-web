import React from "react";
import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { getCategories, getBrands } from "@/lib/data";
import { ShopView } from "@/components/products/ShopView";
import { ENV } from "@/lib/env";

interface ShopCatchAllProps {
  params: Promise<{
    slug: string[];
  }>;
  searchParams: Promise<{
    sort?: "newest" | "name_asc" | "name_desc";
    q?: string;
    page?: string;
  }>;
}

// Helper to resolve slugs against database records
async function resolveSlugs(slugs: string[]) {
  if (!slugs || slugs.length === 0 || slugs.length > 3) {
    return null;
  }

  const [categories, brands] = await Promise.all([
    getCategories(),
    getBrands(),
  ]);

  const seg0 = slugs[0];
  const seg1 = slugs[1];
  const seg2 = slugs[2];

  // 1 segment: /shop/[categorySlug]
  if (slugs.length === 1) {
    // Check if it's a category
    const category = categories.find((c) => c.slug === seg0);
    if (category) {
      return { category, subcategory: null, brand: null, redirectTo: null };
    }

    // If seg0 matches a brand, redirect to the canonical brand URL
    const brand = brands.find((b) => b.slug === seg0);
    if (brand) {
      return { category: null, subcategory: null, brand, redirectTo: `/brands/${brand.slug}` };
    }

    return null;
  }

  // 2 segments: /shop/[categorySlug]/[subcategorySlugOrBrand]
  if (slugs.length === 2) {
    if (seg0 === "all") {
      const brand = brands.find((b) => b.slug === seg1);
      if (brand) {
        return { category: null, subcategory: null, brand, redirectTo: `/brands/${brand.slug}` };
      }
      return null;
    }

    const category = categories.find((c) => c.slug === seg0);
    if (!category) return null;

    // Check if seg1 is a subcategory of this category
    const subcategory = category.subcategories?.find((s) => s.slug === seg1);
    if (subcategory) {
      return { category, subcategory, brand: null, redirectTo: null };
    }

    // Check if seg1 is a brand
    const brand = brands.find((b) => b.slug === seg1);
    if (brand) {
      return { category, subcategory: null, brand, redirectTo: null };
    }

    return null;
  }

  // 3 segments: /shop/[categorySlug]/[subcategorySlug]/[brandSlug]
  if (slugs.length === 3) {
    if (seg0 === "all" && seg1 === "all") {
      const brand = brands.find((b) => b.slug === seg2);
      if (brand) {
        return { category: null, subcategory: null, brand, redirectTo: `/brands/${brand.slug}` };
      }
      return null;
    }

    const category = categories.find((c) => c.slug === seg0);
    if (!category) return null;

    if (seg1 === "all") {
      const brand = brands.find((b) => b.slug === seg2);
      if (brand) {
        return { category, subcategory: null, brand, redirectTo: null };
      }
      return null;
    }

    const subcategory = category.subcategories?.find((s) => s.slug === seg1);
    if (!subcategory) return null;

    const brand = brands.find((b) => b.slug === seg2);
    if (!brand) return null;

    return { category, subcategory, brand, redirectTo: null };
  }

  return null;
}

export async function generateMetadata({
  params,
}: ShopCatchAllProps): Promise<Metadata> {
  const { slug } = await params;
  const resolved = await resolveSlugs(slug);
  const baseUrl = ENV.SITE_URL || "https://cado.in";

  if (!resolved || resolved.redirectTo) {
    return {
      title: "Products | CADO Building Materials",
    };
  }

  const { category, subcategory, brand } = resolved;
  const path = `/shop/${slug.join("/")}`;
  const canonicalUrl = `${baseUrl}${path}`;

  let title = "Building Materials & Chemicals | CADO";
  let description = "Browse genuine tile adhesives, grouts, waterproofing and construction chemicals.";

  if (category && subcategory && brand) {
    title = `${subcategory.name} by ${brand.name} — ${category.name} | CADO`;
    description = `Explore ${brand.name} ${subcategory.name.toLowerCase()} in the ${category.name.toLowerCase()} category. Genuine site supplies and competitive bulk pricing at CADO.`;
  } else if (category && subcategory) {
    title = `${subcategory.name} — ${category.name} | CADO Building Materials`;
    description = subcategory.description || `Browse quality ${subcategory.name.toLowerCase()} for professional tile, stone, and structural construction from CADO.`;
  } else if (category && brand) {
    title = `${category.name} by ${brand.name} | CADO Building Materials`;
    description = `Shop genuine ${brand.name} products in ${category.name.toLowerCase()}. Verified quality and site delivery by CADO.`;
  } else if (category) {
    title = `${category.name} | CADO Building Materials`;
    description = category.description || `Browse all ${category.name.toLowerCase()} solutions, adhesives, and chemicals at CADO.`;
  }

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
    },
  };
}

export default async function ShopCatchAllPage({
  params,
  searchParams,
}: ShopCatchAllProps) {
  const { slug } = await params;
  const sp = await searchParams;

  const resolved = await resolveSlugs(slug);

  if (!resolved) {
    notFound();
  }

  if (resolved.redirectTo) {
    permanentRedirect(resolved.redirectTo);
  }

  const currentSort = sp.sort || "newest";
  const currentSearch = sp.q || "";
  const currentPage = parseInt(sp.page || "1", 10) || 1;

  const canonicalPath = `/shop/${slug.join("/")}`;

  return (
    <ShopView
      currentCategory={resolved.category?.slug || ""}
      currentSubcategory={resolved.subcategory?.slug || ""}
      currentBrand={resolved.brand?.slug || ""}
      currentSort={currentSort}
      currentSearch={currentSearch}
      currentPage={currentPage}
      canonicalPath={canonicalPath}
    />
  );
}
