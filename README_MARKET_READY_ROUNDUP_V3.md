# Keepwell market-readiness roundup v3

Apply this after the marketplace/provider patch.

## Included now
- $25 provider travel fee added to all one-off services.
- Travel fee goes to provider payout.
- Customer sees service + travel + total before submission.
- Daytime home lockout becomes $89 + $25 = $114 total; provider payout $65 + $25 = $90.
- Membership changes from free covered locksmith events to bounded travel-fee waivers.
- Individual $29: 1 travel-fee waiver/year.
- Household $49: 1 travel-fee waiver/year + household benefits + self-install lockbox.
- Household + Priority $89: 2 travel-fee waivers/year + priority matching.
- Access-code/PIN entry disabled until real application-level encryption exists.
- Remaining Digital Sentinel legal wording replaced with Keepwell/platform-only wording.

## Still P0 before unrestricted launch
- Stripe customer payment authorization/capture/refunds.
- Stripe Connect provider onboarding/payouts.
- SMS/email dispatch notifications.
- Completion/proof-of-work/customer rating flow.
- Cancellation/no-show/refund state machine.
- Final operating legal entity and Massachusetts legal review.
- Provider credential/licensing rules by service type.

## Apply
Use `APPLY_MARKET_READY_ROUNDUP_V3.ps1`, then run the new Supabase migration separately.
