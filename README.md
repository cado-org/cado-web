# CADO Building Products E-Commerce Platform

A production-ready building materials e-commerce website and admin management system built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Supabase (PostgreSQL + Auth)**, and **Cloudinary**.

Inspired by the official **CADO Building Products** homepage reference, featuring high-bonding tile adhesives, construction chemicals, sealants, grouts, plumbing fittings, bathroom accessories, and tools.

---

## 🌟 Key Features

### 1. Public E-Commerce Website
- **Exact Reference Layout & Order**:
  1. **Top Announcement Bar**: Configurable red strip with contact, quality guarantees, and direct links.
  2. **Main Header**: CADO primary logo, category & brand dropdowns, search bar, wishlist, and interactive enquiry cart drawer.
  3. **Hero Banner**: Construction tile installation background, CADO 777 & 666 packaging bags, typography, and dual CTAs.
  4. **Trust Indicator Row**: 4 genuine trust items (*Trusted Quality, Bulk Supply, Expert Support, Pan India Supply*).
  5. **Shop by Category**: High-fidelity category cards linking to dynamic category pages with active highlighting.
  6. **Our Own Brand CADO**: Split editorial section with brand overview and a dedicated "Need Large Quantity?" WhatsApp quote panel.
  7. **Featured CADO Products**: Product cards showcasing CADO Tile Adhesive 777, CADO Tile Adhesive 666, and CADO Epoxy Grout with specifications, packaging details, and WhatsApp actions.
  8. **Trusted Brands Under One Roof**: Brand showcase with dark architectural banner and grid of supplier logos (*MYK LATICRETE, Supreme, Jaquar, Finolex, DOWSIL, ASTRAL PIPES, HÄFELE, weber*).
  9. **Popular Categories**: Wide photographic showcase cards.
  10. **Project Inspiration Gallery**: Real project photography (*Residential Floors, Bathroom Walls, Commercial Projects, Outdoor Spaces*).
  11. **Why Choose CADO / Built for a Stronger Tomorrow**: 4-pillar benefits showcase with construction imagery.
  12. **Newsletter / Offers Strip**: Red full-width banner with real email validation and Supabase deduplication.
  13. **Dark Footer**: White CADO logo, social links, categorized navigation, contact info, and WhatsApp action.

### 2. WhatsApp Enquiry & Ordering Workflow
- **Form-Based In-App Validation**: Clicking *Enquire on WhatsApp* opens an interactive modal or drawer with prefilled product details (name, SKU, packaging, MOQ).
- **Customer Fields**: Full name, mobile number, email, company, requested quantity, delivery location, and custom requirements.
- **Server-Side Persistence**: Enquiries and line items are validated with Zod and saved to Supabase **before** WhatsApp is triggered.
- **Auto-Generated URL-Encoded Message**: Populates actual submitted details into `https://wa.me/{phone}?text={encoded}`.
- **Multi-Product Enquiry Cart**: Customers can add multiple products to an enquiry list and submit a single consolidated quote request.

### 3. Comprehensive Admin Dashboard (`/admin`)
- **Dashboard Overview (`/admin/dashboard`)**: Genuine database metrics for products, active items, categories, brands, enquiries, and recent updates.
- **Products CRUD (`/admin/products`)**:
  - Add, edit, delete, activate/deactivate, and feature products.
  - **Dynamic Subcategories**: Subcategory dropdown automatically filters according to the selected category.
  - Dynamic technical specifications key-value builder.
  - Packaging details, MOQ, availability status (*In Stock, Out of Stock, Made to Order*), and Cloudinary image management.
- **Categories CRUD (`/admin/categories`)**: Create and manage categories, upload icons, set display order, and toggle active status.
- **Subcategories CRUD (`/admin/subcategories`)**: Manage granular product types linked to parent categories.
- **Brands CRUD (`/admin/brands`)**: Manage brand names, logos, websites, and featured status.
- **Enquiries Inbox (`/admin/enquiries`)**:
  - Filter by status: `new`, `contacted`, `quoted`, `completed`, `cancelled`.
  - Search by customer name, phone, or location.
  - Detail drawer showing product snapshots and customer requirements.
  - Status updates and internal admin notes.
  - One-click phone calling and direct WhatsApp chat links.
  - One-click **CSV export** of filtered enquiries.
- **Hero Banners (`/admin/banners`)**: Edit headlines, desktop & mobile image uploads, and CTA destinations.
- **Homepage Sections (`/admin/homepage`)**: Reorder sections and toggle visibility.
- **Project Gallery (`/admin/projects`)**: Upload cover photos, case studies, and locations.
- **Trust Indicators (`/admin/trust-indicators`)**: Customize trust badges.
- **Newsletter Subscribers (`/admin/newsletter`)**: View all subscribed email leads.
- **Website Settings (`/admin/settings`)**: Edit company name, logo, WhatsApp number, phone, email, and announcement bar without code changes.
- **Admin Users (`/admin/users`)**: Role-based access control and admin bootstrap guide.

---

## 🗄️ Database Schema & Migrations

All SQL migrations and seed files are located in `supabase/`:

1. **`supabase/migrations/001_initial_schema.sql`**:
   - `profiles`: User roles (`admin`, `superadmin`).
   - `categories`: Names, slugs, images, display order, SEO metadata.
   - `subcategories`: Foreign key to `categories`, slug unique constraint.
   - `brands`: Brand logos, website links, display order.
   - `products`: Category & brand references, JSONB specifications, JSONB gallery images, packaging details, availability.
   - `hero_banners`: Carousel slides with desktop/mobile images and CTAs.
   - `homepage_sections`: Dynamic section titles, order, and toggle states.
   - `trust_indicators`: 4 homepage trust badges.
   - `projects`: Case study gallery and cover photos.
   - `enquiries`: Customer records, statuses, admin notes.
   - `enquiry_items`: Line item snapshots preserved per enquiry.
   - `site_settings`: Global website configuration (WhatsApp number, logos, contact).
   - `newsletter_subscribers`: Verified email subscriptions.

2. **`supabase/migrations/002_rls_policies.sql`**:
   - Row Level Security (RLS) on all 13 tables.
   - Public visitors can only read published/active catalog records and site settings.
   - Enquiries and newsletter subscriptions allow public inserts but restrict reading to admins.
   - Only authorized `admin` profiles can perform mutations.

3. **`supabase/seed-development.sql`**:
   - Populates initial authentic CADO products (*CADO Tile Adhesive 777, CADO Tile Adhesive 666, CADO Epoxy Grout*), categories, brands, projects, hero banners, and site settings matching the reference design.

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Configure your credentials:

```ini
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Cloudinary Image Management
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Application URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 🚀 How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Apply Database Migrations
1. Open your Supabase Dashboard &rarr; **SQL Editor**.
2. Run `supabase/migrations/001_initial_schema.sql`.
3. Run `supabase/migrations/002_rls_policies.sql`.
4. (Optional) Run `supabase/seed-development.sql` to import the initial CADO catalog.

### 3. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) for the public storefront or [http://localhost:3000/admin](http://localhost:3000/admin) for the admin portal.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 👤 Creating the First Administrator

Public admin registration is intentionally disabled. To set up your first admin:

1. In your **Supabase Dashboard**, navigate to **Authentication &rarr; Users &rarr; Add User**.
2. Create an admin user with your email and password (e.g. `admin@cado.in`).
3. Copy the generated **User UUID**.
4. In the **SQL Editor**, grant admin permissions:
   ```sql
   INSERT INTO public.profiles (id, full_name, role)
   VALUES ('YOUR_USER_UUID_HERE', 'CADO Admin', 'admin');
   ```
5. Log in at `/admin/login`.

---

## ☁️ Deployment

- **Vercel**: Deploy the repository directly to Vercel. Set the environment variables from `.env.local` in the Vercel Project Settings.
- **Supabase**: Hosted PostgreSQL and Auth database.
- **Cloudinary**: Media asset uploads and transformations.
