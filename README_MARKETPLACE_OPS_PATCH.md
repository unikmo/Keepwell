# Keepwell marketplace operations patch

This patch adds the missing commercial/operations layer requested after the platform redesign.

## What changes

### Pricing
- `/pricing` now leads with the fixed one-off service menu.
- Membership comes second so the customer can compare it against a real alternative.
- `/services` and `/book` use the same central `src/lib/service-menu.ts` configuration.
- Standard scope and out-of-scope approval rules are explicit.

### Provider supply
- Preloaded Greater Boston provider profiles are inserted as **unclaimed**.
- `/providers` — provider directory
- `/providers/[slug]` — public profile status
- `/providers/claim` — claim an existing profile
- `/providers/register` — provider-only Supabase auth signup
- `/provider` — provider dashboard
  - verification state
  - availability on/off
  - job offers
  - fixed payout visible before acceptance
  - accept/decline
  - provider-entered ETA when accepting

### Keepwell internal operations
- `/admin` — network dashboard
  - provider supply counts
  - source phone numbers for outreach
  - pending profile claims
  - approve/reject claims
  - one-off service queue
  - manually send a fixed-payout offer to a verified provider
  - accepted-job count

This deliberately supports the Boston pilot with a manual operator queue before automated Uber-style broadcasting.

## Database setup

Run:

`supabase/migrations/202608101842_marketplace_provider_ops.sql`

in the Supabase SQL Editor (or through your normal migration workflow).

Then add your own authenticated Keepwell user to `admin_users`:

```sql
insert into public.admin_users(user_id)
select id from auth.users
where email='YOUR-KEEPWELL-LOGIN-EMAIL'
on conflict (user_id) do nothing;
```

## Important

The seed list is discovery data gathered from public business listings. A seeded profile is **not** a Keepwell partner. It remains `unclaimed` and cannot receive jobs until the business claims it and Keepwell approves it.

The source list is a starting Boston-area supply dataset, not a claim that every locksmith business in Greater Boston has been exhaustively discovered.

## Still required before paid public launch

1. Stripe/payment authorization + capture.
2. Provider outreach and real claim verification.
3. Validate pilot customer prices and provider payouts with actual Boston providers.
4. Provider completion/proof workflow and customer rating flow.
5. Incident/refund/cancellation operations.
6. Notification delivery (SMS/email) for offers, acceptance and customer updates.
