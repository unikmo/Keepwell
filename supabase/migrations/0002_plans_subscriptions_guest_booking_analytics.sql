-- Configurable plan records (Implementation Spec §1) — business logic lives in
-- data, not hardcoded app constants. App code reads this table via getPlans().
create table if not exists public.plans (
  id text primary key,
  name text not null,
  price_cents int not null,
  renewal_price_cents int not null,
  covered_events_per_year int not null default 3,
  covered_event_types text[] not null default array['home_lockout','car_lockout_at_home','rekey'],
  lockbox_mode text not null check (lockbox_mode in ('optional_addon','included_free','included_professional')),
  lockbox_addon_price_cents int,
  guaranteed_visit text not null default 'none' check (guaranteed_visit in ('none','welcome_visit')),
  reaudit_cadence_years int,
  trusted_contacts_limit int,
  priority_dispatch boolean not null default false,
  sort_order int not null
);

alter table public.plans enable row level security;

create policy "plans_public_read" on public.plans
  for select to anon, authenticated using (true);

insert into public.plans (id, name, price_cents, renewal_price_cents, covered_events_per_year, covered_event_types, lockbox_mode, lockbox_addon_price_cents, guaranteed_visit, reaudit_cadence_years, trusted_contacts_limit, priority_dispatch, sort_order)
values
  ('individual', 'Individual', 2900, 2900, 3, array['home_lockout','car_lockout_at_home','rekey'], 'optional_addon', 1999, 'none', null, 1, false, 1),
  ('household', 'Household', 4900, 4900, 3, array['home_lockout','car_lockout_at_home','rekey'], 'included_free', null, 'none', null, null, false, 2),
  -- household_plus renews flat at $89/year forever — renewal_price_cents must equal price_cents exactly, per spec.
  ('household_plus', 'Household + Smart Security', 8900, 8900, 3, array['home_lockout','car_lockout_at_home','rekey'], 'included_professional', null, 'welcome_visit', 3, null, true, 3)
on conflict (id) do nothing;

-- Subscriptions: one active record per member, referencing a plan.
-- welcome_visit_used is a one-time flag tied to signup (not reset each cycle).
-- next_reaudit_due is a separately-tracked entitlement, reset only on completed re-audit.
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  plan_id text not null references public.plans(id),
  status text not null default 'active' check (status in ('active','canceled','past_due')),
  period_start timestamptz not null default now(),
  period_end timestamptz not null default (now() + interval '1 year'),
  covered_events_used int not null default 0,
  welcome_visit_used boolean not null default false,
  lockbox_status text not null default 'none' check (lockbox_status in ('none','shipped','installed')),
  next_reaudit_due date,
  created_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "subscriptions_owner_all" on public.subscriptions
  for all using (auth.uid() = member_id) with check (auth.uid() = member_id);

-- Lockbox hardware ledger: independently-queryable COGS line items,
-- tagged separately from dispatch payouts (Implementation Spec §3).
create table if not exists public.lockbox_ledger (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid references public.subscriptions(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  event_type text not null check (event_type in ('addon_purchase','included_ship','welcome_visit_install')),
  wholesale_cost_cents int not null default 1400,
  charged_amount_cents int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.lockbox_ledger enable row level security;

create policy "lockbox_ledger_owner_all" on public.lockbox_ledger
  for all using (auth.uid() = member_id) with check (auth.uid() = member_id);

-- Guest bookings: no-signup /book flow. Fixed $89 price, 15% guest discount,
-- payment authorize-at-booking/capture-on-completion (stubbed for now).
create table if not exists public.guest_bookings (
  id uuid primary key default gen_random_uuid(),
  job_type text not null check (job_type in ('lockout','rekey','lock_upgrade')),
  address text not null,
  phone text not null,
  email text,
  price_cents int not null,
  discount_pct numeric not null default 15,
  payment_status text not null default 'stubbed_pending',
  status text not null default 'requested' check (status in ('requested','dispatched','completed','canceled')),
  converted_lead boolean not null default false,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.guest_bookings enable row level security;

create policy "guest_bookings_public_insert" on public.guest_bookings
  for insert to anon, authenticated with check (true);

-- Outbound messages: queued SMS/email stub (no real provider connected yet).
create table if not exists public.outbound_messages (
  id uuid primary key default gen_random_uuid(),
  guest_booking_id uuid references public.guest_bookings(id) on delete cascade,
  member_id uuid references public.members(id) on delete cascade,
  channel text not null check (channel in ('sms','email')),
  template text not null,
  to_address text not null,
  body text not null,
  status text not null default 'queued' check (status in ('queued','sent','failed')),
  created_at timestamptz not null default now()
);

alter table public.outbound_messages enable row level security;

create policy "outbound_messages_public_insert" on public.outbound_messages
  for insert to anon, authenticated with check (true);

-- Analytics events: instrumentation for the 5 spec KPIs (dispatches per 100
-- subscribers/year by tier+event type, lockbox uptake, guest->member
-- conversion, welcome visit completion, re-audit completion).
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  member_id uuid references public.members(id) on delete cascade,
  guest_booking_id uuid references public.guest_bookings(id) on delete cascade,
  plan_id text references public.plans(id),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.analytics_events enable row level security;

create policy "analytics_events_public_insert" on public.analytics_events
  for insert to anon, authenticated with check (true);
