import React from "react";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CategorySection } from "@/components/home/CategorySection";
import { BrandShowcase } from "@/components/home/BrandShowcase";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { TrustedBrands } from "@/components/home/TrustedBrands";
import { PopularCategories } from "@/components/home/PopularCategories";
import { ProjectGallery } from "@/components/home/ProjectGallery";
import { BrandPromise } from "@/components/home/BrandPromise";
import { NewsletterStrip } from "@/components/home/NewsletterStrip";
import {
  getHeroBanners,
  getCategories,
  getFeaturedProducts,
  getBrands,
  getProjects,
  getHomepageSections,
} from "@/lib/data";

export default async function HomePage() {
  const [
    banners,
    categories,
    featuredProducts,
    brands,
    projects,
    sections,
  ] = await Promise.all([
    getHeroBanners(),
    getCategories(),
    getFeaturedProducts(),
    getBrands(),
    getProjects(),
    getHomepageSections(),
  ]);

  const activeBanner = banners[0] || null;

  return (
    <div className="flex flex-col">
      {/* 1. Hero Section with embedded bottom trust indicators */}
      <HeroBanner banner={activeBanner} banners={banners} />

      {/* 2. Shop by Category */}
      <CategorySection categories={categories} />

      {/* 4. Our Own Brand CADO + WhatsApp Quote Panel */}
      <BrandShowcase section={sections["our_own_brand"]} />

      {/* 5. Featured CADO Products */}
      <FeaturedProducts products={featuredProducts} />

      {/* 6. Trusted Brands Under One Roof */}
      <TrustedBrands brands={brands} />

      {/* 7. Popular Categories */}
      <PopularCategories categories={categories} />

      {/* 8. Project Inspiration Gallery */}
      <ProjectGallery projects={projects} />

      {/* 9. Brand Promise / Why Choose CADO */}
      <BrandPromise section={sections["why_choose_cado"]} />

      {/* 10. Newsletter Strip */}
      <NewsletterStrip />
    </div>
  );
}
