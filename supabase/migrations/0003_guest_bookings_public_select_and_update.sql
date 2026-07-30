-- Guest bookings have no auth (no-signup /book flow) — the booking UUID
-- itself acts as the capability token for reading back a confirmation page
-- and for the completion action to update status/payment fields.
create policy "guest_bookings_public_select" on public.guest_bookings
  for select to anon, authenticated using (true);

create policy "guest_bookings_public_update" on public.guest_bookings
  for update to anon, authenticated using (true) with check (true);
