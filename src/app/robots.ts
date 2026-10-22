import { MetadataRoute } from "next";
import { ENV } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = ENV.SITE_URL || "https://cado.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
