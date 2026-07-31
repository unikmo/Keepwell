# Digital Sentinel (Keepwell)

Membership marketing site + member app for Digital Sentinel — a home lockout/rekey/dispatch
membership. Built with Next.js (App Router), Tailwind CSS v4, and Supabase (auth + database).

## Stack

- **Next.js 16** — App Router, Server Actions, TypeScript
- **Tailwind CSS v4** — design tokens (ink/brass/parchment/verdigris/ember) in `src/app/globals.css`
- **Supabase** — email/password auth, Postgres with row-level security
  - project: `keepwell` (`rgyzlfezyhwisfrtoczn`, org: Dengine, region: us-east-1)

## Pages

- `/` — marketing homepage (hero, features, how it works, pricing, CTA)
- `/pricing`, `/how-it-works` — dedicated marketing pages, driven by the `plans` table
- `/login`, `/signup` — Supabase-authenticated login / signup
- `/contact` — support form, writes to `contact_messages`
- `/book` → `/book/details` → `/book/review` → `/book/[id]` — no-signup guest booking flow ($89 flat, 15% guest discount, stubbed payment)
- `/terms`, `/privacy`, `/member-agreement`, `/cookies` — legal pages
- `/for-property-managers`, `/for-real-estate-agents` — B2B landing pages
- `/app` — member dashboard (membership status, vault, trusted access, activity), auth-gated
- `/app/vault` — digital key/code vault (CRUD)
- `/app/trusted` — trusted contacts + lockbox code (CRUD)
- `/app/lockbox` — lockbox add-on purchase (Individual plan, stubbed payment)
- `/app/welcome-visit` — one-time welcome visit scheduling (Household+ plan)
- `/app/help` → `/app/help/[id]` — lockbox-first interstitial, then "Get help" dispatch request flow

## Database schema

See the `keepwell` Supabase project for the live schema (migrations: `init_keepwell_schema`,
`plans_subscriptions_guest_booking_analytics`, `guest_bookings_public_select_and_update`):
`members`, `vault_items`, `trusted_contacts`, `dispatch_requests`, `activity_log`,
`contact_messages`, `plans`, `subscriptions`, `lockbox_ledger`, `guest_bookings`,
`outbound_messages`, `analytics_events`. All member-scoped tables use RLS keyed to `auth.uid()`.

## Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=https://rgyzlfezyhwisfrtoczn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_4s-Jw_LVeV5YNE9bTczYMQ_9FYhPTcj
```

Already set in `.env.local` for local dev — add the same two vars in the Vercel project's
Environment Variables settings for production.

## Local development

```bash
npm install
npm run dev
```

## Deploy

```bash
npm i -g vercel
vercel link   # first time: creates/links the "keepwell" Vercel project
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel deploy --prod
```
