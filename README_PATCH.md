# Keepwell platform redesign patch

This patch updates the public experience and critical request-state UX so Keepwell is presented as a **property-access platform**, not as the locksmith or field-service operator.

## Included

- Rebuilt platform-first homepage and information architecture
- Mobile navigation and stronger tap targets
- New service, landlord and second-home pages
- Rewritten property-manager, real-estate and provider positioning
- Reworked membership framing while preserving the existing plans table
- Truthful service-request flow: no fake provider, rating, ETA or payment authorization
- Truthful member request flow: no random fake technician assignment
- Trust & safety positioning around marketplace responsibilities
- Keepwell brand normalization across the patched surfaces
- Sitemap, robots and improved root metadata / Organization structured data

## Important launch blockers that remain outside this patch

1. Connect a real payment flow before charging customers or activating paid membership.
2. Implement real provider onboarding, provider records, acceptance and provider-status transitions.
3. Migrate current database status values from the legacy `dispatched` shortcut to explicit marketplace states such as `requested`, `matched`, `accepted`, `in_progress`, `completed`, `cancelled`.
4. Consume covered membership events only after the business rule for accepted/completed service is implemented.
5. Have Terms, Privacy and Member Agreement reviewed and updated for the final legal entity, marketplace role, geography and payment model.
6. Configure `NEXT_PUBLIC_SITE_URL` to the production domain before launch.

## Applying the patch

Copy the contents of this folder into the Keepwell repository root, preserving paths, then run `npm run build`.
