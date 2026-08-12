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
  included_audit_interval_years?: number | null;
  field_benefits_wait_days?: number;
  digital_sentinel_enabled?: boolean;
  trusted_contacts_limit: number | null;
  priority_dispatch: boolean;
  sort_order: number;
};

const FALLBACK_PLANS: Plan[] = [
  {
    id: "individual", name: "Individual", price_cents: 2900, renewal_price_cents: 2900,
    covered_events_per_year: 0, covered_event_types: [], travel_fee_waivers_per_year: 0,
    lockbox_mode: "optional_addon", lockbox_addon_price_cents: 1999,
    guaranteed_visit: "none", reaudit_cadence_years: null, included_audit_interval_years: null,
    field_benefits_wait_days: 14, digital_sentinel_enabled: true, trusted_contacts_limit: 1,
    priority_dispatch: false, sort_order: 1,
  },
  {
    id: "household", name: "Household", price_cents: 4900, renewal_price_cents: 4900,
    covered_events_per_year: 0, covered_event_types: [], travel_fee_waivers_per_year: 0,
    lockbox_mode: "included_free", lockbox_addon_price_cents: null,
    guaranteed_visit: "none", reaudit_cadence_years: null, included_audit_interval_years: null,
    field_benefits_wait_days: 14, digital_sentinel_enabled: true, trusted_contacts_limit: null,
    priority_dispatch: false, sort_order: 2,
  },
  {
    id: "household_plus", name: "Household +", price_cents: 8900, renewal_price_cents: 8900,
    covered_events_per_year: 0, covered_event_types: [], travel_fee_waivers_per_year: 0,
    lockbox_mode: "included_free", lockbox_addon_price_cents: null,
    guaranteed_visit: "none", reaudit_cadence_years: 3, included_audit_interval_years: 3,
    field_benefits_wait_days: 14, digital_sentinel_enabled: true, trusted_contacts_limit: null,
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
  const features: string[] = [];

  if (plan.id === "individual") {
    features.push("Digital Sentinel for access details, instructions and photos");
    features.push("1 trusted key holder / emergency contact");
    features.push("Fixed all-in Keepwell service prices");
    features.push("Field-service benefits begin after 14 days");
  } else if (plan.id === "household") {
    features.push("Everything in Individual");
    features.push("Household access profiles");
    features.push("Unlimited trusted contacts and key holders");
    features.push("Self-install lockbox support");
    features.push("Field-service benefits begin after 14 days");
  } else {
    features.push("Everything in Household");
    features.push("Priority provider matching when supply is available");
    features.push("1 included Lock & Access Audit every 3 years");
    features.push("First audit can take place after the 14-day waiting period");
    features.push("Audit provider reports to Keepwell; Keepwell issues any follow-up offer");
  }

  const addOns = plan.lockbox_mode === "optional_addon" && plan.lockbox_addon_price_cents
    ? [{ label: "Optional lockbox", price: `${formatUsd(plan.lockbox_addon_price_cents)} one-time` }]
    : undefined;

  const tagline = plan.id === "individual"
    ? "Prepared access for one person."
    : plan.id === "household"
      ? "Shared access readiness for the household."
      : "Digital access readiness plus a professional audit every three years.";

  return { features, addOns, tagline };
}
