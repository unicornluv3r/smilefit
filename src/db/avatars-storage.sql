-- =============================================================================
-- SmileFit — Avatars Storage Bucket & RLS
-- =============================================================================
-- This file sets up a Supabase Storage bucket for profile photos with row-level
-- security policies so users can only manage their own avatars.
--
-- ⚠️  RUN THIS MANUALLY — do not execute it automatically from the app.
--     1. Open your Supabase project → SQL Editor → New query
--     2. Paste this entire file and run it
--     3. Verify the "avatars" bucket appears under Storage in the dashboard
--     4. Test by uploading a profile photo in the app — RLS must allow writes
--        under a folder named with the user's auth.uid()
-- =============================================================================

-- Create the avatars storage bucket (public read, authenticated write)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  2097152, -- 2 MB limit
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- RLS Policies for the avatars bucket

-- Anyone can view avatars (public profile photos)
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Authenticated users can upload their own avatar
-- Files must be stored under a folder named after the user's ID
create policy "Users can upload their own avatar"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can update their own avatar
create policy "Users can update their own avatar"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can delete their own avatar
create policy "Users can delete their own avatar"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
