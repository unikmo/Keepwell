begin;

alter table public.plans
  add column if not exists travel_fee_waivers_per_year integer not null default 0;

alter table public.subscriptions
  add column if not exists travel_fee_waivers_used integer not null default 0;

update public.plans
set travel_fee_waivers_per_year = 1,
    guaranteed_visit = 'none',
    reaudit_cadence_years = null
where id = 'individual';

update public.plans
set travel_fee_waivers_per_year = 1,
    guaranteed_visit = 'none',
    reaudit_cadence_years = null,
    lockbox_mode = 'included_free'
where id = 'household';

update public.plans
set name = 'Household + Priority',
    travel_fee_waivers_per_year = 2,
    guaranteed_visit = 'none',
    reaudit_cadence_years = null,
    lockbox_mode = 'included_free',
    priority_dispatch = true
where id = 'household_plus';

commit;

select id, name, price_cents, travel_fee_waivers_per_year, lockbox_mode, guaranteed_visit, priority_dispatch
from public.plans
order by sort_order;
