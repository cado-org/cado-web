-- ==============================================================================
-- CADO COMPLETE DATABASE & ADMIN SETUP SCRIPT
-- Run this in your Supabase Dashboard -> SQL Editor -> Run
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles (Admin Roles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Categories
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  image_public_id TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Subcategories
CREATE TABLE IF NOT EXISTS public.subcategories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  image_public_id TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uq_category_subcategory_slug UNIQUE (category_id, slug)
);

-- 5. Brands
CREATE TABLE IF NOT EXISTS public.brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  logo_public_id TEXT,
  website_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Products
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL,
  brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sku TEXT,
  description TEXT,
  short_description TEXT,
  specifications JSONB DEFAULT '[]'::jsonb,
  main_image_url TEXT,
  main_image_public_id TEXT,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  brochure_url TEXT,
  packaging_details TEXT,
  min_order_quantity INTEGER NOT NULL DEFAULT 1,
  availability_status TEXT NOT NULL DEFAULT 'in_stock' CHECK (availability_status IN ('in_stock', 'out_of_stock', 'made_to_order')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Hero Banners
CREATE TABLE IF NOT EXISTS public.hero_banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  eyebrow TEXT,
  title TEXT NOT NULL,
  description TEXT,
  desktop_image_url TEXT NOT NULL,
  desktop_image_public_id TEXT,
  mobile_image_url TEXT,
  mobile_image_public_id TEXT,
  primary_cta_label TEXT,
  primary_cta_url TEXT,
  secondary_cta_label TEXT,
  secondary_cta_url TEXT,
  text_position TEXT NOT NULL DEFAULT 'left' CHECK (text_position IN ('left', 'center', 'right')),
  image_position TEXT NOT NULL DEFAULT 'center' CHECK (image_position IN ('center', 'top', 'bottom')),
  overlay_opacity NUMERIC(3,2) NOT NULL DEFAULT 0.40,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  published_from TIMESTAMPTZ,
  published_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Homepage Sections
CREATE TABLE IF NOT EXISTS public.homepage_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  content JSONB DEFAULT '{}'::jsonb,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. Trust Indicators
CREATE TABLE IF NOT EXISTS public.trust_indicators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. Projects Gallery
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  project_type TEXT DEFAULT 'Commercial',
  description TEXT,
  location TEXT,
  cover_image_url TEXT NOT NULL,
  cover_image_public_id TEXT,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  completion_date TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
ALTER TABLE IF EXISTS public.projects ADD COLUMN IF NOT EXISTS project_type TEXT DEFAULT 'Commercial';

-- 11. Enquiries
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  company_name TEXT,
  location TEXT NOT NULL,
  additional_requirements TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'completed', 'cancelled')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. Enquiry Items
CREATE TABLE IF NOT EXISTS public.enquiry_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enquiry_id UUID NOT NULL REFERENCES public.enquiries(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_sku TEXT,
  packaging TEXT,
  requested_quantity INTEGER NOT NULL DEFAULT 1,
  product_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. Site Settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 14. Newsletter Subscribers
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  subscription_status TEXT NOT NULL DEFAULT 'subscribed' CHECK (subscription_status IN ('subscribed', 'unsubscribed')),
  source TEXT DEFAULT 'homepage_strip',
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  unsubscribed_at TIMESTAMPTZ
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enable seamless read/write access for storefront & admin operations
-- ==============================================================================

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

-- Drop existing restrictive policies if any
DO $$ 
DECLARE
  tbl text;
BEGIN
  FOR tbl IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('DROP POLICY IF EXISTS "allow_all_ops" ON public.%I', tbl);
    EXECUTE format('CREATE POLICY "allow_all_ops" ON public.%I FOR ALL USING (true) WITH CHECK (true)', tbl);
  END LOOP;
END $$;

-- Auto-confirm the admin user and assign admin role in profiles
UPDATE auth.users 
SET email_confirmed_at = now() 
WHERE email = 'admin@cado.in';

INSERT INTO public.profiles (id, full_name, role)
SELECT id, 'CADO Administrator', 'admin'
FROM auth.users
WHERE email = 'admin@cado.in'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- ==============================================================================
-- INITIAL DEFAULT SEED DATA
-- ==============================================================================

INSERT INTO public.site_settings (setting_key, setting_value)
VALUES ('general', '{
  "website_name": "CADO Building Products",
  "company_name": "CADO Building Products Private Limited",
  "primary_phone": "+91 75929 58909",
  "whatsapp_number": "917592958909",
  "support_email": "sales@cado.in",
  "business_address": "Mukkom, Calicut, Kerala 673602",
  "announcement_bar": {
    "enabled": true,
    "phone": "+91 75929 58909",
    "email": "sales@cado.in",
    "tagline": "Quality Building Products & Trade Supplies Across Kerala",
    "delivery_guarantee": "Fast Jobsite Delivery Available"
  }
}'::jsonb)
ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;

ALTER TABLE IF EXISTS public.trust_indicators ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE IF EXISTS public.trust_indicators ADD COLUMN IF NOT EXISTS icon_name TEXT;

INSERT INTO public.trust_indicators (title, description, icon_name, display_order, is_active)
VALUES
  ('Trusted Quality', 'Certified building materials', 'ShieldCheck', 1, true),
  ('Bulk Supply', 'Direct contractor pricing', 'Truck', 2, true),
  ('Expert Support', 'Instant quotes via WhatsApp', 'Headphones', 3, true),
  ('Pan India Supply', 'Prompt logistics & dispatch', 'Clock', 4, true)
ON CONFLICT DO NOTHING;
