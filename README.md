# Keepwell

Keepwell is a property-access platform for homeowners, second-home owners, landlords, property managers, real-estate professionals and independent local service providers.

The product combines:

- one-off property-access service requests
- membership plans and covered-event benefits
- trusted contacts and lockbox/access information
- a digital property-access vault
- property service history
- B2B property workflows
- an independent provider marketplace

**Platform model:** Keepwell operates the software, marketplace rules and property-access records. Field services are performed by independent local providers.

## Stack

- Next.js 16 — App Router, Server Actions, TypeScript
- Tailwind CSS v4
- Supabase — auth and Postgres with row-level security

## Core routes

- `/` — platform homepage
- `/services` — customer service categories
- `/book` — one-off service-request flow
- `/pricing` — membership options
- `/how-it-works` — platform workflow and role separation
- `/second-homes` — second-home owner use case
- `/landlords` — landlord use case
- `/for-property-managers` — B2B property-management use case
- `/for-real-estate-agents` — real-estate partnership use case
- `/partner-tech` — independent provider acquisition
- `/trust-safety` — platform trust model
- `/app` — authenticated member area

## Environment variables

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
```

Do not commit production secrets.

## Development

```bash
npm install
npm run dev
```

## Production check

```bash
npm run build
```

## Launch blockers still requiring implementation

The redesign intentionally removes false claims of provider assignment, ETA and payment authorization. Before paid production launch, Keepwell still needs:

1. Real payment authorization / capture and membership activation.
2. Real provider profiles, onboarding, acceptance and marketplace-status transitions.
3. Explicit request states (`requested`, `matched`, `accepted`, `in_progress`, `completed`, `cancelled`) instead of the legacy database `dispatched` shortcut.
4. Final provider verification rules by service type and jurisdiction.
5. Final legal review for the actual operating entity, marketplace role and launch geography.
