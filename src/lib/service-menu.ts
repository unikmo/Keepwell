export type ServiceMenuItem = {
  id: string;
  jobType: "lockout" | "rekey" | "lock_upgrade";
  title: string;
  timing: string;
  servicePriceCents: number;
  travelFeeCents: number;
  customerPriceCents: number;
  providerServicePayoutCents: number;
  providerPayoutCents: number;
  scope: string;
  memberNote: string;
};

export const PROVIDER_TRAVEL_FEE_CENTS = 2500;

function withTravelFee(
  item: Omit<ServiceMenuItem, "travelFeeCents" | "customerPriceCents" | "providerPayoutCents">
): ServiceMenuItem {
  return {
    ...item,
    travelFeeCents: PROVIDER_TRAVEL_FEE_CENTS,
    customerPriceCents: item.servicePriceCents + PROVIDER_TRAVEL_FEE_CENTS,
    providerPayoutCents: item.providerServicePayoutCents + PROVIDER_TRAVEL_FEE_CENTS,
  };
}

export const SERVICE_MENU: ServiceMenuItem[] = [
  withTravelFee({
    id: "home_lockout_day",
    jobType: "lockout",
    title: "Home lockout",
    timing: "Weekdays, 8am–6pm",
    servicePriceCents: 8900,
    providerServicePayoutCents: 6500,
    scope: "Standard residential entry. Destructive entry, high-security hardware, repairs, and replacement hardware are excluded.",
    memberNote: "Members may use an available annual travel-fee waiver; the fixed service price still applies.",
  }),
  withTravelFee({
    id: "home_lockout_evening_weekend",
    jobType: "lockout",
    title: "Home lockout",
    timing: "Evenings 6pm–11pm & weekends",
    servicePriceCents: 11900,
    providerServicePayoutCents: 8500,
    scope: "Standard residential entry. Destructive entry, high-security hardware, repairs, and replacement hardware are excluded.",
    memberNote: "Members may use an available annual travel-fee waiver; the fixed service price still applies.",
  }),
  withTravelFee({
    id: "home_lockout_overnight_holiday",
    jobType: "lockout",
    title: "Home lockout",
    timing: "11pm–8am & major holidays",
    servicePriceCents: 14900,
    providerServicePayoutCents: 11000,
    scope: "Standard residential entry. Destructive entry, high-security hardware, repairs, and replacement hardware are excluded.",
    memberNote: "Members may use an available annual travel-fee waiver; the fixed service price still applies.",
  }),
  withTravelFee({
    id: "car_lockout_at_property",
    jobType: "lockout",
    title: "Car lockout at the property",
    timing: "Standard service window",
    servicePriceCents: 9900,
    providerServicePayoutCents: 7200,
    scope: "Standard vehicle entry at the service property. Key cutting, programming, high-security systems, and damage repair are excluded.",
    memberNote: "Members may use an available annual travel-fee waiver when the vehicle is at the registered property.",
  }),
  withTravelFee({
    id: "standard_rekey",
    jobType: "rekey",
    title: "Standard rekey",
    timing: "Scheduled service",
    servicePriceCents: 9900,
    providerServicePayoutCents: 7200,
    scope: "Includes the service visit and first standard cylinder. Additional standard cylinders are $29 each. Specialty/high-security cylinders are quoted before work.",
    memberNote: "Members may use an available annual travel-fee waiver; additional cylinders remain separately priced.",
  }),
  withTravelFee({
    id: "standard_lock_change",
    jobType: "lock_upgrade",
    title: "Standard lock change",
    timing: "Scheduled service",
    servicePriceCents: 12900,
    providerServicePayoutCents: 9000,
    scope: "Labor for one standard residential lock replacement. Hardware is separate and must be approved before installation.",
    memberNote: "Members may use an available annual travel-fee waiver. Hardware is always separate.",
  }),
  withTravelFee({
    id: "smart_lock_install",
    jobType: "lock_upgrade",
    title: "Smart lock installation",
    timing: "Scheduled service",
    servicePriceCents: 14900,
    providerServicePayoutCents: 10500,
    scope: "Labor to install and set up one compatible customer-supplied smart lock. Hardware, door modification, electrical work, network troubleshooting, or work outside the provider's verified scope are separate.",
    memberNote: "Members may use an available annual travel-fee waiver. Hardware and out-of-scope work are separate.",
  }),
];

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
  return `${formatServicePrice(item.servicePriceCents)} service + ${formatServicePrice(item.travelFeeCents)} provider travel`;
}
