-- SmileFit Booking System Schema
-- Run this manually in the Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)
-- Prerequisites: Run schema.sql first (profiles table must exist)

-- ─── Classes table ────────────────────────────────────────────────────
create table public.classes (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  category text not null,
  city text not null,
  address text,
  latitude double precision,
  longitude double precision,
  price decimal(10,2) not null,
  currency text default 'EUR',
  duration_minutes integer not null,
  difficulty text check (difficulty in ('Beginner', 'Intermediate', 'Advanced')) not null,
  spots_total integer not null,
  images text[] default '{}',
  tags text[] default '{}',
  what_to_bring text[] default '{}',
  cancellation_policy text,
  recurring_schedule text,
  instructor_id uuid references public.profiles(id),
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── Class sessions ───────────────────────────────────────────────────
create table public.class_sessions (
  id uuid default gen_random_uuid() primary key,
  class_id uuid references public.classes(id) on delete cascade not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  spots_remaining integer not null,
  is_cancelled boolean default false,
  created_at timestamptz default now()
);

-- ─── Bookings table ──────────────────────────────────────────────────
create table public.bookings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  class_id uuid references public.classes(id) on delete cascade not null,
  session_id uuid references public.class_sessions(id) on delete cascade not null,
  quantity integer not null default 1,
  total_price decimal(10,2) not null,
  currency text default 'EUR',
  status text check (status in ('confirmed', 'cancelled', 'completed', 'no_show')) default 'confirmed',
  payment_status text check (payment_status in ('pending', 'paid', 'refunded', 'free')) default 'pending',
  payment_intent_id text,
  booked_at timestamptz default now(),
  cancelled_at timestamptz,
  cancellation_reason text
);

-- ─── Row Level Security ──────────────────────────────────────────────
alter table public.classes enable row level security;
alter table public.class_sessions enable row level security;
alter table public.bookings enable row level security;

-- Classes policies
create policy "Classes are viewable by everyone"
  on public.classes for select using (true);

create policy "Instructors can insert their own classes"
  on public.classes for insert
  with check (auth.uid() = instructor_id);

create policy "Instructors can update their own classes"
  on public.classes for update
  using (auth.uid() = instructor_id);

-- Class sessions policies
create policy "Sessions are viewable by everyone"
  on public.class_sessions for select using (true);

create policy "Instructors can manage sessions for their classes"
  on public.class_sessions for all
  using (
    exists (
      select 1 from public.classes
      where classes.id = class_sessions.class_id
      and classes.instructor_id = auth.uid()
    )
  );

-- Bookings policies
create policy "Users can view their own bookings"
  on public.bookings for select
  using (auth.uid() = user_id);

create policy "Users can create their own bookings"
  on public.bookings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own bookings"
  on public.bookings for update
  using (auth.uid() = user_id);

create policy "Instructors can view bookings for their classes"
  on public.bookings for select
  using (
    exists (
      select 1 from public.classes
      where classes.id = bookings.class_id
      and classes.instructor_id = auth.uid()
    )
  );

-- Updated_at trigger for classes
create trigger on_class_updated
  before update on public.classes
  for each row execute function public.handle_updated_at();

-- ─── Seed data ───────────────────────────────────────────────────────
insert into public.classes (id, title, description, category, city, address, price, duration_minutes, difficulty, spots_total, images, tags, what_to_bring, cancellation_policy, recurring_schedule)
values
  ('11111111-1111-1111-1111-111111111111', 'Sunrise Yoga at Parco degli Acquedotti', 'Start your morning with a rejuvenating yoga flow surrounded by the ancient Roman aqueducts of Parco degli Acquedotti. This stunning open-air setting on the outskirts of Rome offers a uniquely inspiring backdrop — towering stone arches framing the golden sunrise as you move through your practice.', 'Yoga', 'Roma', 'Parco degli Acquedotti, Via Lemonia, Roma', 18.00, 75, 'Beginner', 15, ARRAY['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200'], ARRAY['Outdoor', 'Morning', 'All Levels', 'Small Group', 'Scenic'], ARRAY['Yoga mat', 'Water bottle', 'Sunscreen', 'Light layers'], 'Free cancellation up to 24 hours before the session. Cancellations within 24 hours will be charged 50% of the class fee. No-shows are charged the full amount.', 'Every Tuesday & Thursday'),
  ('22222222-2222-2222-2222-222222222222', 'HIIT Bootcamp at Parco Sempione', 'High-intensity interval training in the heart of Milan. Push your limits with a mix of cardio, strength, and agility drills in one of Milan''s most beautiful parks with views of the Arco della Pace.', 'HIIT', 'Milano', 'Parco Sempione, Milano', 22.00, 60, 'Intermediate', 20, ARRAY['https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=1200'], ARRAY['Outdoor', 'High Energy', 'Full Body', 'Morning'], ARRAY['Water bottle', 'Towel', 'Running shoes'], 'Free cancellation up to 12 hours before the session.', 'Every Monday, Wednesday & Friday'),
  ('33333333-3333-3333-3333-333333333333', 'Pilates on the Arno', 'A serene Pilates session along the banks of the Arno River in Florence. Focus on core strength, flexibility, and mindful movement with the Ponte Vecchio in the background.', 'Pilates', 'Firenze', 'Lungarno delle Grazie, Firenze', 20.00, 60, 'Beginner', 12, ARRAY['https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200'], ARRAY['Outdoor', 'Core', 'Relaxing', 'Scenic', 'River View'], ARRAY['Pilates mat', 'Water bottle', 'Comfortable clothing'], 'Free cancellation up to 24 hours before the session.', 'Every Wednesday & Saturday'),
  ('44444444-4444-4444-4444-444444444444', 'Beach Bootcamp at Lido', 'Train on the sandy shores of Venice Lido with a challenging full-body bootcamp. The beach setting adds natural resistance to every movement, making this an unforgettable workout.', 'Bootcamp', 'Venezia', 'Lido di Venezia, Venezia', 25.00, 45, 'Advanced', 16, ARRAY['https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1200'], ARRAY['Beach', 'Outdoor', 'Full Body', 'Challenge'], ARRAY['Water bottle', 'Towel', 'Sunscreen', 'Sand-appropriate shoes'], 'Free cancellation up to 48 hours before. No refunds within 48 hours.', 'Every Saturday & Sunday'),
  ('55555555-5555-5555-5555-555555555555', 'Sunset Run Club at Villa Borghese', 'Join our social running group for a scenic 5K through the beautiful Villa Borghese gardens at sunset. All paces welcome — we run together, not against each other.', 'Running', 'Roma', 'Villa Borghese, Piazzale del Museo Borghese, Roma', 12.00, 50, 'Intermediate', 25, ARRAY['https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200'], ARRAY['Outdoor', 'Social', 'Running', 'Sunset', 'All Paces'], ARRAY['Running shoes', 'Water bottle', 'Light jacket'], 'Free cancellation anytime before the session starts.', 'Every Tuesday & Thursday evening'),
  ('66666666-6666-6666-6666-666666666666', 'Morning Meditation at Giardini di Boboli', 'Find inner peace in the Renaissance splendor of the Boboli Gardens. This guided meditation session combines breathwork, mindfulness, and gentle stretching in one of Florence''s most magical settings.', 'Meditation', 'Firenze', 'Giardino di Boboli, Firenze', 15.00, 45, 'Beginner', 10, ARRAY['https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200'], ARRAY['Outdoor', 'Mindfulness', 'Morning', 'Garden', 'Peaceful'], ARRAY['Meditation cushion (optional)', 'Water bottle', 'Blanket'], 'Free cancellation up to 24 hours before.', 'Every Monday, Wednesday & Friday');

-- Seed sessions for the next 4 weeks
insert into public.class_sessions (class_id, start_time, end_time, spots_remaining)
select
  c.id,
  d.session_date + interval '6 hours 30 minutes',
  d.session_date + interval '6 hours 30 minutes' + (c.duration_minutes || ' minutes')::interval,
  c.spots_total
from public.classes c
cross join (
  select generate_series(
    current_date + interval '1 day',
    current_date + interval '28 days',
    interval '1 day'
  )::date as session_date
) d
where
  (c.id = '11111111-1111-1111-1111-111111111111' and extract(dow from d.session_date) in (2, 4)) or
  (c.id = '22222222-2222-2222-2222-222222222222' and extract(dow from d.session_date) in (1, 3, 5)) or
  (c.id = '33333333-3333-3333-3333-333333333333' and extract(dow from d.session_date) in (3, 6)) or
  (c.id = '44444444-4444-4444-4444-444444444444' and extract(dow from d.session_date) in (0, 6)) or
  (c.id = '55555555-5555-5555-5555-555555555555' and extract(dow from d.session_date) in (2, 4)) or
  (c.id = '66666666-6666-6666-6666-666666666666' and extract(dow from d.session_date) in (1, 3, 5));
