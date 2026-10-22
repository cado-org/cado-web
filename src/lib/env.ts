// Environment variable validator and accessors

export const ENV = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

export function isSupabaseConfigured(): boolean {
  return Boolean(
    ENV.SUPABASE_URL &&
    ENV.SUPABASE_ANON_KEY &&
    !ENV.SUPABASE_URL.includes("your-project.supabase.co")
  );
}

export function isSupabaseAdminConfigured(): boolean {
  return Boolean(
    isSupabaseConfigured() &&
    ENV.SUPABASE_SERVICE_ROLE_KEY &&
    !ENV.SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role-key")
  );
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    ENV.CLOUDINARY_CLOUD_NAME &&
    ENV.CLOUDINARY_API_KEY &&
    ENV.CLOUDINARY_API_SECRET &&
    !ENV.CLOUDINARY_CLOUD_NAME.includes("your-cloud-name")
  );
}
