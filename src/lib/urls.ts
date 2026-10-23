/**
 * Canonical URL Helpers for CADO Building Materials E-Commerce
 *
 * Provides central, consistent clean URL generation for:
 * - /shop
 * - /shop/[categorySlug]
 * - /shop/[categorySlug]/[subcategorySlug]
 * - /shop/[categorySlug]/[subcategorySlug]/[brandSlug]
 * - /brands/[brandSlug]
 * - /products/[productSlug]
 */

export interface ShopUrlOptions {
  category?: string;
  subcategory?: string;
  brand?: string;
  sort?: string;
  q?: string;
  page?: number | string;
}

export function buildShopUrl(options: ShopUrlOptions): string {
  const { category, subcategory, brand, sort, q, page } = options;

  let path = "/shop";

  if (category) {
    path += `/${encodeURIComponent(category)}`;
    if (subcategory) {
      path += `/${encodeURIComponent(subcategory)}`;
      if (brand) {
        path += `/${encodeURIComponent(brand)}`;
      }
    } else if (brand) {
      path += `/all/${encodeURIComponent(brand)}`;
    }
  } else if (brand) {
    path += `/all/all/${encodeURIComponent(brand)}`;
  }

  const queryParams = new URLSearchParams();
  if (q) queryParams.set("q", q);
  if (sort && sort !== "newest") queryParams.set("sort", sort);
  if (page && String(page) !== "1") queryParams.set("page", String(page));

  const qs = queryParams.toString();
  return qs ? `${path}?${qs}` : path;
}

export function buildBrandUrl(brandSlug: string): string {
  return `/brands/${encodeURIComponent(brandSlug)}`;
}

export function buildProductUrl(productSlug: string): string {
  return `/products/${encodeURIComponent(productSlug)}`;
}

export function buildCategoryUrl(categorySlug: string, subcategorySlug?: string): string {
  if (subcategorySlug) {
    return `/shop/${encodeURIComponent(categorySlug)}/${encodeURIComponent(subcategorySlug)}`;
  }
  return `/shop/${encodeURIComponent(categorySlug)}`;
}
