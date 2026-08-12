# Keepwell v4 — Digital Sentinel + market loops

This release implements the agreed Boston launch model while keeping Keepwell platform-only. Independent local providers perform all field work.

## Pricing

Customer pricing is one all-in standard price. Provider travel/service call is included; Keepwell does not show a separate drive fee. Hardware and genuinely out-of-scope work require customer approval before work begins.

Launch menu:

- Weekday home lockout: $99 customer / $60 provider
- Evening/weekend home lockout: $129 / $65
- Overnight/holiday home lockout: $139 / $78
- Car lockout at the property: $109 / $60
- Standard rekey, first cylinder: $75 / $55
- Standard lock change labor: $89 / $60, hardware separate
- Smart-lock installation labor: $129 / $70, hardware separate

Provider payouts are complete fixed payouts shown before acceptance. They are not base payouts plus a travel add-on.

## Membership

Digital Sentinel activates immediately. Field-service membership benefits have a 14-day waiting period. Fixed-price one-off service remains available at any time.

Household+ remains $89/year and includes one Lock & Access Audit every three years. The first audit can be scheduled during the waiting period but cannot take place before field benefits become eligible. After a completed audit, the next included audit becomes available three years later.

## Digital Sentinel

Digital Sentinel stores access instructions, key locations, trusted access information, optional sensitive access details and private reference photos. Sensitive text is encrypted in the Next.js server with AES-256-GCM before ciphertext is persisted. Secret reveal requires password re-verification and a short-lived server-signed reveal token. Photos use a private Supabase Storage bucket with time-limited signed URLs.

Production requires a server-only environment variable:

`SENTINEL_ENCRYPTION_KEY=<at least 32 random characters>`

Do not expose that key with a `NEXT_PUBLIC_` prefix. Keepwell does not claim zero-knowledge or end-to-end encryption.

## Audit commercial rule

The independent provider inspects and submits the structured report to Keepwell. The provider must not quote, upsell, take a deposit or sell remedial work during the audit. Keepwell reviews the report, issues the official follow-up offer, and routes any customer-approved work back through the marketplace. Audit provider payout is $52.

## B2B loops

Property managers can create a workspace, add properties and submit resident lockout/rekey/access requests. Keepwell operations routes those jobs to verified independent providers and retains the service record.

Real-estate brokerages can create bulk orders for 10, 25, 50 or 100 memberships. Launch bulk pricing uses the published membership price until a deliberate volume-discount schedule is approved. Orders remain pending invoice until Keepwell records payment; only then are activation codes issued. The recipient owns the activated account and a gifted term does not silently renew on the agent's payment method.

## Database

Apply `supabase/migrations/202608112100_v4_market_loop.sql` to the Keepwell Supabase project before enabling the new authenticated v4 flows.

The migration clears legacy plaintext `vault_items.meta` values. If a production database contains meaningful content in that legacy field, export and review it before migration.

## Still required before unrestricted paid launch

Real Stripe customer authorization/capture/refunds, Stripe Connect provider onboarding/KYC/transfers, production communications, final provider credential/insurance rules, monitoring and recovery operations, Massachusetts legal review, and end-to-end payment/job lifecycle testing remain separate launch blockers.
