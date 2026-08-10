export type ServiceMenuItem = {
  id: string;
  jobType: "lockout" | "rekey" | "lock_upgrade";
  title: string;
  timing: string;
  customerPriceCents: number;
  providerPayoutCents: number;
  scope: string;
  memberNote: string;
};

export const SERVICE_MENU: ServiceMenuItem[] = [
  {
    id: "home_lockout_day",
    jobType: "lockout",
    title: "Home lockout",
    timing: "Weekdays, 8am–6pm",
    customerPriceCents: 8900,
    providerPayoutCents: 6500,
    scope: "Standard residential entry. Destructive entry, high-security hardware, repairs, and replacement hardware are excluded.",
    memberNote: "Eligible members can use 1 covered event instead of the one-off service price.",
  },
  {
    id: "home_lockout_evening_weekend",
    jobType: "lockout",
    title: "Home lockout",
    timing: "Evenings 6pm–11pm & weekends",
    customerPriceCents: 11900,
    providerPayoutCents: 8500,
    scope: "Standard residential entry. Destructive entry, high-security hardware, repairs, and replacement hardware are excluded.",
    memberNote: "Eligible members can use 1 covered event instead of the one-off service price.",
  },
  {
    id: "home_lockout_overnight_holiday",
    jobType: "lockout",
    title: "Home lockout",
    timing: "11pm–8am & major holidays",
    customerPriceCents: 14900,
    providerPayoutCents: 11000,
    scope: "Standard residential entry. Destructive entry, high-security hardware, repairs, and replacement hardware are excluded.",
    memberNote: "Eligible members can use 1 covered event instead of the one-off service price.",
  },
  {
    id: "car_lockout_at_property",
    jobType: "lockout",
    title: "Car lockout at the property",
    timing: "Standard service window",
    customerPriceCents: 9900,
    providerPayoutCents: 7200,
    scope: "Standard vehicle entry at the service property. Key cutting, programming, high-security systems, and damage repair are excluded.",
    memberNote: "Eligible plans may cover a car lockout occurring at the registered home address.",
  },
  {
    id: "standard_rekey",
    jobType: "rekey",
    title: "Standard rekey",
    timing: "Scheduled service",
    customerPriceCents: 9900,
    providerPayoutCents: 7200,
    scope: "Includes the service visit and first standard cylinder. Additional standard cylinders are $29 each. Specialty/high-security cylinders are quoted before work.",
    memberNote: "Eligible members can use 1 covered event for the standard included scope.",
  },
  {
    id: "standard_lock_change",
    jobType: "lock_upgrade",
    title: "Standard lock change",
    timing: "Scheduled service",
    customerPriceCents: 12900,
    providerPayoutCents: 9000,
    scope: "Labor for one standard residential lock replacement. Hardware is separate and must be approved before installation.",
    memberNote: "Membership keeps the property record and access details together; hardware is not a covered-event benefit.",
  },
  {
    id: "smart_lock_install",
    jobType: "lock_upgrade",
    title: "Smart lock installation",
    timing: "Scheduled service",
    customerPriceCents: 14900,
    providerPayoutCents: 10500,
    scope: "Labor to install and set up one compatible customer-supplied smart lock. Hardware, door modification, electrical work, or network troubleshooting are separate.",
    memberNote: "Membership keeps setup and property access context together; hardware is separate.",
  },
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
