-- Members: one row per authenticated user, mirrors auth.users
create table if not exists public.members (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  plan text not null default 'Household',
  covered_events_total int not null default 3,
  covered_events_used int not null default 1,
  created_at timestamptz not null default now()
);

alter table public.members enable row level security;

create policy "members_select_own" on public.members
  for select using (auth.uid() = id);
create policy "members_update_own" on public.members
  for update using (auth.uid() = id);
create policy "members_insert_own" on public.members
  for insert with check (auth.uid() = id);

-- Vault items: keys, codes, passcodes belonging to a member
create table if not exists public.vault_items (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  name text not null,
  icon text not null default '🔑',
  meta text,
  created_at timestamptz not null default now()
);

alter table public.vault_items enable row level security;

create policy "vault_items_owner_all" on public.vault_items
  for all using (auth.uid() = member_id) with check (auth.uid() = member_id);

-- Trusted contacts: people a member has granted access to
create table if not exists public.trusted_contacts (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  name text not null,
  relationship text,
  permission text not null default 'Key holder',
  created_at timestamptz not null default now()
);

alter table public.trusted_contacts enable row level security;

create policy "trusted_contacts_owner_all" on public.trusted_contacts
  for all using (auth.uid() = member_id) with check (auth.uid() = member_id);

-- Dispatch requests: emergency "get help" events
create table if not exists public.dispatch_requests (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  issue text not null,
  status text not null default 'dispatched',
  tech_name text not null default 'Daryl Owusu',
  eta_minutes int not null default 11,
  created_at timestamptz not null default now()
);

alter table public.dispatch_requests enable row level security;

create policy "dispatch_requests_owner_all" on public.dispatch_requests
  for all using (auth.uid() = member_id) with check (auth.uid() = member_id);

-- Activity log shown on the dashboard
create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  title text not null,
  meta text,
  created_at timestamptz not null default now()
);

alter table public.activity_log enable row level security;

create policy "activity_log_owner_all" on public.activity_log
  for all using (auth.uid() = member_id) with check (auth.uid() = member_id);

-- Contact / support messages from the public contact page (no auth required)
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  topic text not null default 'General',
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

create policy "contact_messages_public_insert" on public.contact_messages
  for insert to anon, authenticated with check (true);

-- Auto-create a members row + starter vault/contacts when a new auth user is created
create or replace function public.handle_new_member()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.members (id, full_name, plan)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'plan', 'Household')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_member();
