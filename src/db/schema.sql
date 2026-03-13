-- SmileFit Database Schema
-- Run this manually in the Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)
-- This creates the profiles table and supporting triggers for the SmileFit app.

-- ─── Profiles table ───────────────────────────────────────────────────
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  display_name text,
  avatar_url text,
  bio text,
  city text,
  role text check (role in ('user', 'instructor', 'admin')) default 'user',
  favorite_categories text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── Row Level Security ───────────────────────────────────────────────
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ─── Auto-create profile on signup ────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Auto-update updated_at ──────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_profile_updated
  before update on public.profiles
  for each row execute function public.handle_updated_at();
