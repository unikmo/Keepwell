export type ServiceMenuItem = {
  id: string;
  jobType: "lockout" | "rekey" | "lock_upgrade";
  title: string;
  timing: string;
  /** Legacy-compatible field: now equals the all-in customer price. */
  servicePriceCents: number;
  /** Kept for compatibility only. Customer pricing no longer separates travel. */
  travelFeeCents: number;
  /** One all-in standard price shown to the customer. */
  customerPriceCents: number;
  /** Legacy-compatible field: now equals the complete provider payout. */
  providerServicePayoutCents: number;
  /** Complete fixed payout shown to the provider before acceptance. */
  providerPayoutCents: number;
  scope: string;
  memberNote: string;
};

function allIn(item: {
  id: ServiceMenuItem["id"];
  jobType: ServiceMenuItem["jobType"];
  title: string;
  timing: string;
  customerPriceCents: number;
  providerPayoutCents: number;
  scope: string;
  memberNote?: string;
}): ServiceMenuItem {
  return {
    ...item,
    servicePriceCents: item.customerPriceCents,
    travelFeeCents: 0,
    providerServicePayoutCents: item.providerPayoutCents,
    memberNote: item.memberNote ?? "All-in standard price. Provider travel/service call is included.",
  };
}

/**
 * Boston launch menu.
 * Customer prices are deliberately positioned below credible published all-in
 * starting prices for comparable standard work. Provider payouts are complete
 * job payouts; Keepwell supplies the ready-to-buy lead and marketplace flow.
 */
export const SERVICE_MENU: ServiceMenuItem[] = [
  allIn({
    id: "home_lockout_day",
    jobType: "lockout",
    title: "Home lockout",
    timing: "Weekdays, 8am–6pm",
    customerPriceCents: 9900,
    providerPayoutCents: 6000,
    scope: "Standard residential entry. Provider travel/service call is included. Destructive entry, high-security hardware, repairs, and replacement hardware are excluded.",
  }),
  allIn({
    id: "home_lockout_evening_weekend",
    jobType: "lockout",
    title: "Home lockout",
    timing: "Evenings 6pm–11pm & weekends",
    customerPriceCents: 12900,
    providerPayoutCents: 6500,
    scope: "Standard residential entry. Provider travel/service call is included. Destructive entry, high-security hardware, repairs, and replacement hardware are excluded.",
  }),
  allIn({
    id: "home_lockout_overnight_holiday",
    jobType: "lockout",
    title: "Home lockout",
    timing: "11pm–8am & major holidays",
    customerPriceCents: 13900,
    providerPayoutCents: 7800,
    scope: "Standard residential entry. Provider travel/service call is included. Destructive entry, high-security hardware, repairs, and replacement hardware are excluded.",
    memberNote: "All-in standard price. Overnight/holiday provider payout is higher to support acceptance outside normal hours.",
  }),
  allIn({
    id: "car_lockout_at_property",
    jobType: "lockout",
    title: "Car lockout at the property",
    timing: "Standard service window",
    customerPriceCents: 10900,
    providerPayoutCents: 6000,
    scope: "Standard vehicle entry at the service property. Provider travel/service call is included. Key cutting, programming, high-security systems, and damage repair are excluded.",
  }),
  allIn({
    id: "standard_rekey",
    jobType: "rekey",
    title: "Standard rekey",
    timing: "Scheduled service",
    customerPriceCents: 7500,
    providerPayoutCents: 5500,
    scope: "Provider travel/service call plus the first standard cylinder rekey. Additional standard cylinders are $29 each. Specialty/high-security cylinders require approval before work.",
  }),
  allIn({
    id: "standard_lock_change",
    jobType: "lock_upgrade",
    title: "Standard lock change",
    timing: "Scheduled service",
    customerPriceCents: 8900,
    providerPayoutCents: 6000,
    scope: "Provider travel/service call and labor for one standard residential lock replacement. Hardware is separate and must be priced and approved before installation.",
  }),
  allIn({
    id: "smart_lock_install",
    jobType: "lock_upgrade",
    title: "Smart lock installation",
    timing: "Scheduled service",
    customerPriceCents: 12900,
    providerPayoutCents: 7000,
    scope: "Provider travel/service call and labor to install/setup one compatible customer-supplied smart lock. Hardware, door modification, electrical work, network troubleshooting, or work outside the provider's verified scope are separate.",
  }),
];

export const LOCK_AUDIT = {
  id: "lock_access_audit",
  title: "Lock & Access Audit",
  customerPriceCents: 8900,
  providerPayoutCents: 5200,
  scope: "Scheduled inspection and standardized report only. The provider does not quote or sell remedial work during the visit. Keepwell issues any official follow-up offer after reviewing the report.",
};

export function getServiceMenuItem(id?: string | null) {
  if (!id) return undefined;
  return SERVICE_MENU.find((item) => item.id === id);
}

export function defaultServiceForJobType(jobType?: string | null) {
  if (jobType === "rekey") return getServiceMenuItem("standard_rekey");
  if (jobType === "lock_upgrade") return getServiceMenuItem("standard_lock_change");
  return getServiceMenuItem("home_lockout_day");
}

export function formatServicePrice(cents: number) {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

export function servicePriceBreakdown(item: ServiceMenuItem) {
  return `${formatServicePrice(item.customerPriceCents)} total · provider travel/service call included`;
}
