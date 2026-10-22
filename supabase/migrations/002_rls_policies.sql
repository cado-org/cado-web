-- ========================================================
-- CADO Building Materials E-Commerce Database Schema
-- Migration 002: Row Level Security (RLS) Policies
-- ========================================================

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trust_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Helper function to check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. PROFILES
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins have full access to profiles"
  ON public.profiles FOR ALL
  USING (public.is_admin());

-- 2. CATEGORIES
CREATE POLICY "Public can view active categories"
  ON public.categories FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage categories"
  ON public.categories FOR ALL
  USING (public.is_admin());

-- 3. SUBCATEGORIES
CREATE POLICY "Public can view active subcategories"
  ON public.subcategories FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage subcategories"
  ON public.subcategories FOR ALL
  USING (public.is_admin());

-- 4. BRANDS
CREATE POLICY "Public can view active brands"
  ON public.brands FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage brands"
  ON public.brands FOR ALL
  USING (public.is_admin());

-- 5. PRODUCTS
CREATE POLICY "Public can view active products"
  ON public.products FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  USING (public.is_admin());

-- 6. HERO BANNERS
CREATE POLICY "Public can view active banners"
  ON public.hero_banners FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage hero banners"
  ON public.hero_banners FOR ALL
  USING (public.is_admin());

-- 7. HOMEPAGE SECTIONS
CREATE POLICY "Public can view enabled sections"
  ON public.homepage_sections FOR SELECT
  USING (is_enabled = true OR public.is_admin());

CREATE POLICY "Admins can manage homepage sections"
  ON public.homepage_sections FOR ALL
  USING (public.is_admin());

-- 8. TRUST INDICATORS
CREATE POLICY "Public can view active indicators"
  ON public.trust_indicators FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage trust indicators"
  ON public.trust_indicators FOR ALL
  USING (public.is_admin());

-- 9. PROJECTS
CREATE POLICY "Public can view active projects"
  ON public.projects FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage projects"
  ON public.projects FOR ALL
  USING (public.is_admin());

-- 10. ENQUIRIES
CREATE POLICY "Anyone can submit enquiry"
  ON public.enquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view and manage enquiries"
  ON public.enquiries FOR ALL
  USING (public.is_admin());

-- 11. ENQUIRY ITEMS
CREATE POLICY "Anyone can submit enquiry items"
  ON public.enquiry_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view and manage enquiry items"
  ON public.enquiry_items FOR ALL
  USING (public.is_admin());

-- 12. SITE SETTINGS
CREATE POLICY "Public can view site settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can update site settings"
  ON public.site_settings FOR ALL
  USING (public.is_admin());

-- 13. NEWSLETTER SUBSCRIBERS
CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view and manage subscribers"
  ON public.newsletter_subscribers FOR ALL
  USING (public.is_admin());
