-- =============================================================================
-- SmileFit — Add certifications column to profiles (idempotent)
-- =============================================================================
-- ⚠️  RUN THIS MANUALLY in the Supabase SQL Editor.
--     This is idempotent — safe to run even if the column already exists from
--     the instructor-schema.sql migration.
-- =============================================================================

alter table public.profiles
  add column if not exists certifications text[] default '{}';
