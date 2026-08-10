-- Keepwell marketplace provider operations + Boston seed
-- Apply through Supabase SQL Editor or your normal migration workflow.

create extension if not exists pgcrypto;

alter table public.guest_bookings add column if not exists service_id text;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.provider_profiles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  business_name text not null,
  city text,
  state text,
  postal_code text,
  service_area text[] not null default '{}',
  services text[] not null default '{}',
  description text,
  claim_status text not null default 'unclaimed'
    check (claim_status in ('unclaimed','claim_pending','verified','suspended')),
  claimed_user_id uuid references auth.users(id) on delete set null,
  is_available boolean not null default false,
  verified_at timestamptz,
  keepwell_rating numeric(3,2),
  keepwell_review_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.provider_sources (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.provider_profiles(id) on delete cascade,
  source_name text not null,
  source_place_id text not null unique,
  phone text,
  website text,
  source_address text,
  source_rating numeric(3,2),
  source_review_count integer,
  fetched_at timestamptz not null default now()
);

create table if not exists public.provider_claims (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.provider_profiles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  contact_name text not null,
  business_email text not null,
  business_phone text not null,
  relationship text not null,
  notes text,
  status text not null default 'pending'
    check (status in ('pending','approved','rejected')),
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  admin_notes text,
  unique(provider_id,user_id)
);

create table if not exists public.provider_job_offers (
  id uuid primary key default gen_random_uuid(),
  request_type text not null check (request_type in ('guest_booking','member_dispatch')),
  request_id uuid not null,
  provider_id uuid not null references public.provider_profiles(id) on delete cascade,
  payout_cents integer not null check (payout_cents > 0),
  request_summary jsonb not null default '{}'::jsonb,
  status text not null default 'offered'
    check (status in ('offered','accepted','declined','expired','completed','cancelled')),
  eta_minutes integer,
  offered_at timestamptz not null default now(),
  accepted_at timestamptz,
  responded_at timestamptz,
  completed_at timestamptz,
  unique(request_type,request_id,provider_id)
);

create unique index if not exists one_accepted_provider_per_request
on public.provider_job_offers(request_type,request_id)
where status='accepted';

create or replace function public.is_keepwell_admin()
returns boolean
language sql
stable
security definer
set search_path=public
as $$
  select exists(select 1 from public.admin_users where user_id=auth.uid());
$$;

create or replace function public.mark_provider_claim_pending()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
begin
  update public.provider_profiles
  set claim_status='claim_pending', updated_at=now()
  where id=new.provider_id and claim_status='unclaimed';
  return new;
end;
$$;

drop trigger if exists provider_claim_pending on public.provider_claims;
create trigger provider_claim_pending
after insert on public.provider_claims
for each row execute function public.mark_provider_claim_pending();

create or replace function public.expire_competing_provider_offers()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
begin
  if new.status='accepted' and old.status is distinct from new.status then
    update public.provider_job_offers
    set status='expired', responded_at=now()
    where request_type=new.request_type
      and request_id=new.request_id
      and id<>new.id
      and status='offered';
  end if;
  return new;
end;
$$;

drop trigger if exists expire_competing_provider_offers on public.provider_job_offers;
create trigger expire_competing_provider_offers
after update on public.provider_job_offers
for each row execute function public.expire_competing_provider_offers();

create or replace function public.protect_provider_profile_system_fields()
returns trigger
language plpgsql
set search_path=public
as $$
begin
  if not public.is_keepwell_admin() then
    new.id := old.id;
    new.slug := old.slug;
    new.business_name := old.business_name;
    new.claim_status := old.claim_status;
    new.claimed_user_id := old.claimed_user_id;
    new.verified_at := old.verified_at;
    new.keepwell_rating := old.keepwell_rating;
    new.keepwell_review_count := old.keepwell_review_count;
    new.created_at := old.created_at;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists protect_provider_profile_system_fields on public.provider_profiles;
create trigger protect_provider_profile_system_fields
before update on public.provider_profiles
for each row execute function public.protect_provider_profile_system_fields();

create or replace function public.protect_provider_offer_terms()
returns trigger
language plpgsql
set search_path=public
as $$
begin
  if not public.is_keepwell_admin() then
    new.id := old.id;
    new.request_type := old.request_type;
    new.request_id := old.request_id;
    new.provider_id := old.provider_id;
    new.payout_cents := old.payout_cents;
    new.request_summary := old.request_summary;
    new.offered_at := old.offered_at;
    new.completed_at := old.completed_at;

    if old.status <> 'offered' or new.status not in ('accepted','declined') then
      new.status := old.status;
      new.eta_minutes := old.eta_minutes;
      new.accepted_at := old.accepted_at;
      new.responded_at := old.responded_at;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_provider_offer_terms on public.provider_job_offers;
create trigger protect_provider_offer_terms
before update on public.provider_job_offers
for each row execute function public.protect_provider_offer_terms();

alter table public.admin_users enable row level security;
alter table public.provider_profiles enable row level security;
alter table public.provider_sources enable row level security;
alter table public.provider_claims enable row level security;
alter table public.provider_job_offers enable row level security;

drop policy if exists "admin users can read self" on public.admin_users;
create policy "admin users can read self" on public.admin_users
for select to authenticated using (user_id=auth.uid());

drop policy if exists "provider profiles are public directory data" on public.provider_profiles;
create policy "provider profiles are public directory data" on public.provider_profiles
for select to anon,authenticated using (true);

drop policy if exists "claimed provider can update own public profile" on public.provider_profiles;
create policy "claimed provider can update own public profile" on public.provider_profiles
for update to authenticated
using (claimed_user_id=auth.uid())
with check (claimed_user_id=auth.uid());

drop policy if exists "admins can update provider profiles" on public.provider_profiles;
create policy "admins can update provider profiles" on public.provider_profiles
for update to authenticated
using (public.is_keepwell_admin())
with check (public.is_keepwell_admin());

drop policy if exists "admins can read provider sources" on public.provider_sources;
create policy "admins can read provider sources" on public.provider_sources
for select to authenticated using (public.is_keepwell_admin());

drop policy if exists "provider can submit own claim" on public.provider_claims;
create policy "provider can submit own claim" on public.provider_claims
for insert to authenticated with check (user_id=auth.uid());

drop policy if exists "provider can read own claims" on public.provider_claims;
create policy "provider can read own claims" on public.provider_claims
for select to authenticated using (user_id=auth.uid() or public.is_keepwell_admin());

drop policy if exists "admins can update claims" on public.provider_claims;
create policy "admins can update claims" on public.provider_claims
for update to authenticated
using (public.is_keepwell_admin())
with check (public.is_keepwell_admin());

drop policy if exists "providers can read own offers" on public.provider_job_offers;
create policy "providers can read own offers" on public.provider_job_offers
for select to authenticated using (
  public.is_keepwell_admin()
  or exists (
    select 1 from public.provider_profiles p
    where p.id=provider_id and p.claimed_user_id=auth.uid()
  )
);

drop policy if exists "providers can respond to own offers" on public.provider_job_offers;
create policy "providers can respond to own offers" on public.provider_job_offers
for update to authenticated
using (
  public.is_keepwell_admin()
  or exists (
    select 1 from public.provider_profiles p
    where p.id=provider_id and p.claimed_user_id=auth.uid()
  )
)
with check (
  public.is_keepwell_admin()
  or exists (
    select 1 from public.provider_profiles p
    where p.id=provider_id and p.claimed_user_id=auth.uid()
  )
);

drop policy if exists "admins can insert job offers" on public.provider_job_offers;
create policy "admins can insert job offers" on public.provider_job_offers
for insert to authenticated with check (public.is_keepwell_admin());

-- Let an accepted provider read the actual job record after acceptance.
drop policy if exists "accepted provider can read guest booking" on public.guest_bookings;
create policy "accepted provider can read guest booking" on public.guest_bookings
for select to authenticated using (
  exists (
    select 1
    from public.provider_job_offers o
    join public.provider_profiles p on p.id=o.provider_id
    where o.request_type='guest_booking'
      and o.request_id=guest_bookings.id
      and o.status='accepted'
      and p.claimed_user_id=auth.uid()
  )
);

drop policy if exists "admins can read guest bookings" on public.guest_bookings;
create policy "admins can read guest bookings" on public.guest_bookings
for select to authenticated using (public.is_keepwell_admin());

drop policy if exists "accepted provider can read member dispatch" on public.dispatch_requests;
create policy "accepted provider can read member dispatch" on public.dispatch_requests
for select to authenticated using (
  exists (
    select 1
    from public.provider_job_offers o
    join public.provider_profiles p on p.id=o.provider_id
    where o.request_type='member_dispatch'
      and o.request_id=dispatch_requests.id
      and o.status='accepted'
      and p.claimed_user_id=auth.uid()
  )
);

drop policy if exists "admins can read member dispatches" on public.dispatch_requests;
create policy "admins can read member dispatches" on public.dispatch_requests
for select to authenticated using (public.is_keepwell_admin());

create or replace view public.public_provider_matches as
select
  o.request_type,
  o.request_id,
  p.id as provider_id,
  p.business_name,
  p.slug,
  o.eta_minutes,
  o.accepted_at
from public.provider_job_offers o
join public.provider_profiles p on p.id=o.provider_id
where o.status='accepted' and p.claim_status='verified';

grant select on public.public_provider_matches to anon, authenticated;

-- Seed preloaded, explicitly UNCLAIMED provider profiles.
insert into public.provider_profiles
(slug,business_name,city,state,postal_code,service_area,services,claim_status)
values
('your-neighborhood-locksmith','Your Neighborhood Locksmith','Boston','MA',null,ARRAY['Greater Boston']::text[],ARRAY['lockout','rekey','lock_change','smart_lock']::text[],'unclaimed'),
('sherlocklock-boston','SherlockLock','Boston','MA','02127',ARRAY['Greater Boston']::text[],ARRAY['lockout','rekey','lock_change','smart_lock']::text[],'unclaimed'),
('city-locksmith-24-7','City Locksmith 24/7','Boston','MA',null,ARRAY['Greater Boston']::text[],ARRAY['lockout','rekey','lock_change','smart_lock']::text[],'unclaimed'),
('star-locksmith','Star Locksmith','Brighton','MA','02135',ARRAY['Greater Boston']::text[],ARRAY['lockout','rekey','lock_change','smart_lock']::text[],'unclaimed'),
('mr-locksmith-boston','Mr Locksmith','Boston','MA','02115',ARRAY['Greater Boston']::text[],ARRAY['lockout','rekey','lock_change','smart_lock']::text[],'unclaimed'),
('bostons-locksmith','Bostons Locksmith','Boston','MA',null,ARRAY['Greater Boston']::text[],ARRAY['lockout','rekey','lock_change','smart_lock']::text[],'unclaimed'),
('hms-locksmith','HMS Locksmith','Allston','MA','02134',ARRAY['Greater Boston']::text[],ARRAY['lockout','rekey','lock_change','smart_lock']::text[],'unclaimed'),
('dial-lock-newton','Dial Lock Inc. - Mobile Locksmith of Newton','Newton','MA',null,ARRAY['Greater Boston']::text[],ARRAY['lockout','rekey','lock_change','smart_lock']::text[],'unclaimed'),
('bolt-lock-key','Bolt Lock & Key','Brighton','MA',null,ARRAY['Greater Boston']::text[],ARRAY['lockout','rekey','lock_change','smart_lock']::text[],'unclaimed'),
('brandy-auto-locksmith','Brandy Auto Locksmith','Boston','MA','02128',ARRAY['Greater Boston']::text[],ARRAY['lockout','rekey','lock_change','smart_lock']::text[],'unclaimed'),
('carlmont-lock','Carlmont Lock','Cambridge','MA','02138',ARRAY['Greater Boston']::text[],ARRAY['lockout','rekey','lock_change','smart_lock']::text[],'unclaimed'),
('prof-locksmith','Prof Locksmith','Needham','MA',null,ARRAY['Greater Boston']::text[],ARRAY['lockout','rekey','lock_change','smart_lock']::text[],'unclaimed'),
('boston-prime-locksmith','Boston Prime Locksmith','Chelsea','MA','02150',ARRAY['Greater Boston']::text[],ARRAY['lockout','rekey','lock_change','smart_lock']::text[],'unclaimed'),
('prime-locksmith-mobile-service','Prime Locksmith Mobile Service','Quincy','MA','02171',ARRAY['Greater Boston']::text[],ARRAY['lockout','rekey','lock_change','smart_lock']::text[],'unclaimed'),
('granite-lock','Granite Lock Co., Inc.','Quincy','MA','02169',ARRAY['Greater Boston']::text[],ARRAY['lockout','rekey','lock_change','smart_lock']::text[],'unclaimed'),
('ja-locksmith','JA Locksmith','Greater Boston','MA',null,ARRAY['Greater Boston']::text[],ARRAY['lockout','rekey','lock_change','smart_lock']::text[],'unclaimed'),
('baystate-locksmith-services','Baystate Locksmith Services','Braintree','MA','02184',ARRAY['Greater Boston']::text[],ARRAY['lockout','rekey','lock_change','smart_lock']::text[],'unclaimed'),
('quincy-lock','Quincy Lock','Quincy','MA','02169',ARRAY['Greater Boston']::text[],ARRAY['lockout','rekey','lock_change','smart_lock']::text[],'unclaimed'),
('cityside-locksmith','Cityside Locksmith','Somerville','MA','02143',ARRAY['Greater Boston']::text[],ARRAY['lockout','rekey','lock_change','smart_lock']::text[],'unclaimed'),
('masslock','Masslock Inc','Malden','MA','02148',ARRAY['Greater Boston']::text[],ARRAY['lockout','rekey','lock_change','smart_lock']::text[],'unclaimed'),
('sir-locksalot','SIR Locksalot','Medford','MA','02155',ARRAY['Greater Boston']::text[],ARRAY['lockout','rekey','lock_change','smart_lock']::text[],'unclaimed'),
('affordable-mobile-locksmith','Affordable Mobile Locksmith','Watertown','MA','02472',ARRAY['Greater Boston']::text[],ARRAY['lockout','rekey','lock_change','smart_lock']::text[],'unclaimed'),
('watertown-finest-locksmith','Watertown Finest Locksmith LLC','Watertown','MA','02472',ARRAY['Greater Boston']::text[],ARRAY['lockout','rekey','lock_change','smart_lock']::text[],'unclaimed'),
('unlock-boston-locksmith','Unlock Boston Locksmith','Watertown','MA',null,ARRAY['Greater Boston']::text[],ARRAY['lockout','rekey','lock_change','smart_lock']::text[],'unclaimed'),
('sherman-lock-waltham','Sherman Lock Waltham Massachusetts','Waltham','MA','02453',ARRAY['Greater Boston']::text[],ARRAY['lockout','rekey','lock_change','smart_lock']::text[],'unclaimed'),
('linehan-lock','Linehan Lock','Watertown','MA',null,ARRAY['Greater Boston']::text[],ARRAY['lockout','rekey','lock_change','smart_lock']::text[],'unclaimed')
on conflict (slug) do update set
business_name=excluded.business_name,
city=excluded.city,
state=excluded.state,
postal_code=excluded.postal_code,
service_area=excluded.service_area,
services=excluded.services,
updated_at=now();

insert into public.provider_sources
(provider_id,source_name,source_place_id,phone,website,source_address,fetched_at)
select id,'public_business_listing','ChIJSTxGixV_44kRLDEEtE473c0','+1 617-784-6595',null,null,'2026-08-10T18:42:00Z'::timestamptz
from public.provider_profiles where slug='your-neighborhood-locksmith'
on conflict (source_place_id) do update set
phone=excluded.phone, website=excluded.website, source_address=excluded.source_address, fetched_at=excluded.fetched_at;

insert into public.provider_sources
(provider_id,source_name,source_place_id,phone,website,source_address,fetched_at)
select id,'public_business_listing','ChIJUbg4sVE00oARRXw0LqIYctg','+1 617-468-3444',null,'110 K St Unit 4, Boston, MA 02127','2026-08-10T18:42:00Z'::timestamptz
from public.provider_profiles where slug='sherlocklock-boston'
on conflict (source_place_id) do update set
phone=excluded.phone, website=excluded.website, source_address=excluded.source_address, fetched_at=excluded.fetched_at;

insert into public.provider_sources
(provider_id,source_name,source_place_id,phone,website,source_address,fetched_at)
select id,'public_business_listing','ChIJcYBXS_J544kRTuIggolhjro','+1 617-383-7290',null,null,'2026-08-10T18:42:00Z'::timestamptz
from public.provider_profiles where slug='city-locksmith-24-7'
on conflict (source_place_id) do update set
phone=excluded.phone, website=excluded.website, source_address=excluded.source_address, fetched_at=excluded.fetched_at;

insert into public.provider_sources
(provider_id,source_name,source_place_id,phone,website,source_address,fetched_at)
select id,'public_business_listing','5piPp3BOPtxK8hhZLqnoBQ','+1 617-782-9204',null,'Brighton, MA 02135','2026-08-10T18:42:00Z'::timestamptz
from public.provider_profiles where slug='star-locksmith'
on conflict (source_place_id) do update set
phone=excluded.phone, website=excluded.website, source_address=excluded.source_address, fetched_at=excluded.fetched_at;

insert into public.provider_sources
(provider_id,source_name,source_place_id,phone,website,source_address,fetched_at)
select id,'public_business_listing','Lo0Y8fEJwwfN9NJf2437eA','+1 617-785-5857','http://www.my247mrlocksmith.com','Boston, MA 02115','2026-08-10T18:42:00Z'::timestamptz
from public.provider_profiles where slug='mr-locksmith-boston'
on conflict (source_place_id) do update set
phone=excluded.phone, website=excluded.website, source_address=excluded.source_address, fetched_at=excluded.fetched_at;

insert into public.provider_sources
(provider_id,source_name,source_place_id,phone,website,source_address,fetched_at)
select id,'public_business_listing','ChIJk2LRX2t744kRqeZ-tENaFYk','+1 617-616-8602',null,null,'2026-08-10T18:42:00Z'::timestamptz
from public.provider_profiles where slug='bostons-locksmith'
on conflict (source_place_id) do update set
phone=excluded.phone, website=excluded.website, source_address=excluded.source_address, fetched_at=excluded.fetched_at;

insert into public.provider_sources
(provider_id,source_name,source_place_id,phone,website,source_address,fetched_at)
select id,'public_business_listing','ChIJr1rP_Xx544kRFyAzAnfHl0I','+1 617-249-4949','https://hmslocksmith.com','Allston, MA 02134','2026-08-10T18:42:00Z'::timestamptz
from public.provider_profiles where slug='hms-locksmith'
on conflict (source_place_id) do update set
phone=excluded.phone, website=excluded.website, source_address=excluded.source_address, fetched_at=excluded.fetched_at;

insert into public.provider_sources
(provider_id,source_name,source_place_id,phone,website,source_address,fetched_at)
select id,'public_business_listing','ChIJQVk-naEwiacRUQv3OhL33VA','+1 617-401-0317',null,null,'2026-08-10T18:42:00Z'::timestamptz
from public.provider_profiles where slug='dial-lock-newton'
on conflict (source_place_id) do update set
phone=excluded.phone, website=excluded.website, source_address=excluded.source_address, fetched_at=excluded.fetched_at;

insert into public.provider_sources
(provider_id,source_name,source_place_id,phone,website,source_address,fetched_at)
select id,'public_business_listing','ChIJQ3jzpTZ544kRbyj1_-iriIM','+1 617-903-2095',null,null,'2026-08-10T18:42:00Z'::timestamptz
from public.provider_profiles where slug='bolt-lock-key'
on conflict (source_place_id) do update set
phone=excluded.phone, website=excluded.website, source_address=excluded.source_address, fetched_at=excluded.fetched_at;

insert into public.provider_sources
(provider_id,source_name,source_place_id,phone,website,source_address,fetched_at)
select id,'public_business_listing','ChIJFd--53px44kRrfmABZm2A1c','+1 617-229-7919',null,'162 Liverpool St, Boston, MA 02128','2026-08-10T18:42:00Z'::timestamptz
from public.provider_profiles where slug='brandy-auto-locksmith'
on conflict (source_place_id) do update set
phone=excluded.phone, website=excluded.website, source_address=excluded.source_address, fetched_at=excluded.fetched_at;

insert into public.provider_sources
(provider_id,source_name,source_place_id,phone,website,source_address,fetched_at)
select id,'public_business_listing','mRvyDnfDvuHILtst7fTvTA','+1 617-492-8837',null,'Cambridge, MA 02138','2026-08-10T18:42:00Z'::timestamptz
from public.provider_profiles where slug='carlmont-lock'
on conflict (source_place_id) do update set
phone=excluded.phone, website=excluded.website, source_address=excluded.source_address, fetched_at=excluded.fetched_at;

insert into public.provider_sources
(provider_id,source_name,source_place_id,phone,website,source_address,fetched_at)
select id,'public_business_listing','ChIJm77A_CWC44kR1_YEA9lbrcg','+1 617-870-8468',null,null,'2026-08-10T18:42:00Z'::timestamptz
from public.provider_profiles where slug='prof-locksmith'
on conflict (source_place_id) do update set
phone=excluded.phone, website=excluded.website, source_address=excluded.source_address, fetched_at=excluded.fetched_at;

insert into public.provider_sources
(provider_id,source_name,source_place_id,phone,website,source_address,fetched_at)
select id,'public_business_listing','ChIJ_UAHHsNx44kRcsMYoHYSr8c','+1 617-765-0768',null,'48 Pearl St, Chelsea, MA 02150','2026-08-10T18:42:00Z'::timestamptz
from public.provider_profiles where slug='boston-prime-locksmith'
on conflict (source_place_id) do update set
phone=excluded.phone, website=excluded.website, source_address=excluded.source_address, fetched_at=excluded.fetched_at;

insert into public.provider_sources
(provider_id,source_name,source_place_id,phone,website,source_address,fetched_at)
select id,'public_business_listing','ChIJvRhxgVl844kRGOiv8Bnlyys','+1 617-238-1371',null,'Quincy, MA 02171','2026-08-10T18:42:00Z'::timestamptz
from public.provider_profiles where slug='prime-locksmith-mobile-service'
on conflict (source_place_id) do update set
phone=excluded.phone, website=excluded.website, source_address=excluded.source_address, fetched_at=excluded.fetched_at;

insert into public.provider_sources
(provider_id,source_name,source_place_id,phone,website,source_address,fetched_at)
select id,'public_business_listing','FQbka4dyTWbsKsk4BE_LGw','+1 617-472-2177',null,'755 Southern Artery #3A, Quincy, MA 02169','2026-08-10T18:42:00Z'::timestamptz
from public.provider_profiles where slug='granite-lock'
on conflict (source_place_id) do update set
phone=excluded.phone, website=excluded.website, source_address=excluded.source_address, fetched_at=excluded.fetched_at;

insert into public.provider_sources
(provider_id,source_name,source_place_id,phone,website,source_address,fetched_at)
select id,'public_business_listing','ChIJ87h6CNFAAmkRuxw_0a7k7VE','+1 781-436-0016',null,null,'2026-08-10T18:42:00Z'::timestamptz
from public.provider_profiles where slug='ja-locksmith'
on conflict (source_place_id) do update set
phone=excluded.phone, website=excluded.website, source_address=excluded.source_address, fetched_at=excluded.fetched_at;

insert into public.provider_sources
(provider_id,source_name,source_place_id,phone,website,source_address,fetched_at)
select id,'public_business_listing','hcqrTSYLO3chtOsMEWqTVw','+1 781-843-5665',null,'8 Washington Pl, Ste B2, Braintree, MA 02184','2026-08-10T18:42:00Z'::timestamptz
from public.provider_profiles where slug='baystate-locksmith-services'
on conflict (source_place_id) do update set
phone=excluded.phone, website=excluded.website, source_address=excluded.source_address, fetched_at=excluded.fetched_at;

insert into public.provider_sources
(provider_id,source_name,source_place_id,phone,website,source_address,fetched_at)
select id,'public_business_listing','xSgsk_iLKe-CWxXXOt-ZDg','+1 857-869-3865',null,'Quincy, MA 02169','2026-08-10T18:42:00Z'::timestamptz
from public.provider_profiles where slug='quincy-lock'
on conflict (source_place_id) do update set
phone=excluded.phone, website=excluded.website, source_address=excluded.source_address, fetched_at=excluded.fetched_at;

insert into public.provider_sources
(provider_id,source_name,source_place_id,phone,website,source_address,fetched_at)
select id,'public_business_listing','sSTXylsiemLlMQFbCAIjig','+1 617-863-0609',null,'Somerville, MA 02143','2026-08-10T18:42:00Z'::timestamptz
from public.provider_profiles where slug='cityside-locksmith'
on conflict (source_place_id) do update set
phone=excluded.phone, website=excluded.website, source_address=excluded.source_address, fetched_at=excluded.fetched_at;

insert into public.provider_sources
(provider_id,source_name,source_place_id,phone,website,source_address,fetched_at)
select id,'public_business_listing','PVUBNdN4PJInkzjvb9svaQ','+1 617-387-3500',null,'285 Main St, Malden, MA 02148','2026-08-10T18:42:00Z'::timestamptz
from public.provider_profiles where slug='masslock'
on conflict (source_place_id) do update set
phone=excluded.phone, website=excluded.website, source_address=excluded.source_address, fetched_at=excluded.fetched_at;

insert into public.provider_sources
(provider_id,source_name,source_place_id,phone,website,source_address,fetched_at)
select id,'public_business_listing','neFsZ_xmjhc6yA_qA0RFog','+1 781-391-5801',null,'71 Fulton St, Medford, MA 02155','2026-08-10T18:42:00Z'::timestamptz
from public.provider_profiles where slug='sir-locksalot'
on conflict (source_place_id) do update set
phone=excluded.phone, website=excluded.website, source_address=excluded.source_address, fetched_at=excluded.fetched_at;

insert into public.provider_sources
(provider_id,source_name,source_place_id,phone,website,source_address,fetched_at)
select id,'public_business_listing','T8KzzldPKf14VeVVr4oEsA','+1 617-480-9883',null,'Watertown, MA 02472','2026-08-10T18:42:00Z'::timestamptz
from public.provider_profiles where slug='affordable-mobile-locksmith'
on conflict (source_place_id) do update set
phone=excluded.phone, website=excluded.website, source_address=excluded.source_address, fetched_at=excluded.fetched_at;

insert into public.provider_sources
(provider_id,source_name,source_place_id,phone,website,source_address,fetched_at)
select id,'public_business_listing','IGiRnq6hqK_Mpaz95hKpFw','+1 617-752-1252',null,'550 Arsenal St, Watertown, MA 02472','2026-08-10T18:42:00Z'::timestamptz
from public.provider_profiles where slug='watertown-finest-locksmith'
on conflict (source_place_id) do update set
phone=excluded.phone, website=excluded.website, source_address=excluded.source_address, fetched_at=excluded.fetched_at;

insert into public.provider_sources
(provider_id,source_name,source_place_id,phone,website,source_address,fetched_at)
select id,'public_business_listing','ChIJoybp2m6d44kR5JEWVF7tGyM','+1 617-952-2381',null,null,'2026-08-10T18:42:00Z'::timestamptz
from public.provider_profiles where slug='unlock-boston-locksmith'
on conflict (source_place_id) do update set
phone=excluded.phone, website=excluded.website, source_address=excluded.source_address, fetched_at=excluded.fetched_at;

insert into public.provider_sources
(provider_id,source_name,source_place_id,phone,website,source_address,fetched_at)
select id,'public_business_listing','hcp0vy0ntOQZXKWpzH5cxA','+1 781-893-6651',null,'673 Moody St, Waltham, MA 02453','2026-08-10T18:42:00Z'::timestamptz
from public.provider_profiles where slug='sherman-lock-waltham'
on conflict (source_place_id) do update set
phone=excluded.phone, website=excluded.website, source_address=excluded.source_address, fetched_at=excluded.fetched_at;

insert into public.provider_sources
(provider_id,source_name,source_place_id,phone,website,source_address,fetched_at)
select id,'public_business_listing','ChIJW7C8j7KC44kRGitQd1kfpRc','+1 617-935-3390',null,null,'2026-08-10T18:42:00Z'::timestamptz
from public.provider_profiles where slug='linehan-lock'
on conflict (source_place_id) do update set
phone=excluded.phone, website=excluded.website, source_address=excluded.source_address, fetched_at=excluded.fetched_at;

-- IMPORTANT: add your own Keepwell login as an admin after this migration.
-- Replace the email below with the email you use to log into Keepwell:
--
-- insert into public.admin_users(user_id)
-- select id from auth.users where email='YOUR-KEEPWELL-LOGIN-EMAIL'
-- on conflict (user_id) do nothing;
