import type { MetadataRoute } from "next";
import { MA_CITIES, MA_LOCAL_ROUTES } from "@/lib/massachusetts-seo";

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

  const corePages: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/services" || route === "/pricing" || route === "/digital-access" ? 0.9 : 0.7,
  }));

  const citySlugs = new Set(MA_CITIES.map((city) => `/${city.slug}`));
  const localPages: MetadataRoute.Sitemap = MA_LOCAL_ROUTES.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: citySlugs.has(route) ? 0.82 : 0.76,
  }));

  return [...corePages, ...localPages];
}
