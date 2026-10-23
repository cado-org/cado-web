import { createServerSupabaseClient } from "./supabase/server";
import {
  Category,
  Brand,
  Product,
  HeroBanner,
  HomepageSection,
  TrustIndicator,
  Project,
  SiteSettings,
} from "@/types/database";

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  try {
    const { data } = await supabase
      .from("site_settings")
      .select("setting_value")
      .eq("setting_key", "general")
      .maybeSingle();

    return (data?.setting_value as SiteSettings) || null;
  } catch (err) {
    console.error("Error fetching site settings:", err);
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*, subcategories(*)")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Error in getCategories:", err);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*, subcategories(*)")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (error) return null;
    return data || null;
  } catch {
    return null;
  }
}

export async function getBrands(): Promise<Brand[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching brands:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Error in getBrands:", err);
    return [];
  }
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (error) return null;
    return data || null;
  } catch {
    return null;
  }
}

export async function getHeroBanners(): Promise<HeroBanner[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("hero_banners")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching hero banners:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Error in getHeroBanners:", err);
    return [];
  }
}

export async function getTrustIndicators(): Promise<TrustIndicator[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("trust_indicators")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching trust indicators:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Error in getTrustIndicators:", err);
    return [];
  }
}

export async function getHomepageSections(): Promise<Record<string, HomepageSection>> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return {};

  try {
    const { data, error } = await supabase
      .from("homepage_sections")
      .select("*")
      .eq("is_enabled", true)
      .order("display_order", { ascending: true });

    if (error || !data) return {};

    const map: Record<string, HomepageSection> = {};
    data.forEach((sec) => {
      map[sec.section_key] = sec;
    });
    return map;
  } catch (err) {
    console.error("Error in getHomepageSections:", err);
    return {};
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*), brand:brands(*)")
      .eq("is_active", true)
      .eq("is_featured", true)
      .limit(6);

    if (error) {
      console.error("Error fetching featured products:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Error in getFeaturedProducts:", err);
    return [];
  }
}

export async function getProducts(options?: {
  categorySlug?: string;
  subcategorySlug?: string;
  brandSlug?: string;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: "newest" | "name_asc" | "name_desc";
}): Promise<{ products: Product[]; count: number }> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { products: [], count: 0 };

  try {
    const catRel = options?.categorySlug ? "category:categories!inner(*)" : "category:categories(*)";
    const subRel = options?.subcategorySlug ? "subcategory:subcategories!inner(*)" : "subcategory:subcategories(*)";
    const brandRel = options?.brandSlug ? "brand:brands!inner(*)" : "brand:brands(*)";

    let query = supabase
      .from("products")
      .select(`*, ${catRel}, ${subRel}, ${brandRel}`, {
        count: "exact",
      })
      .eq("is_active", true);

    if (options?.categorySlug) {
      query = query.eq("category.slug", options.categorySlug);
    }

    if (options?.subcategorySlug) {
      query = query.eq("subcategory.slug", options.subcategorySlug);
    }

    if (options?.brandSlug) {
      query = query.eq("brand.slug", options.brandSlug);
    }

    if (options?.search) {
      query = query.or(
        `name.ilike.%${options.search}%,description.ilike.%${options.search}%,sku.ilike.%${options.search}%`
      );
    }

    if (options?.sortBy === "name_asc") {
      query = query.order("name", { ascending: true });
    } else if (options?.sortBy === "name_desc") {
      query = query.order("name", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const limit = options?.limit || 12;
    const offset = options?.offset || 0;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching products:", error);
      return { products: [], count: 0 };
    }

    return {
      products: data || [],
      count: count || 0,
    };
  } catch (err) {
    console.error("Error in getProducts:", err);
    return { products: [], count: 0 };
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*), subcategory:subcategories(*), brand:brands(*)")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (error) return null;
    return data || null;
  } catch {
    return null;
  }
}

export async function getProjects(): Promise<Project[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching projects:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Error in getProjects:", err);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (error) return null;
    return data || null;
  } catch {
    return null;
  }
}
