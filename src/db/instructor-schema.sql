-- SmileFit Instructor Schema
-- Run this manually in the Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)
-- Prerequisites: Run schema.sql and bookings-schema.sql first

-- ─── Add instructor columns to profiles ───────────────────────────────
-- These columns are populated when a real user clicks "Become an Instructor"
alter table public.profiles
  add column if not exists specialties text[] default '{}',
  add column if not exists certifications text[] default '{}',
  add column if not exists years_experience integer,
  add column if not exists instagram_handle text,
  add column if not exists website_url text,
  add column if not exists is_verified_instructor boolean default false,
  add column if not exists total_classes_taught integer default 0,
  add column if not exists average_rating decimal(3,2) default 0;

-- ─── Add instructor display columns to classes ──────────────────────
-- These columns store denormalized instructor info so the UI can show
-- instructor details without requiring a matching auth.users / profiles row.
-- When a real instructor creates a class, instructor_id links to their profile
-- and these columns are populated from their profile data.
alter table public.classes
  add column if not exists instructor_name text,
  add column if not exists instructor_bio text,
  add column if not exists instructor_avatar text,
  add column if not exists instructor_rating decimal(3,2),
  add column if not exists instructor_specialties text[] default '{}';

-- ─── Seed instructor display info on existing classes ───────────────
update public.classes set
  instructor_name = 'Sofia Bianchi',
  instructor_bio = 'Certified yoga and meditation instructor with 8+ years of experience teaching in Rome''s most beautiful outdoor spaces.',
  instructor_avatar = 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200&h=200&fit=crop&crop=face',
  instructor_rating = 4.90,
  instructor_specialties = ARRAY['Vinyasa', 'Hatha', 'Meditation']
where id in ('11111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555');

update public.classes set
  instructor_name = 'Marco Rossi',
  instructor_bio = 'Former professional athlete turned fitness coach. Specializing in HIIT and bootcamp training across Milan''s parks.',
  instructor_avatar = 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face',
  instructor_rating = 4.80,
  instructor_specialties = ARRAY['HIIT', 'Bootcamp', 'Strength Training']
where id = '22222222-2222-2222-2222-222222222222';

update public.classes set
  instructor_name = 'Giulia Ferrari',
  instructor_bio = 'Pilates instructor and movement specialist based in Florence. Classes blend classical Pilates with modern functional movement.',
  instructor_avatar = 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=200&h=200&fit=crop&crop=face',
  instructor_rating = 4.70,
  instructor_specialties = ARRAY['Pilates', 'Barre', 'Functional Movement']
where id in ('33333333-3333-3333-3333-333333333333', '66666666-6666-6666-6666-666666666666');

update public.classes set
  instructor_name = 'Luca Moretti',
  instructor_bio = 'Endurance coach and running enthusiast. Leads social run clubs and bootcamps across Rome and Venice.',
  instructor_avatar = 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&h=200&fit=crop&crop=face',
  instructor_rating = 4.85,
  instructor_specialties = ARRAY['Running', 'Bootcamp', 'Endurance']
where id = '44444444-4444-4444-4444-444444444444';

-- ─── Reviews table ────────────────────────────────────────────────────
create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  booking_id uuid references public.bookings(id) on delete cascade unique not null,
  class_id uuid references public.classes(id) on delete cascade not null,
  reviewer_id uuid references public.profiles(id) on delete cascade not null,
  instructor_id uuid references public.profiles(id) on delete cascade,
  rating integer check (rating >= 1 and rating <= 5) not null,
  comment text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.reviews enable row level security;

create policy "Reviews are viewable by everyone"
  on public.reviews for select using (true);

create policy "Users can create reviews for their bookings"
  on public.reviews for insert
  with check (auth.uid() = reviewer_id);

create policy "Users can update their own reviews"
  on public.reviews for update
  using (auth.uid() = reviewer_id);

create trigger on_review_updated
  before update on public.reviews
  for each row execute function public.handle_updated_at();
