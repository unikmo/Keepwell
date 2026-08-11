import { createClient } from "@/lib/supabase/server";

export type Plan = {
  id: "individual" | "household" | "household_plus";
  name: string;
  price_cents: number;
  renewal_price_cents: number;
  covered_events_per_year: number;
  covered_event_types: string[];
  travel_fee_waivers_per_year?: number;
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
    id: "individual", name: "Individual", price_cents: 2900, renewal_price_cents: 2900,
    covered_events_per_year: 0, covered_event_types: [], travel_fee_waivers_per_year: 1,
    lockbox_mode: "optional_addon", lockbox_addon_price_cents: 1999,
    guaranteed_visit: "none", reaudit_cadence_years: null, trusted_contacts_limit: 1,
    priority_dispatch: false, sort_order: 1,
  },
  {
    id: "household", name: "Household", price_cents: 4900, renewal_price_cents: 4900,
    covered_events_per_year: 0, covered_event_types: [], travel_fee_waivers_per_year: 1,
    lockbox_mode: "included_free", lockbox_addon_price_cents: null,
    guaranteed_visit: "none", reaudit_cadence_years: null, trusted_contacts_limit: null,
    priority_dispatch: false, sort_order: 2,
  },
  {
    id: "household_plus", name: "Household + Priority", price_cents: 8900, renewal_price_cents: 8900,
    covered_events_per_year: 0, covered_event_types: [], travel_fee_waivers_per_year: 2,
    lockbox_mode: "included_free", lockbox_addon_price_cents: null,
    guaranteed_visit: "none", reaudit_cadence_years: null, trusted_contacts_limit: null,
    priority_dispatch: true, sort_order: 3,
  },
];

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

export function planDisplay(plan: Plan) {
  const waivers = plan.travel_fee_waivers_per_year ?? (plan.id === "household_plus" ? 2 : 1);
  const features: string[] = [];

  if (plan.id === "individual") {
    features.push(`${waivers} × $25 provider travel fee waived / year`);
    features.push("Property access inventory");
    features.push("1 trusted contact");
  } else if (plan.id === "household") {
    features.push("Everything in Individual");
    features.push("Covers the registered household");
    features.push(`${waivers} × $25 provider travel fee waived / year`);
    features.push("Free lockbox, mailed at signup (self-install)");
    features.push("Unlimited trusted contacts");
  } else {
    features.push("Everything in Household");
    features.push(`${waivers} × $25 provider travel fees waived / year`);
    if (plan.priority_dispatch) features.push("Priority matching when providers are available");
    features.push("No surprise service-call surcharge");
  }

  const addOns = plan.lockbox_mode === "optional_addon" && plan.lockbox_addon_price_cents
    ? [{ label: "Optional lockbox", price: `${formatUsd(plan.lockbox_addon_price_cents)} one-time` }]
    : undefined;

  const tagline = plan.id === "individual"
    ? "Prepared access for one person."
    : plan.id === "household"
      ? "Shared access readiness for the household."
      : "More travel-fee coverage plus priority matching.";

  return { features, addOns, tagline };
}
