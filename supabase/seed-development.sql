-- ========================================================
-- CADO Building Materials E-Commerce Database Seed
-- Development / Initial Dataset matching CADO Reference
-- ========================================================

-- 1. SITE SETTINGS
INSERT INTO public.site_settings (setting_key, setting_value)
VALUES
  ('general', '{
    "website_name": "CADO Building Products",
    "company_name": "CADO Building Products Private Limited",
    "main_logo_url": "/images/cado-logo.svg",
    "footer_logo_url": "/images/cado-logo-white.svg",
    "favicon_url": "/favicon.ico",
    "whatsapp_number": "917592958909",
    "primary_phone": "+91 75929 58909",
    "support_email": "sales@cado.in",
    "business_address": "Mukkom, Calicut, Kerala 673602, India",
    "social_links": {
      "facebook": "https://facebook.com/cadobuilding",
      "instagram": "https://instagram.com/cadobuilding",
      "youtube": "https://youtube.com/@cadobuilding",
      "linkedin": "https://linkedin.com/company/cadobuilding"
    },
    "announcement_bar": {
      "enabled": true,
      "text_items": [
        "Quality Building Products",
        "Fast Enquiry on WhatsApp",
        "Trusted Brands",
        "Pan India Supply"
      ],
      "link_items": [
        {"label": "About Us", "url": "/about"},
        {"label": "Contact", "url": "/contact"},
        {"label": "Track Enquiry", "url": "/contact"}
      ]
    },
    "default_seo": {
      "title": "CADO Building Products | Premium Tile Adhesives & Construction Materials",
      "description": "High performance tile adhesives, grouts, sealants and building supplies in Kerala and across India."
    },
    "show_pricing_globally": false,
    "newsletter_enabled": true
  }'::jsonb)
ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;

-- 2. TRUST INDICATORS
INSERT INTO public.trust_indicators (title, description, icon_name, display_order, is_active)
VALUES
  ('Trusted Quality', 'Reliable products', 'ShieldCheck', 1, true),
  ('Bulk Supply', 'Best pricing', 'Truck', 2, true),
  ('Expert Support', 'Quick response', 'Headphones', 3, true),
  ('Pan India Supply', 'For industrial & real estate', 'Globe', 4, true);

-- 3. CATEGORIES
INSERT INTO public.categories (id, name, slug, description, image_url, is_active, is_featured, display_order)
VALUES
  ('11111111-1111-1111-1111-111111111001', 'CADO Tile Adhesives', 'cado-tile-adhesives', 'High bonding tile adhesive solutions for ceramic, vitrified tiles, marble and granite', '/images/categories/tile-adhesives.svg', true, true, 1),
  ('11111111-1111-1111-1111-111111111002', 'Construction Chemicals', 'construction-chemicals', 'Advanced waterproofing, bonding agents and concrete repair chemicals', '/images/categories/construction-chemicals.svg', true, true, 2),
  ('11111111-1111-1111-1111-111111111003', 'Sealants & Grouts', 'sealants-grouts', 'Epoxy grouts, polymer tile grouts and silicone sealants for seamless finish', '/images/categories/sealants-grouts.svg', true, true, 3),
  ('11111111-1111-1111-1111-111111111004', 'Plumbing Fittings', 'plumbing-fittings', 'Durable CPVC, UPVC, PVC pipes and drainage fittings from top manufacturers', '/images/categories/plumbing-fittings.svg', true, true, 4),
  ('11111111-1111-1111-1111-111111111005', 'Bathroom & Drainage Accessories', 'bathroom-drainage-accessories', 'Stainless steel floor drains, gratings, cleanouts and bathroom accessories', '/images/categories/bathroom-drainage.svg', true, true, 5),
  ('11111111-1111-1111-1111-111111111006', 'Tools & Accessories', 'tools-accessories', 'Notched trowels, tile spacers, mixers and construction tools', '/images/categories/tools-accessories.svg', true, true, 6)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  is_active = EXCLUDED.is_active,
  is_featured = EXCLUDED.is_featured,
  display_order = EXCLUDED.display_order;

-- 4. SUBCATEGORIES
INSERT INTO public.subcategories (category_id, name, slug, description, display_order, is_active)
VALUES
  ('11111111-1111-1111-1111-111111111001', 'Floor & Wall Adhesives', 'floor-wall-adhesives', 'Standard tile adhesives for floor and wall tiling', 1, true),
  ('11111111-1111-1111-1111-111111111001', 'Tile on Tile Adhesives', 'tile-on-tile', 'High polymer adhesives for renovating over existing tiles', 2, true),
  ('11111111-1111-1111-1111-111111111001', 'Granite & Marble Adhesives', 'granite-marble', 'Heavy duty adhesive for natural stone and large format tiles', 3, true),
  ('11111111-1111-1111-1111-111111111002', 'Waterproofing Compounds', 'waterproofing', 'Liquid membranes and integral waterproofing compounds', 1, true),
  ('11111111-1111-1111-1111-111111111002', 'Bonding Agents', 'bonding-agents', 'SBR and acrylic bonding agents for mortar and plaster', 2, true),
  ('11111111-1111-1111-1111-111111111003', 'Epoxy Tile Grout', 'epoxy-grout', 'Stain proof three-component epoxy grouts', 1, true),
  ('11111111-1111-1111-1111-111111111003', 'Silicone Sealants', 'silicone-sealants', 'Neutral cure weatherproofing and sanitary sealants', 2, true),
  ('11111111-1111-1111-1111-111111111004', 'CPVC & UPVC Pipes', 'cpvc-upvc-pipes', 'Pressure pipes and fittings for hot and cold plumbing', 1, true),
  ('11111111-1111-1111-1111-111111111005', 'Floor Drains & Jali', 'floor-drains', 'Square and linear stainless steel drains', 1, true),
  ('11111111-1111-1111-1111-111111111006', 'Tile Spacers & Levelers', 'spacers-levelers', 'Precision alignment spacers and reusable leveling wedges', 1, true)
ON CONFLICT (category_id, slug) DO NOTHING;

-- 5. BRANDS
INSERT INTO public.brands (id, name, slug, description, logo_url, website_url, is_featured, is_active, display_order)
VALUES
  ('22222222-2222-2222-2222-222222222001', 'CADO', 'cado', 'Our own flagship brand in high-performance adhesives, epoxy and grout solutions', '/images/brands/cado.svg', 'https://cado.in', true, true, 1),
  ('22222222-2222-2222-2222-222222222002', 'MYK LATICRETE', 'myk-laticrete', 'World leader in tile and stone installation materials', '/images/brands/myk-laticrete.svg', 'https://myklaticrete.com', true, true, 2),
  ('22222222-2222-2222-2222-222222222003', 'Supreme', 'supreme', 'Supreme Total Piping Solution for plumbing and drainage', '/images/brands/supreme.svg', 'https://supreme.co.in', true, true, 3),
  ('22222222-2222-2222-2222-222222222004', 'Jaquar', 'jaquar', 'Complete bathroom and lighting solutions', '/images/brands/jaquar.svg', 'https://jaquar.com', true, true, 4),
  ('22222222-2222-2222-2222-222222222005', 'Finolex', 'finolex', 'Premium PVC pipes and fittings for plumbing and irrigation', '/images/brands/finolex.svg', 'https://finolexpipes.com', true, true, 5),
  ('22222222-2222-2222-2222-222222222006', 'DOWSIL', 'dowsil', 'High performance silicone sealants and weatherproofing', '/images/brands/dowsil.svg', 'https://dow.com', true, true, 6),
  ('22222222-2222-2222-2222-222222222007', 'ASTRAL PIPES', 'astral-pipes', 'Leading piping systems for residential and commercial plumbing', '/images/brands/astral.svg', 'https://astralpipes.com', true, true, 7),
  ('22222222-2222-2222-2222-222222222008', 'HAFELE', 'hafele', 'German architectural hardware and bathroom drainage solutions', '/images/brands/hafele.svg', 'https://hafele.com', true, true, 8),
  ('22222222-2222-2222-2222-222222222009', 'weber', 'weber', 'Saint-Gobain Weber tile adhesives and dry-mortar solutions', '/images/brands/weber.svg', 'https://weber.saint-gobain', true, true, 9)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  logo_url = EXCLUDED.logo_url,
  is_featured = EXCLUDED.is_featured,
  display_order = EXCLUDED.display_order;

-- 6. PRODUCTS (Matching CADO reference image)
INSERT INTO public.products (
  name, slug, sku, short_description, description,
  category_id, brand_id, main_image_url, packaging_details,
  specifications, min_order_quantity, price, show_price,
  availability_status, is_featured, is_active
)
VALUES
  (
    'CADO Tile Adhesive 777',
    'cado-tile-adhesive-777',
    'CADO-TA-777',
    'High bonding strength tile adhesive for floor & wall applications. Grey / White options. Made in India.',
    'CADO Tile Adhesive 777 is a polymer-modified cementitious tile adhesive formulated for fixing ceramic, vitrified tiles, and natural stones on interior and exterior floor and wall surfaces. Delivers superior bonding strength, water resistance, and sag-resistant vertical performance.',
    '11111111-1111-1111-1111-111111111001',
    '22222222-2222-2222-2222-222222222001',
    '/images/products/cado-777.svg',
    '20 kg HDPE Bag',
    '[
      {"label": "Bond Strength", "value": "High bonding strength (IS 15477 Type 2)"},
      {"label": "Application", "value": "Floor & wall tile applications"},
      {"label": "Color Options", "value": "Grey / White"},
      {"label": "Pot Life", "value": "Approx. 2.5 - 3 hours"},
      {"label": "Coverage", "value": "50-60 sq.ft per 20kg bag at 3mm thickness"},
      {"label": "Origin", "value": "Made in India"}
    ]'::jsonb,
    5,
    null,
    false,
    'in_stock',
    true,
    true
  ),
  (
    'CADO Tile Adhesive 666',
    'cado-tile-adhesive-666',
    'CADO-TA-666',
    'Easy application tile adhesive with strong and durable bond. Ideal for floor & wall. Made in India.',
    'CADO Tile Adhesive 666 provides high tensile adhesion for standard ceramic and vitrified floor and wall tiling projects. Easy to mix and trowel, with extended open time and minimal shrinkage.',
    '11111111-1111-1111-1111-111111111001',
    '22222222-2222-2222-2222-222222222001',
    '/images/products/cado-666.svg',
    '20 kg HDPE Bag',
    '[
      {"label": "Application Ease", "value": "Smooth consistency & easy spreading"},
      {"label": "Durability", "value": "Strong & durable adhesive matrix"},
      {"label": "Suitability", "value": "Ideal for floor & wall surfaces"},
      {"label": "Bed Thickness", "value": "3mm - 6mm"},
      {"label": "Origin", "value": "Made in India"}
    ]'::jsonb,
    5,
    null,
    false,
    'in_stock',
    true,
    true
  ),
  (
    'CADO Epoxy Grout',
    'cado-epoxy-grout',
    'CADO-EG-10',
    'Three-component epoxy grout for tiles and stone. Strong & durable finish, chemical resistant. Interior & exterior.',
    'CADO Epoxy Grout is a high-performance, stain-resistant, waterproof three-part epoxy grout designed for filling tile joints in residential, commercial, and industrial areas subject to chemical exposure and heavy foot traffic.',
    '11111111-1111-1111-1111-111111111003',
    '22222222-2222-2222-2222-222222222001',
    '/images/products/cado-epoxy-grout.svg',
    '10 kg Bucket Kit',
    '[
      {"label": "Joint Width", "value": "2mm - 12mm"},
      {"label": "Chemical Resistance", "value": "Resistant to household chemicals, oils and acids"},
      {"label": "Waterproof", "value": "100% waterproof and stain-free"},
      {"label": "Finish", "value": "Smooth, uniform color finish"},
      {"label": "Suitability", "value": "Interior and exterior applications"}
    ]'::jsonb,
    2,
    null,
    false,
    'in_stock',
    true,
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  main_image_url = EXCLUDED.main_image_url,
  specifications = EXCLUDED.specifications,
  is_featured = EXCLUDED.is_featured;

-- 7. HERO BANNERS
INSERT INTO public.hero_banners (
  eyebrow, title, description,
  desktop_image_url, mobile_image_url,
  primary_cta_label, primary_cta_url,
  secondary_cta_label, secondary_cta_url,
  text_position, image_position, overlay_opacity,
  display_order, is_active
)
VALUES
  (
    'BUILD BETTER WITH CADO',
    'Premium Tile Adhesives for Stronger Spaces',
    'High-performance CADO tile adhesives designed for floor and wall applications. Reliable quality for homes, commercial and industrial projects.',
    '/images/hero/hero-tile-installation.svg',
    '/images/hero/hero-tile-installation.svg',
    'Shop CADO Products',
    '/shop?brand=cado',
    'Enquire on WhatsApp',
    'whatsapp',
    'left',
    'center',
    0.35,
    1,
    true
  );

-- 8. PROJECTS (Matching CADO reference image)
INSERT INTO public.projects (
  title, slug, project_type, description, location,
  cover_image_url, display_order, is_active
)
VALUES
  ('Residential Floors', 'residential-floors', 'Residential Projects', 'Premium finish and durable tile installation with CADO adhesives.', 'Kochi, Kerala', '/images/projects/residential-floors.svg', 1, true),
  ('Bathroom Walls', 'bathroom-walls', 'Bathroom Walls', 'Durable and elegant tile & marble installations in wet environments.', 'Calicut, Kerala', '/images/projects/bathroom-walls.svg', 2, true),
  ('Commercial Projects', 'commercial-projects', 'Commercial Projects', 'High-traffic commercial floor installations trusted by leading contractors.', 'Bangalore, Karnataka', '/images/projects/commercial-projects.svg', 3, true),
  ('Outdoor Spaces', 'outdoor-spaces', 'Outdoor Spaces', 'Weatherproof exterior stone & paver bonding withstands extreme conditions.', 'Trivandrum, Kerala', '/images/projects/outdoor-spaces.svg', 4, true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  project_type = EXCLUDED.project_type,
  description = EXCLUDED.description,
  cover_image_url = EXCLUDED.cover_image_url;

-- 9. HOMEPAGE SECTIONS
INSERT INTO public.homepage_sections (section_key, title, subtitle, description, is_enabled, display_order, content)
VALUES
  ('trust_indicators', 'Trust Indicators', null, null, true, 1, '{}'::jsonb),
  ('shop_by_category', 'Shop by Category', null, 'Browse our wide range of building materials and adhesives', true, 2, '{}'::jsonb),
  ('our_own_brand', 'Our Own Brand — CADO', 'High-performance adhesives, epoxy and grout solutions for modern construction.', 'We supply to dealers, contractors and businesses across Kerala and beyond.', true, 3, '{
    "heading": "Our Own Brand CADO",
    "subheading": "High-performance adhesives, epoxy and grout solutions for modern construction.",
    "cta_label": "Explore CADO Range",
    "cta_url": "/shop?brand=cado",
    "quote_card_title": "Need Large Quantity?",
    "quote_card_description": "We supply to dealers, contractors and businesses across Kerala and beyond.",
    "quote_features": [
      "Best Pricing for Bulk Orders",
      "Dedicated Support",
      "Quick Response on WhatsApp"
    ],
    "quote_cta_label": "GET A QUOTE ON WHATSAPP"
  }'::jsonb),
  ('featured_products', 'Featured CADO Products', 'Our own brand construction chemicals for professional and home use.', null, true, 4, '{}'::jsonb),
  ('trusted_brands', 'Trusted Brands Under One Roof', null, 'Explore a wide range of building products, fittings, chemicals and accessories from leading brands.', true, 5, '{
    "heading": "Trusted Brands Under One Roof",
    "subheading": "Explore a wide range of building products, fittings, chemicals and accessories from leading brands.",
    "cta_label": "Shop All Brands",
    "cta_url": "/brands"
  }'::jsonb),
  ('popular_categories', 'Popular Categories', 'Everything you need for construction, renovation and interiors.', null, true, 6, '{}'::jsonb),
  ('project_inspiration', 'Project Inspiration', 'See how CADO products help build stronger and better spaces.', null, true, 7, '{}'::jsonb),
  ('why_choose_cado', 'Built for a Stronger Tomorrow', 'WHY CHOOSE CADO', 'We are committed to providing high quality construction products and accessories that help professionals and homeowners build durable, beautiful and lasting spaces.', true, 8, '{
    "eyebrow": "WHY CHOOSE CADO",
    "heading": "Built for a Stronger Tomorrow",
    "description": "We are committed to providing high quality construction products and accessories that help professionals and homeowners build durable, beautiful and lasting spaces.",
    "benefits": [
      {"title": "Quality Products", "description": "Standardized brands"},
      {"title": "Wide Range", "description": "All building aspects"},
      {"title": "Expert Support", "description": "On WhatsApp"},
      {"title": "Reliable Supply", "description": "Pan India"}
    ]
  }'::jsonb),
  ('newsletter_strip', 'Get Updated with New Products & Offers', 'Be the first to know about our new arrivals, special offers and industry updates.', null, true, 9, '{}'::jsonb)
ON CONFLICT (section_key) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  is_enabled = EXCLUDED.is_enabled,
  display_order = EXCLUDED.display_order;
