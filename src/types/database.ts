export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "admin" | "superadmin";

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  image_public_id: string | null;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  image_public_id: string | null;
  is_active: boolean;
  display_order: number;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  logo_public_id: string | null;
  website_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface GalleryImage {
  url: string;
  public_id: string;
  alt?: string;
  display_order?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  short_description: string | null;
  description: string | null;
  category_id: string | null;
  subcategory_id: string | null;
  brand_id: string | null;
  main_image_url: string | null;
  main_image_public_id: string | null;
  gallery_images: GalleryImage[];
  specifications: ProductSpecification[];
  packaging_details: string | null;
  min_order_quantity: number;
  price: number | null;
  show_price: boolean;
  availability_status: "in_stock" | "out_of_stock" | "made_to_order";
  is_featured: boolean;
  is_active: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  category?: Category | null;
  subcategory?: Subcategory | null;
  brand?: Brand | null;
}

export interface HeroBanner {
  id: string;
  eyebrow: string | null;
  title: string;
  description: string | null;
  desktop_image_url: string;
  desktop_image_public_id: string | null;
  mobile_image_url: string | null;
  mobile_image_public_id: string | null;
  primary_cta_label: string | null;
  primary_cta_url: string | null;
  secondary_cta_label: string | null;
  secondary_cta_url: string | null;
  text_position: "left" | "center" | "right";
  image_position: "center" | "top" | "bottom";
  overlay_opacity: number;
  display_order: number;
  is_active: boolean;
  published_from: string | null;
  published_until: string | null;
  created_at: string;
  updated_at: string;
}

export interface HomepageSection {
  id: string;
  section_key: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  content: Json;
  is_enabled: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface TrustIndicator {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  project_type: string;
  description: string | null;
  location: string | null;
  cover_image_url: string;
  cover_image_public_id: string | null;
  gallery_images: GalleryImage[];
  completion_date: string | null;
  display_order: number;
  is_active: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

export type EnquiryStatus = "new" | "contacted" | "quoted" | "completed" | "cancelled";

export interface Enquiry {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  company_name: string | null;
  location: string;
  additional_requirements: string | null;
  status: EnquiryStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  items?: EnquiryItem[];
}

export interface EnquiryItem {
  id: string;
  enquiry_id: string;
  product_id: string | null;
  product_name_snapshot: string;
  product_sku_snapshot: string | null;
  requested_quantity: number;
  packaging_snapshot: string | null;
  created_at: string;
}

export type PaymentStatus = "pending" | "paid" | "cod" | "failed";
export type DeliveryStatus = "processing" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_sku: string | null;
  quantity: number;
  packaging: string | null;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  company_name: string | null;
  location: string;
  additional_requirements: string | null;
  payment_status: PaymentStatus;
  delivery_status: DeliveryStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  total_quantity: number;
}

export interface SiteSettings {
  id?: string;
  website_name: string;
  company_name: string;
  main_logo_url: string | null;
  footer_logo_url: string | null;
  favicon_url: string | null;
  whatsapp_number: string;
  primary_phone: string;
  support_email: string;
  business_address: string;
  social_links: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
  };
  announcement_bar: {
    enabled: boolean;
    text_items: string[];
    link_items: { label: string; url: string }[];
  };
  default_seo: {
    title: string;
    description: string;
    og_image?: string;
  };
  show_pricing_globally: boolean;
  newsletter_enabled: boolean;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscription_status: "subscribed" | "unsubscribed";
  subscribed_at: string;
  unsubscribed_at: string | null;
}
