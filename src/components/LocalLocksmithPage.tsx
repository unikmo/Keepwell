import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import {
  MA_CITIES,
  MA_SERVICE_CONTENT,
  type MaCity,
  type MaServiceContent,
  type MaServiceSlug,
} from "@/lib/massachusetts-seo";
import { formatServicePrice, getServiceMenuItem } from "@/lib/service-menu";

const SERVICE_CARD_META: Array<{
  slug: MaServiceSlug;
  title: string;
  body: string;
  priceId: string;
  priceSuffix?: string;
}> = [
  {
    slug: "emergency-locksmith",
    title: "Emergency locksmith",
    body: "Urgent residential access with weekday, evening/weekend and overnight pricing shown before the request.",
    priceId: "home_lockout_day",
    priceSuffix: "from",
  },
  {
    slug: "house-lockout",
    title: "House lockout",
    body: "Standard residential entry for a house, apartment or condo, with travel/service call included.",
    priceId: "home_lockout_day",
    priceSuffix: "from",
  },
  {
    slug: "car-lockout",
    title: "Car lockout",
    body: "Standard vehicle entry at the service property. Key cutting and programming are outside the launch scope.",
    priceId: "car_lockout_at_property",
  },
  {
    slug: "rekey-locks",
    title: "Rekey locks",
    body: "First standard cylinder plus transparent pricing for additional standard cylinders.",
    priceId: "standard_rekey",
  },
  {
    slug: "lock-change",
    title: "Lock change",
    body: "Standard residential lock-replacement labor. Hardware is separate and approved before installation.",
    priceId: "standard_lock_change",
  },
  {
    slug: "smart-lock-installation",
    title: "Smart lock installation",
    body: "Installation and setup of one compatible customer-supplied smart lock.",
    priceId: "smart_lock_install",
  },
];

const BOOKING_HREF: Record<MaServiceSlug, string> = {
  "emergency-locksmith": "/book",
  "house-lockout": "/book/details?service_id=home_lockout_day",
  "car-lockout": "/book/details?service_id=car_lockout_at_property",
  "rekey-locks": "/book/details?service_id=standard_rekey",
  "lock-change": "/book/details?service_id=standard_lock_change",
  "smart-lock-installation": "/book/details?service_id=smart_lock_install",
};

function cityServiceHref(city: MaCity, slug: MaServiceSlug) {
  return city.services.includes(slug) ? `/${city.slug}/${slug}` : BOOKING_HREF[slug];
}

function cityBySlug(slug: string) {
  return MA_CITIES.find((city) => city.slug === slug);
}

function PriceCards({ service }: { service: MaServiceContent }) {
  const rows = service.serviceIds
    .map((id) => getServiceMenuItem(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <div className={`grid gap-4 ${rows.length > 1 ? "md:grid-cols-3" : "max-w-xl"}`}>
      {rows.map((item) => (
        <div key={item.id} className="rounded-[22px] border border-sky/15 bg-ink/28 p-5">
          <div className="font-mono text-[10px] uppercase tracking-[.14em] text-parchment-dim">{item.timing}</div>
          <div className="mt-3 flex items-end justify-between gap-4">
            <div className="font-display text-xl text-parchment">{item.title}</div>
            <div className="font-display text-4xl text-brass">{formatServicePrice(item.customerPriceCents)}</div>
          </div>
          <p className="mt-3 text-sm leading-6 text-parchment-dim">Standard total · provider travel/service call included.</p>
        </div>
      ))}
    </div>
  );
}

function TrustStrip() {
  return (
    <section className="border-b border-line/70 bg-surface/55">
      <div className="mx-auto grid max-w-[1400px] gap-5 px-6 py-6 sm:grid-cols-3 sm:px-8 lg:px-10">
        {[
          ["Vetted local providers", "Provider information is reviewed before network activation"],
          ["Price shown upfront", "See the standard total before you request service"],
          ["Extras need approval", "Additional work is priced and approved before it starts"],
        ].map(([title, body]) => (
          <div key={title}>
            <div className="text-sm font-semibold text-parchment">{title}</div>
            <div className="mt-1 text-sm text-parchment-dim">{body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function NearbyCities({ city }: { city: MaCity }) {
  const nearby = city.nearby.map(cityBySlug).filter((item): item is MaCity => Boolean(item));
  return (
    <div className="mt-8 border-t border-line/70 pt-6">
      <div className="font-mono text-[10px] uppercase tracking-[.14em] text-parchment-dim">Nearby Massachusetts markets</div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        {nearby.map((item) => (
          <Link key={item.slug} href={`/${item.slug}`} className="font-semibold text-brass hover:underline">
            Locksmith in {item.name} →
          </Link>
        ))}
      </div>
    </div>
  );
}

function LocalAreas({ city }: { city: MaCity }) {
  return (
    <div className="rounded-[24px] border border-[#c7d9ec] bg-white p-6 shadow-[0_18px_50px_rgba(28,65,105,0.08)]">
      <div className="font-mono text-[10px] uppercase tracking-[.14em] text-[#7d6330]">{city.name} area context</div>
      <div className="mt-4 flex flex-wrap gap-2">
        {city.areas.map((area) => (
          <span key={area} className="rounded-full border border-[#c7d9ec] bg-mist px-3 py-1.5 text-sm text-[#46617f]">{area}</span>
        ))}
      </div>
      <p className="mt-4 text-sm leading-6 text-[#536e8a]">Provider availability depends on participating provider service areas and real acceptance of the request.</p>
    </div>
  );
}

export function LocalCityPage({ city }: { city: MaCity }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <section className="border-b border-line/70">
          <div className="mx-auto max-w-[1180px] px-6 py-14 sm:px-8 sm:py-18 lg:px-10 lg:py-20">
            <div className="font-mono text-[11px] uppercase tracking-[.14em] text-brass">Massachusetts · {city.name}</div>
            <h1 className="mt-5 max-w-4xl font-display text-5xl font-medium leading-[.98] tracking-[-.035em] text-parchment sm:text-6xl lg:text-[68px]">
              Locksmith in {city.name}, MA.
              <span className="block italic text-brass">Price first. Provider second.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-parchment-dim">
              Find a trusted local locksmith for lockouts, rekeys, lock changes and smart-lock installation. See the standard total before you request service; provider travel/service call is included in the listed standard price.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/book" className="inline-flex min-h-12 items-center justify-center rounded-full bg-brass px-7 py-3 text-[15px] font-semibold text-ink shadow-[0_10px_28px_rgba(214,173,87,0.16)] transition hover:brightness-110">Find a locksmith</Link>
              <Link href="/services" className="inline-flex min-h-12 items-center justify-center rounded-full border border-sky/30 bg-surface/35 px-7 py-3 text-[15px] font-semibold text-parchment transition hover:border-sky/55">See all prices</Link>
            </div>
          </div>
        </section>

        <TrustStrip />

        <section className="border-b border-[#c7d9ec] bg-mist py-14 text-navy-text sm:py-18">
          <div className="mx-auto grid max-w-[1180px] gap-8 px-6 sm:px-8 lg:grid-cols-[1.15fr_.85fr] lg:px-10">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[.14em] text-[#7d6330]">Local locksmith market</div>
              <h2 className="mt-3 font-display text-4xl tracking-[-.025em]">Locksmith help built around the job, not the search phrase.</h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#46617f]">{city.localContext}</p>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#46617f]">
                Trusted Locksmith is a platform operated by PlanetHike OÜ. Field services are performed by participating independent local providers, and a request is not presented as accepted until a real provider accepts it.
              </p>
            </div>
            <LocalAreas city={city} />
          </div>
        </section>

        <section className="border-b border-line/70 py-16 sm:py-20">
          <div className="mx-auto max-w-[1180px] px-6 sm:px-8 lg:px-10">
            <div className="max-w-2xl">
              <div className="eyebrow">Services in {city.name}</div>
              <h2 className="mt-4 font-display text-4xl tracking-[-.025em] text-parchment sm:text-5xl">Start with the service you actually need.</h2>
              <p className="mt-4 text-base leading-7 text-parchment-dim">Dedicated local pages are created only where current demand justifies them. Other services go straight to the request flow rather than creating thin keyword pages.</p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {SERVICE_CARD_META.map((card) => {
                const item = getServiceMenuItem(card.priceId);
                const dedicated = city.services.includes(card.slug);
                return (
                  <Link key={card.slug} href={cityServiceHref(city, card.slug)} className="group rounded-[24px] border border-sky/15 bg-surface/48 p-6 transition hover:border-brass/45 hover:bg-surface/65">
                    <div className="flex items-start justify-between gap-4">
                      <div className="font-display text-2xl text-parchment">{card.title}</div>
                      {item ? <div className="text-right"><div className="font-mono text-[9px] uppercase tracking-[.12em] text-parchment-dim">{card.priceSuffix}</div><div className="font-display text-3xl text-brass">{formatServicePrice(item.customerPriceCents)}</div></div> : null}
                    </div>
                    <p className="mt-3 text-sm leading-6 text-parchment-dim">{card.body}</p>
                    <div className="mt-5 text-sm font-semibold text-brass">{dedicated ? `${city.name} service details →` : "Request this service →"}</div>
                  </Link>
                );
              })}
            </div>
            <NearbyCities city={city} />
          </div>
        </section>

        <section className="bg-surface/45 py-16">
          <div className="mx-auto max-w-3xl px-6 text-center sm:px-8">
            <div className="eyebrow">Trusted Locksmith · {city.name}</div>
            <h2 className="mt-4 font-display text-4xl tracking-[-.025em] text-parchment">Need a locksmith in {city.name}?</h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-parchment-dim">Choose the job, see the standard total and submit a request. Provider identity and ETA appear only after real acceptance.</p>
            <Link href="/book" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-brass px-7 py-3 text-sm font-semibold text-ink">Find a locksmith</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export function LocalServicePage({ city, service }: { city: MaCity; service: MaServiceContent }) {
  const localNote = city.serviceNotes[service.slug];
  const otherServices = city.services.filter((slug) => slug !== service.slug);
  const bookingHref = BOOKING_HREF[service.slug];

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <section className="border-b border-line/70">
          <div className="mx-auto max-w-[1180px] px-6 py-14 sm:px-8 sm:py-18 lg:px-10 lg:py-20">
            <div className="flex flex-wrap items-center gap-2 text-xs text-parchment-dim">
              <Link href="/" className="hover:text-parchment">Home</Link><span>/</span>
              <Link href={`/${city.slug}`} className="hover:text-parchment">{city.name}, MA</Link><span>/</span>
              <span className="text-brass">{service.shortTitle}</span>
            </div>
            <div className="mt-7 font-mono text-[11px] uppercase tracking-[.14em] text-brass">{service.eyebrow} · {city.name}, MA</div>
            <h1 className="mt-5 max-w-4xl font-display text-5xl font-medium leading-[.98] tracking-[-.035em] text-parchment sm:text-6xl lg:text-[68px]">{service.title(city.name)}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-parchment-dim">{service.description(city.name)}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={bookingHref} className="inline-flex min-h-12 items-center justify-center rounded-full bg-brass px-7 py-3 text-[15px] font-semibold text-ink shadow-[0_10px_28px_rgba(214,173,87,0.16)] transition hover:brightness-110">Request this service</Link>
              <Link href={`/${city.slug}`} className="inline-flex min-h-12 items-center justify-center rounded-full border border-sky/30 bg-surface/35 px-7 py-3 text-[15px] font-semibold text-parchment transition hover:border-sky/55">All {city.name} locksmith services</Link>
            </div>
          </div>
        </section>

        <TrustStrip />

        <section className="border-b border-line/70 py-16 sm:py-20">
          <div className="mx-auto max-w-[1180px] px-6 sm:px-8 lg:px-10">
            <div className="eyebrow">Published standard pricing</div>
            <h2 className="mt-4 font-display text-4xl tracking-[-.025em] text-parchment sm:text-5xl">Know the standard total before the request.</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-parchment-dim">The listed total includes the provider travel/service call for the standard scope. Additional work or hardware is separate only where applicable and requires approval before it starts.</p>
            <div className="mt-8"><PriceCards service={service} /></div>
          </div>
        </section>

        <section className="border-b border-[#c7d9ec] bg-mist py-16 text-navy-text">
          <div className="mx-auto grid max-w-[1180px] gap-8 px-6 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:px-10">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[.14em] text-[#7d6330]">Why this page exists</div>
              <h2 className="mt-3 font-display text-4xl tracking-[-.025em]">A distinct {service.shortTitle.toLowerCase()} need in {city.name}.</h2>
              <p className="mt-5 text-base leading-7 text-[#46617f]">{localNote ?? city.localContext}</p>
              <p className="mt-4 text-base leading-7 text-[#46617f]">{service.intent}</p>
            </div>
            <LocalAreas city={city} />
          </div>
        </section>

        <section className="border-b border-line/70 py-16">
          <div className="mx-auto grid max-w-[1180px] gap-10 px-6 sm:px-8 lg:grid-cols-2 lg:px-10">
            <div>
              <div className="eyebrow">Standard scope</div>
              <h2 className="mt-4 font-display text-3xl text-parchment">What the standard service covers</h2>
              <ul className="mt-6 space-y-4">
                {service.scopeBullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3 text-sm leading-6 text-parchment-dim"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />{bullet}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="eyebrow">Request flow</div>
              <h2 className="mt-4 font-display text-3xl text-parchment">No fictional dispatch status.</h2>
              <div className="mt-6 divide-y divide-line/70 border-y border-line/70">
                {[
                  ["01", "Choose the service", "Start with the standard scope and price that fits the problem."],
                  ["02", "Submit the location", `Provide the ${city.name} service location and request details needed for routing.`],
                  ["03", "Provider accepts", "A participating independent provider decides whether to accept the request."],
                  ["04", "See real provider details", "Provider identity and ETA are shown only after acceptance."],
                ].map(([n, title, body]) => (
                  <div key={n} className="grid grid-cols-[42px_1fr] gap-3 py-4"><div className="font-mono text-xs text-brass">{n}</div><div><div className="font-semibold text-parchment">{title}</div><div className="mt-1 text-sm leading-6 text-parchment-dim">{body}</div></div></div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-line/70 bg-surface/45 py-16">
          <div className="mx-auto max-w-[900px] px-6 sm:px-8">
            <div className="eyebrow">Questions</div>
            <h2 className="mt-4 font-display text-4xl text-parchment">{service.shortTitle} in {city.name}: what to know</h2>
            <div className="mt-7 divide-y divide-line/70 border-y border-line/70">
              {service.faq.map((item) => (
                <div key={item.q} className="py-5"><h3 className="font-semibold text-parchment">{item.q}</h3><p className="mt-2 text-sm leading-6 text-parchment-dim">{item.a}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-[1180px] px-6 sm:px-8 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
              <div>
                <div className="eyebrow">More in {city.name}</div>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm">
                  <Link href={`/${city.slug}`} className="font-semibold text-brass hover:underline">All {city.name} services →</Link>
                  {otherServices.map((slug) => (
                    <Link key={slug} href={`/${city.slug}/${slug}`} className="font-semibold text-brass hover:underline">{MA_SERVICE_CONTENT[slug].shortTitle} →</Link>
                  ))}
                </div>
              </div>
              <NearbyCities city={city} />
            </div>
            <div className="mt-12 rounded-[28px] border border-brass/25 bg-brass/[.07] px-6 py-8 sm:px-8">
              <div className="font-display text-3xl text-parchment">Need {service.shortTitle.toLowerCase()} help in {city.name}?</div>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-parchment-dim">See the standard scope and price first. Submitting a request does not claim a provider has accepted until a real provider does.</p>
              <Link href={bookingHref} className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-brass px-6 py-2.5 text-sm font-semibold text-ink">Request this service</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
