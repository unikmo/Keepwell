import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mykeepwell.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/app/", "/login", "/signup", "/book/details", "/book/review"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
