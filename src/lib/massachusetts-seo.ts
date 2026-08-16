export type MaServiceSlug =
  | "emergency-locksmith"
  | "car-lockout"
  | "house-lockout"
  | "rekey-locks"
  | "lock-change"
  | "smart-lock-installation";

export type MaCity = {
  slug: string;
  name: string;
  areas: string[];
  localContext: string;
  nearby: string[];
  services: MaServiceSlug[];
  serviceNotes: Partial<Record<MaServiceSlug, string>>;
  marketSignals: {
    population2024: number;
    locksmithNearMeMonthly: number;
    locksmithNearMeCpc: number;
  };
};

export type MaServiceContent = {
  slug: MaServiceSlug;
  eyebrow: string;
  title: (city: string) => string;
  shortTitle: string;
  description: (city: string) => string;
  intent: string;
  serviceIds: string[];
  scopeBullets: string[];
  faq: Array<{ q: string; a: string }>;
};

export const MA_SERVICE_CONTENT: Record<MaServiceSlug, MaServiceContent> = {
  "emergency-locksmith": {
    slug: "emergency-locksmith",
    eyebrow: "Urgent locksmith help",
    title: (city) => `Emergency locksmith help in ${city}`,
    shortTitle: "Emergency locksmith",
    description: (city) =>
      `Need urgent locksmith help in ${city}, MA? See standard lockout prices before you request a vetted local provider. No invented dispatch or ETA.`,
    intent: "Urgent access problems where the customer needs a real provider quickly but still wants the price and scope clear before service starts.",
    serviceIds: ["home_lockout_day", "home_lockout_evening_weekend", "home_lockout_overnight_holiday"],
    scopeBullets: [
      "Standard residential lockout entry",
      "Weekday, evening/weekend and overnight/holiday pricing",
      "Provider travel/service call included in the published total",
      "Any destructive entry, replacement hardware or other out-of-scope work requires a separate price and approval",
    ],
    faq: [
      { q: "Is an emergency request a confirmed booking?", a: "No. Trusted Locksmith creates a service request and shows provider identity or ETA only after an independent local provider actually accepts it." },
      { q: "Is the travel or service-call fee extra?", a: "No. The published standard total includes the provider travel/service call for the listed scope." },
      { q: "Can the price change at the door?", a: "The standard scope stays at the published total. If the job requires excluded work or hardware, the additional price must be shown and approved before that work starts." },
    ],
  },
  "car-lockout": {
    slug: "car-lockout",
    eyebrow: "Vehicle access",
    title: (city) => `Car lockout locksmith in ${city}`,
    shortTitle: "Car lockout",
    description: (city) =>
      `Locked out of a car in ${city}, MA? Trusted Locksmith publishes the standard vehicle-entry price before you request a local provider.`,
    intent: "Vehicle lockout searches, including car locksmith, auto locksmith, locked-out-of-car and emergency car-locksmith intent.",
    serviceIds: ["car_lockout_at_property"],
    scopeBullets: [
      "Standard vehicle entry at the service property",
      "Provider travel/service call included",
      "Key cutting and key programming are not included",
      "High-security vehicle systems and damage repair are outside the standard scope",
    ],
    faq: [
      { q: "Does this include replacement car keys?", a: "No. The launch service is standard vehicle entry. Key cutting, key-fob replacement and programming are not included in the published car-lockout price." },
      { q: "Do I know the price before requesting service?", a: "Yes. The standard vehicle-entry total is shown before the request is submitted." },
      { q: "Will I see a provider and ETA immediately?", a: "Only after a participating independent provider accepts the request. Trusted Locksmith does not invent provider or dispatch status." },
    ],
  },
  "house-lockout": {
    slug: "house-lockout",
    eyebrow: "Residential lockout",
    title: (city) => `House lockout locksmith in ${city}`,
    shortTitle: "House lockout",
    description: (city) =>
      `Locked out of a home in ${city}, MA? Compare weekday, evening/weekend and overnight lockout prices before requesting a provider.`,
    intent: "Residential lockout searches from people locked out of a house, apartment or condo.",
    serviceIds: ["home_lockout_day", "home_lockout_evening_weekend", "home_lockout_overnight_holiday"],
    scopeBullets: [
      "Standard residential entry for a house, apartment or condo",
      "Price tier is based on the service window",
      "Provider travel/service call included",
      "Destructive entry, repairs, high-security hardware and replacement hardware are excluded from the standard entry price",
    ],
    faq: [
      { q: "What does a standard home lockout cover?", a: "It covers standard residential entry and the provider travel/service call. Destructive entry, repair work and replacement hardware are outside the standard scope." },
      { q: "Why are there different lockout prices?", a: "Trusted Locksmith publishes separate standard totals for weekday daytime, evening/weekend and overnight/major-holiday service windows." },
      { q: "Can I use Trusted Locksmith without membership?", a: "Yes. One-off locksmith service is available without a Trusted Locksmith membership." },
    ],
  },
  "rekey-locks": {
    slug: "rekey-locks",
    eyebrow: "Scheduled locksmith service",
    title: (city) => `Rekey locks in ${city}`,
    shortTitle: "Rekey locks",
    description: (city) =>
      `Need locks rekeyed in ${city}, MA? See the standard first-cylinder price and additional-cylinder pricing before requesting service.`,
    intent: "Planned rekey searches after a move, tenant turnover, lost keys or a change in who should have access.",
    serviceIds: ["standard_rekey"],
    scopeBullets: [
      "Provider travel/service call plus the first standard cylinder rekey",
      "Additional standard cylinders are $29 each",
      "Specialty and high-security cylinders require separate pricing",
      "Any additional price is shown for approval before the extra work",
    ],
    faq: [
      { q: "Should I rekey or replace the lock?", a: "Rekeying changes which key operates an existing compatible lock. A lock change replaces the hardware. The right choice depends on the condition and type of the existing lock." },
      { q: "Is more than one cylinder included?", a: "The standard rekey price includes the first standard cylinder. Additional standard cylinders are $29 each." },
      { q: "Is hardware included?", a: "A standard rekey normally uses the existing compatible hardware. Specialty or high-security components are outside the standard scope and require separate approval." },
    ],
  },
  "lock-change": {
    slug: "lock-change",
    eyebrow: "Residential lock replacement",
    title: (city) => `Lock change service in ${city}`,
    shortTitle: "Lock change",
    description: (city) =>
      `Replace a standard residential lock in ${city}, MA with published labor pricing. Hardware is priced separately and approved before installation.`,
    intent: "Planned lock replacement after a move, damaged hardware, security change or upgrade.",
    serviceIds: ["standard_lock_change"],
    scopeBullets: [
      "Provider travel/service call and labor for one standard residential lock replacement",
      "Replacement hardware is separate",
      "Hardware price must be shown and approved before installation",
      "Door modification and other out-of-scope repairs require separate approval",
    ],
    faq: [
      { q: "Is the new lock included in the published price?", a: "No. The published standard lock-change total covers provider travel/service call and labor for one standard residential lock replacement. Hardware is separate." },
      { q: "Will I approve the hardware price first?", a: "Yes. The hardware or other additional work must be priced and approved before installation." },
      { q: "Can I request a rekey instead?", a: "Yes. If the existing hardware is suitable and you only need different keys to operate it, rekeying may be the more appropriate service." },
    ],
  },
  "smart-lock-installation": {
    slug: "smart-lock-installation",
    eyebrow: "Smart access",
    title: (city) => `Smart lock installation in ${city}`,
    shortTitle: "Smart lock installation",
    description: (city) =>
      `Install and set up a compatible customer-supplied smart lock in ${city}, MA with the standard labor price shown before you request service.`,
    intent: "Planned smart-lock installation for customers who already have compatible hardware and want professional installation and setup.",
    serviceIds: ["smart_lock_install"],
    scopeBullets: [
      "Provider travel/service call and labor for one compatible customer-supplied smart lock",
      "Basic installation and setup included",
      "Hardware is not included",
      "Door modification, electrical work and network troubleshooting are outside the standard scope",
    ],
    faq: [
      { q: "Do I need to buy the smart lock first?", a: "Yes. The standard launch service is for installation and setup of one compatible customer-supplied smart lock." },
      { q: "Does the price include door modification?", a: "No. Door modification, electrical work and other out-of-scope work require separate pricing and approval." },
      { q: "Can Digital Access be used with a smart lock?", a: "Digital Access can help you keep recovery instructions, codes and trusted-access information organized for the property." },
    ],
  },
};

export const MA_CITIES: MaCity[] = [
  {
    slug: "boston-ma",
    name: "Boston",
    areas: ["Back Bay", "Beacon Hill", "South End", "Fenway", "Jamaica Plain", "Dorchester", "South Boston", "Charlestown", "East Boston", "Allston-Brighton"],
    localContext: "Boston combines apartments, condos, brownstones, multifamily homes and mixed-use buildings, so locksmith requests range from immediate residential lockouts to scheduled rekeys and lock upgrades.",
    nearby: ["cambridge-ma", "somerville-ma", "brookline-ma", "quincy-ma"],
    services: ["emergency-locksmith", "car-lockout", "house-lockout", "rekey-locks", "lock-change", "smart-lock-installation"],
    serviceNotes: {
      "emergency-locksmith": "In Boston, urgent access requests often start with a simple question: who can actually accept the job, and what will it cost? This page keeps those two questions separate from marketing claims by showing the standard scope first and provider details only after acceptance.",
      "car-lockout": "Boston vehicle lockouts can happen at homes, apartment properties and residential parking areas. The launch service is deliberately narrow: standard vehicle entry at the service property, not a promise of key cutting or programming.",
      "house-lockout": "From apartment buildings in Back Bay and Fenway to houses in Jamaica Plain and Dorchester, residential lockouts vary by building but the pricing rule stays simple: the standard entry total is tied to the service window and shown before the request.",
      "rekey-locks": "Boston rekey demand is not only an emergency use case. Moves, tenant changes and changes in key possession make scheduled rekeying a distinct service with a first-cylinder price and clear incremental pricing for additional standard cylinders.",
      "lock-change": "Older and newer Boston properties can have very different hardware. The standard lock-change offer therefore separates labor from replacement hardware rather than hiding hardware inside an uncertain headline price.",
      "smart-lock-installation": "Smart-lock projects in Boston are best handled as planned installations. Trusted Locksmith prices the installation labor for compatible customer-supplied hardware and keeps door modification or network work outside the standard scope.",
    },
    marketSignals: { population2024: 673458, locksmithNearMeMonthly: 1770, locksmithNearMeCpc: 10.14 },
  },
  {
    slug: "cambridge-ma",
    name: "Cambridge",
    areas: ["Harvard Square", "Central Square", "Kendall Square", "Porter Square", "East Cambridge", "Cambridgeport", "North Cambridge"],
    localContext: "Cambridge has a dense mix of apartments, condos, multifamily homes and mixed-use properties around its major squares, making both urgent access and planned key-control work relevant.",
    nearby: ["boston-ma", "somerville-ma", "watertown-ma", "medford-ma"],
    services: ["emergency-locksmith", "car-lockout", "house-lockout", "rekey-locks"],
    serviceNotes: {
      "emergency-locksmith": "Cambridge customers searching urgently still need certainty about scope. The request flow prioritizes a published standard total and waits for a real provider acceptance before presenting dispatch details.",
      "car-lockout": "For Cambridge vehicle lockouts, the standard offer focuses on entry at the service property. That keeps the page aligned with what the provider network can actually fulfill instead of using broader auto-locksmith claims that imply programming or replacement keys.",
      "house-lockout": "Apartments, condos and multifamily homes around Cambridge create many variations of a residential lockout. The page therefore explains standard entry clearly and separates excluded hardware or repair work from the published total.",
      "rekey-locks": "Cambridge moves, roommate changes and property turnover make rekeying a useful planned service. The first standard cylinder is priced upfront, with additional standard cylinders handled transparently rather than through an open-ended quote.",
    },
    marketSignals: { population2024: 121186, locksmithNearMeMonthly: 290, locksmithNearMeCpc: 11.33 },
  },
  {
    slug: "newton-ma",
    name: "Newton",
    areas: ["Newton Centre", "Newtonville", "West Newton", "Auburndale", "Waban", "Nonantum"],
    localContext: "Newton's village-based residential market includes single-family homes, condos and multifamily properties, supporting both urgent lockout demand and higher-value scheduled rekey work.",
    nearby: ["watertown-ma", "waltham-ma", "boston-ma", "cambridge-ma"],
    services: ["emergency-locksmith", "car-lockout", "house-lockout", "rekey-locks"],
    serviceNotes: {
      "emergency-locksmith": "For Newton homeowners and residents, emergency locksmith demand does not justify vague dispatch promises. Trusted Locksmith shows the standard lockout tier first and only shows provider identity or ETA after acceptance.",
      "car-lockout": "Newton car lockouts are treated as a specific vehicle-entry job, not as a catch-all automotive service. That distinction matters because the standard $109 service does not include replacement keys, key cutting or programming.",
      "house-lockout": "Newton's mix of houses, condos and multifamily properties means entry conditions can vary. The standard home-lockout prices cover ordinary residential entry; anything beyond that scope is separately priced before work.",
      "rekey-locks": "Rekeying is especially useful when a Newton household changes occupants or no longer knows who holds old keys. The page makes the cost logic visible before a provider visit: first standard cylinder plus a fixed amount for additional standard cylinders.",
    },
    marketSignals: { population2024: 90700, locksmithNearMeMonthly: 190, locksmithNearMeCpc: 11.57 },
  },
  {
    slug: "somerville-ma",
    name: "Somerville",
    areas: ["Davis Square", "Union Square", "Assembly Square", "Ball Square", "Teele Square", "Winter Hill"],
    localContext: "Somerville's dense apartment, condo and multifamily housing makes residential access problems and key-control changes particularly relevant local locksmith use cases.",
    nearby: ["cambridge-ma", "medford-ma", "boston-ma", "malden-ma"],
    services: ["emergency-locksmith", "house-lockout"],
    serviceNotes: {
      "emergency-locksmith": "In Somerville, an urgent lockout can involve an apartment, condo or multifamily property. The emergency page focuses on the immediate residential entry decision while keeping extras and replacement hardware outside the standard total unless approved.",
      "house-lockout": "Somerville's dense housing means a 'house lockout' search often really means a residential lockout of an apartment or condo. The service page uses residential-entry language rather than assuming a detached house.",
    },
    marketSignals: { population2024: 82149, locksmithNearMeMonthly: 125, locksmithNearMeCpc: 12.02 },
  },
  {
    slug: "medford-ma",
    name: "Medford",
    areas: ["Medford Square", "West Medford", "Wellington", "South Medford", "Lawrence Estates"],
    localContext: "Medford combines residential neighborhoods, multifamily properties and apartment areas, creating a practical mix of immediate lockout and scheduled locksmith demand.",
    nearby: ["somerville-ma", "malden-ma", "cambridge-ma", "revere-ma"],
    services: ["emergency-locksmith", "house-lockout"],
    serviceNotes: {
      "emergency-locksmith": "Medford's comparatively high local locksmith CPC makes price transparency especially important: the customer should see the standard total before becoming committed to a provider visit.",
      "house-lockout": "A Medford residential lockout may involve a house, condo or apartment. Trusted Locksmith keeps the standard entry scope consistent and requires separate approval if the provider discovers a need for destructive entry, repairs or hardware.",
    },
    marketSignals: { population2024: 59898, locksmithNearMeMonthly: 105, locksmithNearMeCpc: 15.07 },
  },
  {
    slug: "watertown-ma",
    name: "Watertown",
    areas: ["Watertown Square", "East Watertown", "Coolidge Square", "West End"],
    localContext: "Watertown is a compact market with homes, apartment buildings and mixed-use corridors, and it over-indexes on locksmith search demand relative to its population.",
    nearby: ["cambridge-ma", "newton-ma", "waltham-ma", "boston-ma"],
    services: ["emergency-locksmith", "house-lockout"],
    serviceNotes: {
      "emergency-locksmith": "Watertown's search intensity makes it worth treating urgent locksmith demand as its own local intent even though the city is much smaller than Boston. The page emphasizes acceptance and price certainty rather than inflated availability claims.",
      "house-lockout": "For Watertown homes and apartments, the residential lockout offer is intentionally simple: select the service window, see the total and submit the request without a separate generic travel fee appearing later.",
    },
    marketSignals: { population2024: 35985, locksmithNearMeMonthly: 80, locksmithNearMeCpc: 7.2 },
  },
  {
    slug: "waltham-ma",
    name: "Waltham",
    areas: ["Waltham Center", "South Side", "Cedarwood", "Warrendale", "Piety Corner"],
    localContext: "Waltham combines established residential neighborhoods, apartments and active business corridors, while current search data shows strong locksmith demand per resident at a comparatively lower CPC.",
    nearby: ["newton-ma", "watertown-ma", "cambridge-ma", "boston-ma"],
    services: ["emergency-locksmith", "house-lockout"],
    serviceNotes: {
      "emergency-locksmith": "Waltham is an efficient local acquisition market because search demand is relatively strong while estimated CPC is lower than several nearby cities. The page converts that intent with a clear scope and standard price rather than a discount-led message.",
      "house-lockout": "Waltham residential customers can compare the three home-lockout service windows before requesting a provider. The pricing model avoids adding a generic travel fee after the customer has already committed.",
    },
    marketSignals: { population2024: 65849, locksmithNearMeMonthly: 125, locksmithNearMeCpc: 5.19 },
  },
  {
    slug: "quincy-ma",
    name: "Quincy",
    areas: ["Quincy Center", "North Quincy", "Wollaston", "Squantum", "Marina Bay", "Houghs Neck"],
    localContext: "Quincy is a large South Shore city with condos, multifamily properties and single-family neighborhoods; its locksmith search volume is lower per resident but current CPC is comparatively high.",
    nearby: ["boston-ma", "braintree-ma", "chelsea-ma", "revere-ma"],
    services: ["emergency-locksmith"],
    serviceNotes: {
      "emergency-locksmith": "Quincy's higher estimated CPC indicates that urgent locksmith clicks are commercially contested. Trusted Locksmith's angle is therefore not 'cheap'; it is a standard total shown before the request and extra work that requires approval.",
    },
    marketSignals: { population2024: 103434, locksmithNearMeMonthly: 80, locksmithNearMeCpc: 16.56 },
  },
  {
    slug: "lynn-ma",
    name: "Lynn",
    areas: ["Central Lynn", "Diamond District", "East Lynn", "West Lynn"],
    localContext: "Lynn's city page consolidates urgent and planned locksmith intent into one useful local resource while the market builds enough search and conversion data to justify separate service pages.",
    nearby: ["revere-ma", "malden-ma", "chelsea-ma", "medford-ma"],
    services: [],
    serviceNotes: {},
    marketSignals: { population2024: 103489, locksmithNearMeMonthly: 80, locksmithNearMeCpc: 11.41 },
  },
  {
    slug: "malden-ma",
    name: "Malden",
    areas: ["Malden Center", "Oak Grove", "Maplewood", "Edgeworth", "Forestdale"],
    localContext: "Malden's initial page covers the full locksmith proposition in one place rather than splitting modest local demand into multiple near-duplicate service pages.",
    nearby: ["medford-ma", "somerville-ma", "revere-ma", "chelsea-ma"],
    services: [],
    serviceNotes: {},
    marketSignals: { population2024: 66693, locksmithNearMeMonthly: 65, locksmithNearMeCpc: 8.78 },
  },
  {
    slug: "revere-ma",
    name: "Revere",
    areas: ["Revere Beach", "Beachmont", "Point of Pines", "West Revere"],
    localContext: "Revere's launch page keeps emergency, residential and scheduled locksmith options together until local search data supports a stronger case for dedicated service pages.",
    nearby: ["chelsea-ma", "malden-ma", "lynn-ma", "boston-ma"],
    services: [],
    serviceNotes: {},
    marketSignals: { population2024: 60702, locksmithNearMeMonthly: 50, locksmithNearMeCpc: 8.49 },
  },
  {
    slug: "braintree-ma",
    name: "Braintree",
    areas: ["Braintree Center", "South Braintree", "Braintree Highlands", "East Braintree"],
    localContext: "Braintree currently has lower local locksmith search volume but high estimated CPC, so one strong city page is preferable to fragmenting demand across thin service pages.",
    nearby: ["quincy-ma", "boston-ma", "newton-ma", "waltham-ma"],
    services: [],
    serviceNotes: {},
    marketSignals: { population2024: 39134, locksmithNearMeMonthly: 35, locksmithNearMeCpc: 16.57 },
  },
  {
    slug: "chelsea-ma",
    name: "Chelsea",
    areas: ["Bellingham Square", "Admirals Hill", "Cary Square", "Prattville"],
    localContext: "Chelsea's estimated CPC is unusually high relative to its current search volume, so the launch strategy uses one comprehensive city page and waits for conversion data before creating narrower service pages.",
    nearby: ["boston-ma", "revere-ma", "malden-ma", "lynn-ma"],
    services: [],
    serviceNotes: {},
    marketSignals: { population2024: 40245, locksmithNearMeMonthly: 30, locksmithNearMeCpc: 28.06 },
  },
];

export function getMaCity(slug: string) {
  return MA_CITIES.find((city) => city.slug === slug);
}

export function getMaService(slug: string) {
  return MA_SERVICE_CONTENT[slug as MaServiceSlug];
}

export function cityHasService(city: MaCity, service: MaServiceSlug) {
  return city.services.includes(service);
}

export const MA_LOCAL_ROUTES = MA_CITIES.flatMap((city) => [
  `/${city.slug}`,
  ...city.services.map((service) => `/${city.slug}/${service}`),
]);

export const MA_LOCAL_PAGE_COUNT = MA_LOCAL_ROUTES.length;
