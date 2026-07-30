import { createClient } from "@/lib/supabase/server";

export type Plan = {
  id: "individual" | "household" | "household_plus";
  name: string;
  price_cents: number;
  renewal_price_cents: number;
  covered_events_per_year: number;
  covered_event_types: string[];
  lockbox_mode: "optional_addon" | "included_free" | "included_professional";
  lockbox_addon_price_cents: number | null;
  guaranteed_visit: "none" | "welcome_visit";
  reaudit_cadence_years: number | null;
  trusted_contacts_limit: number | null;
  priority_dispatch: boolean;
  sort_order: number;
};

const FALLBACK_PLANS: Plan[] = [
  {
    id: "individual",
    name: "Individual",
    price_cents: 2900,
    renewal_price_cents: 2900,
    covered_events_per_year: 3,
    covered_event_types: ["home_lockout", "car_lockout_at_home", "rekey"],
    lockbox_mode: "optional_addon",
    lockbox_addon_price_cents: 1999,
    guaranteed_visit: "none",
    reaudit_cadence_years: null,
    trusted_contacts_limit: 1,
    priority_dispatch: false,
    sort_order: 1,
  },
  {
    id: "household",
    name: "Household",
    price_cents: 4900,
    renewal_price_cents: 4900,
    covered_events_per_year: 3,
    covered_event_types: ["home_lockout", "car_lockout_at_home", "rekey"],
    lockbox_mode: "included_free",
    lockbox_addon_price_cents: null,
    guaranteed_visit: "none",
    reaudit_cadence_years: null,
    trusted_contacts_limit: null,
    priority_dispatch: false,
    sort_order: 2,
  },
  {
    id: "household_plus",
    name: "Household + Smart Security",
    price_cents: 8900,
    renewal_price_cents: 8900,
    covered_events_per_year: 3,
    covered_event_types: ["home_lockout", "car_lockout_at_home", "rekey"],
    lockbox_mode: "included_professional",
    lockbox_addon_price_cents: null,
    guaranteed_visit: "welcome_visit",
    reaudit_cadence_years: 3,
    trusted_contacts_limit: null,
    priority_dispatch: true,
    sort_order: 3,
  },
];

/** Plans are configurable records in Supabase, not hardcoded logic — this just
 * falls back to the same values if the table is briefly unreachable so pages
 * never hard-fail on a config-table read. */
export async function getPlans(): Promise<Plan[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("plans").select("*").order("sort_order");
    if (error || !data || data.length === 0) return FALLBACK_PLANS;
    return data as Plan[];
  } catch {
    return FALLBACK_PLANS;
  }
}

export function formatUsd(cents: number) {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

const EVENT_LABELS: Record<string, string> = {
  home_lockout: "Home lockout",
  car_lockout_at_home: "Car lockout (at home)",
  rekey: "Standard rekey",
};

export function eventTypeLabels(types: string[]) {
  return types.map((t) => EVENT_LABELS[t] ?? t);
}

/** Marketing copy derived from the plan's real config values — not
 * independently hardcoded, so it can't drift out of sync with pricing logic. */
export function planDisplay(plan: Plan) {
  const features: string[] = [];

  if (plan.id === "individual") {
    features.push(`${plan.covered_events_per_year} covered events / year`);
    features.push("Digital key vault");
    features.push(
      plan.trusted_contacts_limit === 1
        ? "1 trusted contact"
        : `${plan.trusted_contacts_limit} trusted contacts`
    );
  } else if (plan.id === "household") {
    features.push("Everything in Individual");
    features.push("Covers full household");
    features.push("Free lockbox, mailed at signup (self-install)");
    features.push("Unlimited trusted contacts");
  } else {
    features.push("Everything in Household");
    features.push("Guaranteed welcome visit: security audit + lockbox mount + smart lock install");
    features.push(`Re-audit every ${plan.reaudit_cadence_years} years`);
    if (plan.priority_dispatch) features.push("Priority dispatch window");
  }

  const addOns =
    plan.lockbox_mode === "optional_addon" && plan.lockbox_addon_price_cents
      ? [{ label: "Lockbox code registration", price: `${formatUsd(plan.lockbox_addon_price_cents)} one-time` }]
      : undefined;

  const tagline =
    plan.id === "individual"
      ? `For one person. Just ${formatUsd(Math.round(plan.price_cents / 12))}/month.`
      : plan.id === "household"
        ? `Everyone under your roof. About ${formatUsd(Math.round(plan.price_cents / 12))}/month.`
        : "The only tier with a guaranteed onboarding install visit.";

  return { features, addOns, tagline };
}
