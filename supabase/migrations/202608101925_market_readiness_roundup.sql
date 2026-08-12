-- Keepwell v3 migration retained for history only.
--
-- This migration originally introduced a separate provider travel-fee waiver
-- model. Keepwell v4 replaced that model with one all-in customer price and
-- Digital Sentinel / Household+ audit entitlements.
--
-- The v4 migration (202608112100_v4_market_loop.sql) is intentionally written
-- to work whether this historical migration was ever applied or not. Keeping
-- this file as a no-op lets environments with older migration history advance
-- safely without reintroducing obsolete travel-fee logic.

begin;
commit;
