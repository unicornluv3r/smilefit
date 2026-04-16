-- =============================================================================
-- SmileFit — Seed Mat Pilates classes for halle.atx@gmail.com
-- =============================================================================
-- ⚠️  RUN THIS MANUALLY in the Supabase SQL Editor.
--
-- Prerequisites:
--   - schema.sql, bookings-schema.sql, and instructor-schema.sql have been run
--   - A user with email halle.atx@gmail.com exists in auth.users
--     (sign up in the app first if not)
--
-- This script is idempotent — classes are upserted by stable UUIDs and
-- sessions are inserted only when they don't already exist for that class.
-- =============================================================================

do $$
declare
  instructor_uuid uuid;
  instructor_name_val text;
  instructor_bio_val text := 'Mat Pilates instructor based in Rome. I teach outdoor classes in the city''s most beautiful parks and piazzas, blending classical Pilates with mindful movement for all levels.';
  instructor_avatar_val text;
  class1 constant uuid := 'aaaa1111-0000-4000-8000-000000000001';
  class2 constant uuid := 'aaaa1111-0000-4000-8000-000000000002';
  class3 constant uuid := 'aaaa1111-0000-4000-8000-000000000003';
  class4 constant uuid := 'aaaa1111-0000-4000-8000-000000000004';
begin
  select id into instructor_uuid
  from auth.users
  where email = 'halle.atx@gmail.com'
  limit 1;

  if instructor_uuid is null then
    raise exception 'Instructor halle.atx@gmail.com not found in auth.users — sign up in the app first';
  end if;

  select
    coalesce(display_name, full_name, 'Halle'),
    avatar_url
  into instructor_name_val, instructor_avatar_val
  from public.profiles
  where id = instructor_uuid;

  -- Ensure the profile is marked as an instructor
  update public.profiles
  set role = 'instructor',
      is_verified_instructor = coalesce(is_verified_instructor, false),
      specialties = case
        when specialties is null or array_length(specialties, 1) is null
          then array['Pilates', 'Mat Pilates', 'Mobility']
        else specialties
      end
  where id = instructor_uuid;

  -- ─── Classes ─────────────────────────────────────────────────────────
  insert into public.classes (
    id, title, description, category, city, address,
    price, currency, duration_minutes, difficulty, spots_total,
    images, tags, what_to_bring, cancellation_policy, recurring_schedule,
    instructor_id, is_active,
    instructor_name, instructor_bio, instructor_avatar,
    instructor_rating, instructor_specialties
  ) values
    (
      class1,
      'Sunrise Mat Pilates at Villa Borghese',
      'Start your day with gentle strength and breath. This 60-minute mat Pilates class on the lawn of Villa Borghese combines classical Pilates principles with mindful movement. Perfect for all levels — modifications offered throughout. Bring a mat (or rent one for €2) and a water bottle.',
      'Pilates',
      'Roma',
      'Villa Borghese Gardens (near the Pincio Terrace), Roma',
      22.00, 'EUR', 60, 'Beginner', 12,
      array['https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200', 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=1200'],
      array['Outdoor', 'Morning', 'All Levels', 'Pilates', 'Scenic', 'English', 'Italian'],
      array['Yoga/Pilates mat (rentals €2)', 'Water bottle', 'Light layers'],
      'Free cancellation up to 24 hours before the session.',
      'Tuesday, Thursday, Saturday at 7:30 AM',
      instructor_uuid, true,
      instructor_name_val, instructor_bio_val, instructor_avatar_val,
      5.00, array['Pilates', 'Mat Pilates', 'Mobility']
    ),
    (
      class2,
      'Core & Mobility Flow at Terrazza del Pincio',
      'A dynamic mat Pilates class focused on core stability and spinal mobility. Small group, big views — we finish class with one of the best panoramas in Rome. Intermediate level recommended but beginners welcome with modifications.',
      'Pilates',
      'Roma',
      'Terrazza del Pincio (overlooking Piazza del Popolo), Roma',
      20.00, 'EUR', 50, 'Intermediate', 10,
      array['https://images.unsplash.com/photo-1540206395-68808572332f?w=1200', 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=1200'],
      array['Outdoor', 'Sunset', 'Core', 'Pilates', 'Scenic', 'English'],
      array['Pilates mat', 'Water bottle', 'Light jacket for after class'],
      'Free cancellation up to 12 hours before the session.',
      'Monday, Wednesday, Friday at 6:00 PM',
      instructor_uuid, true,
      instructor_name_val, instructor_bio_val, instructor_avatar_val,
      5.00, array['Pilates', 'Mat Pilates', 'Mobility']
    ),
    (
      class3,
      'Beginner Mat Pilates at Giardino degli Aranci',
      'Brand new to Pilates? This is your class. I''ll walk you through the foundational exercises — breath, neutral spine, core engagement — at a relaxed pace. Held in one of Rome''s most peaceful gardens, surrounded by orange trees and a view of the city. Mats available.',
      'Pilates',
      'Roma',
      'Giardino degli Aranci (Orange Garden), Aventine Hill, Roma',
      18.00, 'EUR', 45, 'Beginner', 15,
      array['https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=1200', 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=1200'],
      array['Outdoor', 'Beginner', 'Pilates', 'Garden', 'Weekend', 'English', 'Italian'],
      array['Mat (rentals available)', 'Water bottle', 'Comfortable clothing'],
      'Free cancellation up to 24 hours before the session.',
      'Saturday & Sunday at 10:00 AM',
      instructor_uuid, true,
      instructor_name_val, instructor_bio_val, instructor_avatar_val,
      5.00, array['Pilates', 'Mat Pilates', 'Mobility']
    ),
    (
      class4,
      'Power Pilates at Circus Maximus',
      'A challenging mat Pilates class for students who want to build serious core strength and endurance. Advanced variations, faster transitions, and a standing sequence to finish. Not recommended for beginners.',
      'Pilates',
      'Roma',
      'Circus Maximus (Circo Massimo), Roma',
      25.00, 'EUR', 60, 'Advanced', 8,
      array['https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200'],
      array['Outdoor', 'Advanced', 'Pilates', 'Strength', 'Morning', 'English'],
      array['Pilates mat', 'Towel', 'Water bottle'],
      'Free cancellation up to 24 hours before the session.',
      'Wednesday & Sunday at 7:00 AM',
      instructor_uuid, true,
      instructor_name_val, instructor_bio_val, instructor_avatar_val,
      5.00, array['Pilates', 'Mat Pilates', 'Mobility']
    )
  on conflict (id) do update set
    title = excluded.title,
    description = excluded.description,
    price = excluded.price,
    spots_total = excluded.spots_total,
    images = excluded.images,
    tags = excluded.tags,
    what_to_bring = excluded.what_to_bring,
    instructor_id = excluded.instructor_id,
    is_active = true,
    instructor_name = excluded.instructor_name,
    instructor_bio = excluded.instructor_bio,
    instructor_avatar = excluded.instructor_avatar,
    instructor_rating = excluded.instructor_rating,
    instructor_specialties = excluded.instructor_specialties;

  -- ─── Sessions (only seed if none exist yet for a given class) ────────
  -- Class 1 — Sunrise 7:30 AM, 3 sessions over next 2 weeks
  if not exists (select 1 from public.class_sessions where class_id = class1) then
    insert into public.class_sessions (class_id, start_time, end_time, spots_remaining)
    values
      (class1, date_trunc('day', now()) + interval '2 days 7 hours 30 minutes',
               date_trunc('day', now()) + interval '2 days 8 hours 30 minutes', 12),
      (class1, date_trunc('day', now()) + interval '6 days 7 hours 30 minutes',
               date_trunc('day', now()) + interval '6 days 8 hours 30 minutes', 12),
      (class1, date_trunc('day', now()) + interval '11 days 7 hours 30 minutes',
               date_trunc('day', now()) + interval '11 days 8 hours 30 minutes', 12);
  end if;

  -- Class 2 — Core & Mobility 6:00 PM, 3 sessions over next 2 weeks
  if not exists (select 1 from public.class_sessions where class_id = class2) then
    insert into public.class_sessions (class_id, start_time, end_time, spots_remaining)
    values
      (class2, date_trunc('day', now()) + interval '3 days 18 hours',
               date_trunc('day', now()) + interval '3 days 18 hours 50 minutes', 10),
      (class2, date_trunc('day', now()) + interval '7 days 18 hours',
               date_trunc('day', now()) + interval '7 days 18 hours 50 minutes', 10),
      (class2, date_trunc('day', now()) + interval '12 days 18 hours',
               date_trunc('day', now()) + interval '12 days 18 hours 50 minutes', 10);
  end if;

  -- Class 3 — Beginner 10:00 AM, 4 weekend sessions
  if not exists (select 1 from public.class_sessions where class_id = class3) then
    insert into public.class_sessions (class_id, start_time, end_time, spots_remaining)
    values
      (class3, date_trunc('day', now()) + interval '4 days 10 hours',
               date_trunc('day', now()) + interval '4 days 10 hours 45 minutes', 15),
      (class3, date_trunc('day', now()) + interval '5 days 10 hours',
               date_trunc('day', now()) + interval '5 days 10 hours 45 minutes', 15),
      (class3, date_trunc('day', now()) + interval '11 days 10 hours',
               date_trunc('day', now()) + interval '11 days 10 hours 45 minutes', 15),
      (class3, date_trunc('day', now()) + interval '12 days 10 hours',
               date_trunc('day', now()) + interval '12 days 10 hours 45 minutes', 15);
  end if;

  -- Class 4 — Power 7:00 AM, 2 sessions over next 2 weeks
  if not exists (select 1 from public.class_sessions where class_id = class4) then
    insert into public.class_sessions (class_id, start_time, end_time, spots_remaining)
    values
      (class4, date_trunc('day', now()) + interval '5 days 7 hours',
               date_trunc('day', now()) + interval '5 days 8 hours', 8),
      (class4, date_trunc('day', now()) + interval '12 days 7 hours',
               date_trunc('day', now()) + interval '12 days 8 hours', 8);
  end if;

  -- Update instructor's class count on their profile
  update public.profiles
  set total_classes_taught = (
    select count(*) from public.classes
    where instructor_id = instructor_uuid and is_active = true
  )
  where id = instructor_uuid;

end $$;
