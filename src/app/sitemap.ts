import { MetadataRoute } from "next";
import { getCategories, getBrands, getProducts, getProjects } from "@/lib/data";
import { ENV } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = ENV.SITE_URL || "https://cado.in";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/brands`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/projects`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  const [categories, brands, { products }, projects] = await Promise.all([
    getCategories(),
    getBrands(),
    getProducts({ limit: 100 }),
    getProjects(),
  ]);

  // Clean canonical category and subcategory routes under /shop/
  const categoryRoutes: MetadataRoute.Sitemap = [];
  categories.forEach((c) => {
    categoryRoutes.push({
      url: `${baseUrl}/shop/${c.slug}`,
      lastModified: new Date(c.updated_at || Date.now()),
      changeFrequency: "weekly",
      priority: 0.85,
    });

    if (c.subcategories && c.subcategories.length > 0) {
      c.subcategories.forEach((sub) => {
        categoryRoutes.push({
          url: `${baseUrl}/shop/${c.slug}/${sub.slug}`,
          lastModified: new Date(sub.updated_at || c.updated_at || Date.now()),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      });
    }
  });

  const brandRoutes: MetadataRoute.Sitemap = brands.map((b) => ({
    url: `${baseUrl}/brands/${b.slug}`,
    lastModified: new Date(b.updated_at || Date.now()),
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: new Date(p.updated_at || Date.now()),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((proj) => ({
    url: `${baseUrl}/projects/${proj.slug}`,
    lastModified: new Date(proj.updated_at || Date.now()),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...brandRoutes,
    ...productRoutes,
    ...projectRoutes,
  ];
}
