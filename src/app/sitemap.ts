import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mykeepwell.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/services",
    "/how-it-works",
    "/pricing",
    "/digital-access",
    "/second-homes",
    "/landlords",
    "/for-property-managers",
    "/for-real-estate-agents",
    "/partner-tech",
    "/trust-safety",
    "/contact",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/services" || route === "/pricing" || route === "/digital-access" ? 0.9 : 0.7,
  }));
}
