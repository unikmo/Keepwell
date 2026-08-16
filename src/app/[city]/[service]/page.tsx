import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalServicePage } from "@/components/LocalLocksmithPage";
import { MA_CITIES, MA_SERVICE_CONTENT, getMaCity, getMaService } from "@/lib/massachusetts-seo";
import { formatServicePrice, getServiceMenuItem } from "@/lib/service-menu";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mykeepwell.vercel.app";

export const dynamicParams = false;

export function generateStaticParams() {
  return MA_CITIES.flatMap((city) => city.services.map((service) => ({ city: city.slug, service })));
}

function titleFor(cityName: string, serviceSlug: keyof typeof MA_SERVICE_CONTENT) {
  const firstPriceId = MA_SERVICE_CONTENT[serviceSlug].serviceIds[0];
  const item = getServiceMenuItem(firstPriceId);
  const price = item ? formatServicePrice(item.customerPriceCents) : undefined;

  switch (serviceSlug) {
    case "emergency-locksmith":
      return `Emergency Locksmith ${cityName}, MA | Upfront Prices`;
    case "car-lockout":
      return `Car Lockout Locksmith ${cityName}, MA${price ? ` | ${price}` : ""}`;
    case "house-lockout":
      return `House Lockout Locksmith ${cityName}, MA${price ? ` | From ${price}` : ""}`;
    case "rekey-locks":
      return `Rekey Locks ${cityName}, MA${price ? ` | From ${price}` : ""}`;
    case "lock-change":
      return `Lock Change ${cityName}, MA${price ? ` | ${price} Labor` : ""}`;
    case "smart-lock-installation":
      return `Smart Lock Installation ${cityName}, MA${price ? ` | ${price} Labor` : ""}`;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ city: string; service: string }> }): Promise<Metadata> {
  const { city: citySlug, service: serviceSlug } = await params;
  const city = getMaCity(citySlug);
  const service = getMaService(serviceSlug);
  if (!city || !service || !city.services.includes(service.slug)) return {};

  const title = titleFor(city.name, service.slug);
  const description = service.description(city.name);
  const canonical = `${siteUrl}/${city.slug}/${service.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      siteName: "Trusted Locksmith",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function MassachusettsServicePage({ params }: { params: Promise<{ city: string; service: string }> }) {
  const { city: citySlug, service: serviceSlug } = await params;
  const city = getMaCity(citySlug);
  const service = getMaService(serviceSlug);
  if (!city || !service || !city.services.includes(service.slug)) notFound();

  const cityUrl = `${siteUrl}/${city.slug}`;
  const url = `${cityUrl}/${service.slug}`;
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `${service.shortTitle} in ${city.name}, Massachusetts`,
      url,
      description: service.description(city.name),
      isPartOf: { "@type": "WebSite", name: "Trusted Locksmith", url: siteUrl },
      about: { "@type": "Thing", name: `${service.shortTitle} in ${city.name}, Massachusetts` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trusted Locksmith", item: siteUrl },
        { "@type": "ListItem", position: 2, name: `${city.name}, MA locksmith`, item: cityUrl },
        { "@type": "ListItem", position: 3, name: service.shortTitle, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: service.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ];

  return (
    <>
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <LocalServicePage city={city} service={service} />
    </>
  );
}
