-- Keepwell v4: all-in pricing support, Digital Sentinel, 14-day waiting period,
-- Household+ 3-year Lock & Access Audit, property-manager workflow and
-- brokerage bulk memberships.
begin;
create extension if not exists pgcrypto;

-- Membership entitlements ----------------------------------------------------
alter table public.plans add column if not exists field_benefits_wait_days integer not null default 14;
alter table public.plans add column if not exists included_audit_interval_years integer;
alter table public.plans add column if not exists digital_sentinel_enabled boolean not null default true;
alter table public.plans add column if not exists travel_fee_waivers_per_year integer not null default 0;
alter table public.subscriptions add column if not exists benefits_eligible_at timestamptz;
alter table public.subscriptions add column if not exists next_audit_eligible_at date;
alter table public.subscriptions add column if not exists last_audit_completed_at timestamptz;
alter table public.guest_bookings add column if not exists member_id uuid references public.members(id) on delete set null;
alter table public.guest_bookings add column if not exists priority_requested boolean not null default false;

alter table public.subscriptions drop constraint if exists subscriptions_lockbox_status_check;
alter table public.subscriptions add constraint subscriptions_lockbox_status_check check(lockbox_status in ('none','pending_fulfillment','shipped','installed'));

update public.plans set name='Individual',travel_fee_waivers_per_year=0,guaranteed_visit='none',reaudit_cadence_years=null,included_audit_interval_years=null,field_benefits_wait_days=14,digital_sentinel_enabled=true where id='individual';
update public.plans set name='Household',travel_fee_waivers_per_year=0,guaranteed_visit='none',reaudit_cadence_years=null,included_audit_interval_years=null,field_benefits_wait_days=14,digital_sentinel_enabled=true,lockbox_mode='included_free' where id='household';
update public.plans set name='Household +',price_cents=8900,renewal_price_cents=8900,travel_fee_waivers_per_year=0,guaranteed_visit='none',reaudit_cadence_years=3,included_audit_interval_years=3,field_benefits_wait_days=14,digital_sentinel_enabled=true,lockbox_mode='included_free',priority_dispatch=true where id='household_plus';

update public.subscriptions set benefits_eligible_at=coalesce(benefits_eligible_at,created_at) where benefits_eligible_at is null;
update public.subscriptions set next_audit_eligible_at=coalesce(next_audit_eligible_at,(created_at + interval '14 days')::date) where plan_id='household_plus' and last_audit_completed_at is null;

create or replace function public.handle_new_member() returns trigger language plpgsql security definer set search_path=public as $$
declare v_plan_id text; v_plan public.plans%rowtype; v_wait integer; v_eligible timestamptz; v_lockbox text;
begin
  insert into public.members(id,full_name,plan) values(new.id,coalesce(nullif(new.raw_user_meta_data->>'full_name',''),split_part(new.email,'@',1)),coalesce(nullif(new.raw_user_meta_data->>'plan',''),'Household')) on conflict(id) do update set full_name=excluded.full_name;
  if lower(coalesce(new.raw_user_meta_data->>'membership_signup','')) in ('true','1','yes') then
    v_plan_id:=coalesce(nullif(new.raw_user_meta_data->>'plan_id',''),'household');
    if v_plan_id not in ('individual','household','household_plus') then v_plan_id:='household'; end if;
    select * into v_plan from public.plans where id=v_plan_id;
    if found then
      update public.members set plan=v_plan.name where id=new.id;
      v_wait:=coalesce(v_plan.field_benefits_wait_days,14); v_eligible:=now()+make_interval(days=>v_wait);
      v_lockbox:=case when v_plan.lockbox_mode='included_free' then 'pending_fulfillment' else 'none' end;
      if not exists(select 1 from public.subscriptions where member_id=new.id and status='active') then
        insert into public.subscriptions(member_id,plan_id,lockbox_status,benefits_eligible_at,next_audit_eligible_at,next_reaudit_due)
        values(new.id,v_plan.id,v_lockbox,v_eligible,case when v_plan.id='household_plus' then v_eligible::date else null end,case when v_plan.id='household_plus' then v_eligible::date else null end);
      end if;
      insert into public.analytics_events(event_name,member_id,plan_id,metadata) values('signup_completed',new.id,v_plan.id,jsonb_build_object('benefits_eligible_at',v_eligible,'waiting_period_days',v_wait));
    end if;
  end if;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_member();

create or replace function public.normalize_guest_booking_membership() returns trigger language plpgsql security definer set search_path=public as $$
declare v_sub record;
begin
  if auth.uid() is null then new.member_id:=null; new.priority_requested:=false; return new; end if;
  new.member_id:=auth.uid();
  select s.plan_id,s.benefits_eligible_at,p.priority_dispatch into v_sub from public.subscriptions s join public.plans p on p.id=s.plan_id where s.member_id=auth.uid() and s.status='active' order by s.created_at desc limit 1;
  new.priority_requested:=coalesce(v_sub.plan_id='household_plus' and v_sub.priority_dispatch and (v_sub.benefits_eligible_at is null or v_sub.benefits_eligible_at<=now()),false);
  return new;
end; $$;
drop trigger if exists normalize_guest_booking_membership on public.guest_bookings;
create trigger normalize_guest_booking_membership before insert or update of member_id,priority_requested on public.guest_bookings for each row execute function public.normalize_guest_booking_membership();

create or replace function public.protect_subscription_entitlements() returns trigger language plpgsql set search_path=public as $$
begin
  if not public.is_keepwell_admin() then
    new.plan_id:=old.plan_id; new.status:=old.status; new.benefits_eligible_at:=old.benefits_eligible_at; new.next_audit_eligible_at:=old.next_audit_eligible_at; new.last_audit_completed_at:=old.last_audit_completed_at; new.next_reaudit_due:=old.next_reaudit_due;
  end if;
  return new;
end; $$;
drop trigger if exists protect_subscription_entitlements on public.subscriptions;
create trigger protect_subscription_entitlements before update on public.subscriptions for each row execute function public.protect_subscription_entitlements();

-- Digital Sentinel -----------------------------------------------------------
alter table public.vault_items add column if not exists item_type text not null default 'other';
alter table public.vault_items add column if not exists notes text;
alter table public.vault_items add column if not exists secret_ciphertext text;
alter table public.vault_items add column if not exists photo_path text;
alter table public.vault_items add column if not exists updated_at timestamptz not null default now();
update public.vault_items set meta=null where meta is not null and btrim(meta)<>'';
alter table public.trusted_contacts add column if not exists phone text;
alter table public.trusted_contacts add column if not exists email text;
alter table public.trusted_contacts add column if not exists has_spare_key boolean not null default false;
alter table public.trusted_contacts add column if not exists can_authorize boolean not null default false;
alter table public.trusted_contacts add column if not exists access_note text;

drop policy if exists "vault_items_owner_all" on public.vault_items;
drop policy if exists "vault_items_owner_select" on public.vault_items;
create policy "vault_items_owner_select" on public.vault_items for select to authenticated using(auth.uid()=member_id);
drop policy if exists "vault_items_owner_delete" on public.vault_items;
create policy "vault_items_owner_delete" on public.vault_items for delete to authenticated using(auth.uid()=member_id);

create or replace function public.sentinel_add_item(p_name text,p_icon text,p_item_type text,p_notes text default null,p_secret_ciphertext text default null) returns uuid language plpgsql security definer set search_path=public as $$
declare v_user uuid:=auth.uid(); v_id uuid;
begin
  if v_user is null then raise exception 'Authentication required'; end if;
  if nullif(trim(p_name),'') is null then raise exception 'Name is required'; end if;
  insert into public.vault_items(member_id,name,icon,item_type,notes,secret_ciphertext,meta) values(v_user,left(trim(p_name),120),coalesce(nullif(p_icon,''),'🔑'),left(coalesce(nullif(p_item_type,''),'other'),40),nullif(left(coalesce(p_notes,''),1200),''),nullif(left(coalesce(p_secret_ciphertext,''),2000),''),null) returning id into v_id;
  insert into public.activity_log(member_id,title,meta) values(v_user,left(trim(p_name),120)||' saved to Digital Sentinel','private access item');
  return v_id;
end; $$;
create or replace function public.sentinel_set_photo_path(p_item_id uuid,p_photo_path text) returns void language plpgsql security definer set search_path=public as $$
begin update public.vault_items set photo_path=left(p_photo_path,800),updated_at=now() where id=p_item_id and member_id=auth.uid(); if not found then raise exception 'Sentinel item not found'; end if; end; $$;
grant execute on function public.sentinel_add_item(text,text,text,text,text) to authenticated;
grant execute on function public.sentinel_set_photo_path(uuid,text) to authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('keepwell-sentinel','keepwell-sentinel',false,5242880,array['image/jpeg','image/png','image/webp','image/heic']) on conflict(id) do update set public=false,file_size_limit=5242880,allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists "sentinel_photo_select_own" on storage.objects;
create policy "sentinel_photo_select_own" on storage.objects for select to authenticated using(bucket_id='keepwell-sentinel' and (storage.foldername(name))[1]=auth.uid()::text);
drop policy if exists "sentinel_photo_insert_own" on storage.objects;
create policy "sentinel_photo_insert_own" on storage.objects for insert to authenticated with check(bucket_id='keepwell-sentinel' and (storage.foldername(name))[1]=auth.uid()::text);
drop policy if exists "sentinel_photo_delete_own" on storage.objects;
create policy "sentinel_photo_delete_own" on storage.objects for delete to authenticated using(bucket_id='keepwell-sentinel' and (storage.foldername(name))[1]=auth.uid()::text);

-- Lock & Access Audit --------------------------------------------------------
create table if not exists public.lock_audits(
  id uuid primary key default gen_random_uuid(),member_id uuid not null references public.members(id) on delete cascade,subscription_id uuid not null references public.subscriptions(id) on delete cascade,property_address text not null,preferred_date date,
  status text not null default 'requested' check(status in ('requested','offered','accepted','report_submitted','reviewed','quoted','closed','cancelled')),provider_report jsonb,report_submitted_at timestamptz,customer_report_summary text,reviewed_at timestamptz,completed_at timestamptz,created_at timestamptz not null default now()
);
alter table public.lock_audits enable row level security;
drop policy if exists "lock_audits_member_select" on public.lock_audits;
create policy "lock_audits_member_select" on public.lock_audits for select to authenticated using(member_id=auth.uid() or public.is_keepwell_admin());
drop policy if exists "lock_audits_admin_update" on public.lock_audits;
create policy "lock_audits_admin_update" on public.lock_audits for update to authenticated using(public.is_keepwell_admin()) with check(public.is_keepwell_admin());

create or replace function public.request_lock_audit(p_property_address text,p_preferred_date date default null) returns uuid language plpgsql security definer set search_path=public as $$
declare v_user uuid:=auth.uid(); v_sub public.subscriptions%rowtype; v_id uuid;
begin
  if v_user is null then raise exception 'Authentication required'; end if;
  if nullif(trim(p_property_address),'') is null then raise exception 'Property address is required'; end if;
  select * into v_sub from public.subscriptions where member_id=v_user and status='active' and plan_id='household_plus' order by created_at desc limit 1;
  if not found then raise exception 'Household+ membership is required'; end if;
  if v_sub.last_audit_completed_at is not null and v_sub.next_audit_eligible_at is not null and v_sub.next_audit_eligible_at>current_date then raise exception 'Your next included audit is not available yet'; end if;
  if exists(select 1 from public.lock_audits where member_id=v_user and status in ('requested','offered','accepted','report_submitted')) then raise exception 'You already have an audit in progress'; end if;
  if p_preferred_date is not null and p_preferred_date<current_date then raise exception 'Preferred date cannot be in the past'; end if;
  if v_sub.last_audit_completed_at is null and p_preferred_date is not null and v_sub.benefits_eligible_at is not null and p_preferred_date<v_sub.benefits_eligible_at::date then raise exception 'The first audit appointment must be after the 14-day waiting period'; end if;
  insert into public.lock_audits(member_id,subscription_id,property_address,preferred_date,status) values(v_user,v_sub.id,left(trim(p_property_address),300),p_preferred_date,'requested') returning id into v_id;
  insert into public.activity_log(member_id,title,meta) values(v_user,'Lock & Access Audit requested',coalesce(p_preferred_date::text,'Scheduling requested'));
  return v_id;
end; $$;
grant execute on function public.request_lock_audit(text,date) to authenticated;

create table if not exists public.audit_offers(
  id uuid primary key default gen_random_uuid(),audit_id uuid not null references public.lock_audits(id) on delete cascade,member_id uuid not null references public.members(id) on delete cascade,created_by uuid references auth.users(id) on delete set null,title text not null,description text not null,customer_price_cents integer not null check(customer_price_cents>0),target_provider_payout_cents integer check(target_provider_payout_cents is null or target_provider_payout_cents>0),status text not null default 'offered' check(status in ('offered','accepted','declined','expired','fulfilled')),accepted_at timestamptz,created_at timestamptz not null default now()
);
alter table public.audit_offers enable row level security;
drop policy if exists "audit_offers_member_select" on public.audit_offers;
create policy "audit_offers_member_select" on public.audit_offers for select to authenticated using(member_id=auth.uid() or public.is_keepwell_admin());
drop policy if exists "audit_offers_admin_all" on public.audit_offers;
create policy "audit_offers_admin_all" on public.audit_offers for all to authenticated using(public.is_keepwell_admin()) with check(public.is_keepwell_admin());
create or replace function public.accept_audit_offer(p_offer_id uuid) returns void language plpgsql security definer set search_path=public as $$
declare v_user uuid:=auth.uid(); v_audit uuid;
begin update public.audit_offers set status='accepted',accepted_at=now() where id=p_offer_id and member_id=v_user and status='offered' returning audit_id into v_audit; if v_audit is null then raise exception 'Offer not found or no longer open'; end if; insert into public.activity_log(member_id,title,meta) values(v_user,'Audit follow-up offer accepted','Keepwell will coordinate the approved work'); end; $$;
grant execute on function public.accept_audit_offer(uuid) to authenticated;

-- Provider offers: normal jobs, audits, PM and audit follow-up ----------------
create or replace function public.protect_provider_offer_terms() returns trigger language plpgsql set search_path=public as $$
begin
  if not public.is_keepwell_admin() then
    new.id:=old.id; new.request_type:=old.request_type; new.request_id:=old.request_id; new.provider_id:=old.provider_id; new.payout_cents:=old.payout_cents; new.request_summary:=old.request_summary; new.offered_at:=old.offered_at;
    if old.status='offered' and new.status in ('accepted','declined') then new.completed_at:=old.completed_at;
    elsif old.status='accepted' and old.request_type in ('pm_request','audit_followup') and new.status='completed' then new.eta_minutes:=old.eta_minutes; new.accepted_at:=old.accepted_at; new.responded_at:=coalesce(new.responded_at,old.responded_at); new.completed_at:=coalesce(new.completed_at,now());
    else new.status:=old.status; new.eta_minutes:=old.eta_minutes; new.accepted_at:=old.accepted_at; new.responded_at:=old.responded_at; new.completed_at:=old.completed_at; end if;
  end if;
  return new;
end; $$;
alter table public.provider_job_offers drop constraint if exists provider_job_offers_request_type_check;
alter table public.provider_job_offers add constraint provider_job_offers_request_type_check check(request_type in ('guest_booking','member_dispatch','lock_audit','pm_request','audit_followup'));

create or replace function public.submit_lock_audit_report(p_offer_id uuid,p_report jsonb) returns void language plpgsql security definer set search_path=public as $$
declare v_audit uuid;
begin
  if jsonb_typeof(p_report)<>'object' or octet_length(p_report::text)>20000 then raise exception 'Audit report must be a structured object under 20 KB'; end if;
  select o.request_id into v_audit from public.provider_job_offers o join public.provider_profiles p on p.id=o.provider_id where o.id=p_offer_id and o.request_type='lock_audit' and o.status='accepted' and p.claimed_user_id=auth.uid() and p.claim_status='verified';
  if v_audit is null then raise exception 'Accepted audit offer not found'; end if;
  update public.lock_audits set provider_report=p_report,report_submitted_at=now(),status='report_submitted' where id=v_audit;
end; $$;
grant execute on function public.submit_lock_audit_report(uuid,jsonb) to authenticated;

-- Property manager loop ------------------------------------------------------
create table if not exists public.pm_organizations(id uuid primary key default gen_random_uuid(),name text not null,created_by uuid not null references auth.users(id) on delete restrict,created_at timestamptz not null default now());
create table if not exists public.pm_members(organization_id uuid not null references public.pm_organizations(id) on delete cascade,user_id uuid not null references auth.users(id) on delete cascade,role text not null default 'member' check(role in ('admin','member')),created_at timestamptz not null default now(),primary key(organization_id,user_id));
create table if not exists public.pm_properties(id uuid primary key default gen_random_uuid(),organization_id uuid not null references public.pm_organizations(id) on delete cascade,name text not null,address text not null,unit_count integer not null default 1 check(unit_count>0),created_at timestamptz not null default now());
create table if not exists public.pm_service_requests(id uuid primary key default gen_random_uuid(),organization_id uuid not null references public.pm_organizations(id) on delete cascade,property_id uuid not null references public.pm_properties(id) on delete cascade,requested_by uuid not null references auth.users(id) on delete restrict,unit_label text,service_type text not null check(service_type in ('lockout','rekey','lock_change','smart_lock')),resident_name text,resident_phone text,notes text,status text not null default 'requested' check(status in ('requested','offered','accepted','completed','cancelled')),completed_at timestamptz,created_at timestamptz not null default now());
create or replace function public.is_pm_member(p_org uuid) returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.pm_members where organization_id=p_org and user_id=auth.uid()) or public.is_keepwell_admin(); $$;
alter table public.pm_organizations enable row level security; alter table public.pm_members enable row level security; alter table public.pm_properties enable row level security; alter table public.pm_service_requests enable row level security;
drop policy if exists "pm_org_insert" on public.pm_organizations; create policy "pm_org_insert" on public.pm_organizations for insert to authenticated with check(created_by=auth.uid());
drop policy if exists "pm_org_select" on public.pm_organizations; create policy "pm_org_select" on public.pm_organizations for select to authenticated using(created_by=auth.uid() or public.is_pm_member(id));
drop policy if exists "pm_members_select" on public.pm_members; create policy "pm_members_select" on public.pm_members for select to authenticated using(user_id=auth.uid() or public.is_pm_member(organization_id));
drop policy if exists "pm_members_insert_self" on public.pm_members; create policy "pm_members_insert_self" on public.pm_members for insert to authenticated with check(user_id=auth.uid() and exists(select 1 from public.pm_organizations o where o.id=organization_id and o.created_by=auth.uid()));
drop policy if exists "pm_properties_all_members" on public.pm_properties; create policy "pm_properties_all_members" on public.pm_properties for all to authenticated using(public.is_pm_member(organization_id)) with check(public.is_pm_member(organization_id));
drop policy if exists "pm_requests_select" on public.pm_service_requests; create policy "pm_requests_select" on public.pm_service_requests for select to authenticated using(public.is_pm_member(organization_id) or exists(select 1 from public.provider_job_offers o join public.provider_profiles p on p.id=o.provider_id where o.request_type='pm_request' and o.request_id=pm_service_requests.id and o.status='accepted' and p.claimed_user_id=auth.uid()));
drop policy if exists "pm_requests_insert" on public.pm_service_requests; create policy "pm_requests_insert" on public.pm_service_requests for insert to authenticated with check(public.is_pm_member(organization_id) and requested_by=auth.uid() and exists(select 1 from public.pm_properties p where p.id=property_id and p.organization_id=organization_id));
drop policy if exists "pm_requests_admin_update" on public.pm_service_requests; create policy "pm_requests_admin_update" on public.pm_service_requests for update to authenticated using(public.is_keepwell_admin()) with check(public.is_keepwell_admin());

create or replace function public.sync_v4_request_offer_status() returns trigger language plpgsql security definer set search_path=public as $$
begin
  if new.status='accepted' and old.status is distinct from new.status then
    if new.request_type='lock_audit' then update public.lock_audits set status='accepted' where id=new.request_id;
    elsif new.request_type='pm_request' then update public.pm_service_requests set status='accepted' where id=new.request_id; end if;
  elsif new.status='completed' and old.status is distinct from new.status then
    if new.request_type='pm_request' then update public.pm_service_requests set status='completed',completed_at=coalesce(completed_at,now()) where id=new.request_id;
    elsif new.request_type='audit_followup' then update public.audit_offers set status='fulfilled' where id=new.request_id and status='accepted'; update public.lock_audits set status='closed' where id=(select audit_id from public.audit_offers where id=new.request_id); end if;
  end if;
  return new;
end; $$;
drop trigger if exists sync_v4_request_offer_status on public.provider_job_offers;
create trigger sync_v4_request_offer_status after update on public.provider_job_offers for each row execute function public.sync_v4_request_offer_status();

drop policy if exists "accepted_provider_read_lock_audit" on public.lock_audits;
create policy "accepted_provider_read_lock_audit" on public.lock_audits for select to authenticated using(member_id=auth.uid() or public.is_keepwell_admin() or exists(select 1 from public.provider_job_offers o join public.provider_profiles p on p.id=o.provider_id where o.request_type='lock_audit' and o.request_id=lock_audits.id and o.status='accepted' and p.claimed_user_id=auth.uid()));

-- Brokerage bulk memberships ------------------------------------------------
create table if not exists public.brokerage_accounts(id uuid primary key default gen_random_uuid(),name text not null,created_by uuid not null references auth.users(id) on delete restrict,created_at timestamptz not null default now());
create table if not exists public.brokerage_members(brokerage_id uuid not null references public.brokerage_accounts(id) on delete cascade,user_id uuid not null references auth.users(id) on delete cascade,role text not null default 'member' check(role in ('admin','member')),created_at timestamptz not null default now(),primary key(brokerage_id,user_id));
create table if not exists public.brokerage_bulk_orders(id uuid primary key default gen_random_uuid(),brokerage_id uuid not null references public.brokerage_accounts(id) on delete cascade,created_by uuid not null references auth.users(id) on delete restrict,plan_id text not null references public.plans(id),quantity integer not null check(quantity in (10,25,50,100)),unit_price_cents integer not null check(unit_price_cents>0),total_price_cents integer not null check(total_price_cents>0),discount_pct integer not null default 0,status text not null default 'pending_invoice' check(status in ('pending_invoice','paid','codes_issued','cancelled')),paid_at timestamptz,codes_issued_at timestamptz,created_at timestamptz not null default now());
create table if not exists public.brokerage_activation_codes(id uuid primary key default gen_random_uuid(),brokerage_id uuid not null references public.brokerage_accounts(id) on delete cascade,bulk_order_id uuid not null references public.brokerage_bulk_orders(id) on delete cascade,plan_id text not null references public.plans(id),code text not null unique,status text not null default 'unused' check(status in ('unused','redeemed','expired','cancelled')),redeemed_by uuid references auth.users(id) on delete set null,redeemed_at timestamptz,created_at timestamptz not null default now());
create or replace function public.is_brokerage_member(p_brokerage uuid) returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.brokerage_members where brokerage_id=p_brokerage and user_id=auth.uid()) or public.is_keepwell_admin(); $$;
alter table public.brokerage_accounts enable row level security; alter table public.brokerage_members enable row level security; alter table public.brokerage_bulk_orders enable row level security; alter table public.brokerage_activation_codes enable row level security;
drop policy if exists "brokerage_account_insert" on public.brokerage_accounts; create policy "brokerage_account_insert" on public.brokerage_accounts for insert to authenticated with check(created_by=auth.uid());
drop policy if exists "brokerage_account_select" on public.brokerage_accounts; create policy "brokerage_account_select" on public.brokerage_accounts for select to authenticated using(created_by=auth.uid() or public.is_brokerage_member(id));
drop policy if exists "brokerage_members_select" on public.brokerage_members; create policy "brokerage_members_select" on public.brokerage_members for select to authenticated using(user_id=auth.uid() or public.is_brokerage_member(brokerage_id));
drop policy if exists "brokerage_members_insert_self" on public.brokerage_members; create policy "brokerage_members_insert_self" on public.brokerage_members for insert to authenticated with check(user_id=auth.uid() and exists(select 1 from public.brokerage_accounts b where b.id=brokerage_id and b.created_by=auth.uid()));
drop policy if exists "bulk_orders_select" on public.brokerage_bulk_orders; create policy "bulk_orders_select" on public.brokerage_bulk_orders for select to authenticated using(public.is_brokerage_member(brokerage_id));
drop policy if exists "bulk_orders_insert" on public.brokerage_bulk_orders; create policy "bulk_orders_insert" on public.brokerage_bulk_orders for insert to authenticated with check(public.is_brokerage_member(brokerage_id) and created_by=auth.uid());
drop policy if exists "bulk_orders_admin_update" on public.brokerage_bulk_orders; create policy "bulk_orders_admin_update" on public.brokerage_bulk_orders for update to authenticated using(public.is_keepwell_admin()) with check(public.is_keepwell_admin());
drop policy if exists "activation_codes_select" on public.brokerage_activation_codes; create policy "activation_codes_select" on public.brokerage_activation_codes for select to authenticated using(public.is_brokerage_member(brokerage_id) or redeemed_by=auth.uid());
drop policy if exists "activation_codes_admin_all" on public.brokerage_activation_codes; create policy "activation_codes_admin_all" on public.brokerage_activation_codes for all to authenticated using(public.is_keepwell_admin()) with check(public.is_keepwell_admin());

create or replace function public.lookup_brokerage_activation(p_code text) returns table(code text,status text,plan_id text,plan_name text,retail_price_cents integer,brokerage_name text) language sql stable security definer set search_path=public as $$
  select c.code,c.status,c.plan_id,p.name,p.price_cents,b.name from public.brokerage_activation_codes c join public.plans p on p.id=c.plan_id join public.brokerage_accounts b on b.id=c.brokerage_id where c.code=upper(trim(p_code)) limit 1;
$$;
grant execute on function public.lookup_brokerage_activation(text) to anon,authenticated;

create or replace function public.handle_brokerage_activation() returns trigger language plpgsql security definer set search_path=public as $$
declare v_code text:=upper(nullif(new.raw_user_meta_data->>'bulk_code','')); v_row public.brokerage_activation_codes%rowtype; v_plan public.plans%rowtype; v_wait integer; v_eligible timestamptz; v_lockbox text;
begin
  if v_code is null then return new; end if;
  select * into v_row from public.brokerage_activation_codes where code=v_code and status='unused' for update; if not found then return new; end if;
  select * into v_plan from public.plans where id=v_row.plan_id; if not found then return new; end if;
  insert into public.members(id,full_name,plan) values(new.id,coalesce(new.raw_user_meta_data->>'full_name',split_part(new.email,'@',1)),v_plan.name) on conflict(id) do update set plan=excluded.plan,full_name=excluded.full_name;
  v_wait:=coalesce(v_plan.field_benefits_wait_days,14); v_eligible:=now()+make_interval(days=>v_wait); v_lockbox:=case when v_plan.lockbox_mode='included_free' then 'pending_fulfillment' else 'none' end;
  if not exists(select 1 from public.subscriptions where member_id=new.id and status='active') then insert into public.subscriptions(member_id,plan_id,lockbox_status,benefits_eligible_at,next_audit_eligible_at,next_reaudit_due) values(new.id,v_plan.id,v_lockbox,v_eligible,case when v_plan.id='household_plus' then v_eligible::date else null end,case when v_plan.id='household_plus' then v_eligible::date else null end); end if;
  update public.brokerage_activation_codes set status='redeemed',redeemed_by=new.id,redeemed_at=now() where id=v_row.id;
  return new;
end; $$;
drop trigger if exists on_auth_brokerage_activation on auth.users;
create trigger on_auth_brokerage_activation after insert on auth.users for each row execute function public.handle_brokerage_activation();

update public.provider_profiles set services=array_append(services,'lock_audit') where not ('lock_audit'=any(services));
commit;
