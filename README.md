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
- `/login`, `/signup` — Supabase-authenticated login / signup
- `/contact` — support form, writes to `contact_messages`
- `/dashboard` — member dashboard (membership status, vault, trusted access, activity), auth-gated
- `/dashboard/vault` — digital key/code vault (CRUD)
- `/dashboard/trusted` — trusted contacts + lockbox code (CRUD)
- `/dashboard/help` → `/dashboard/help/[id]` — "Get help" dispatch request flow

## Database schema

See the `keepwell` Supabase project for the live schema (migration: `init_keepwell_schema`):
`members`, `vault_items`, `trusted_contacts`, `dispatch_requests`, `activity_log`,
`contact_messages`. All member-scoped tables use RLS keyed to `auth.uid()`.

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
