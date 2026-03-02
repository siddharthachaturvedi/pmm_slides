-- Run this in your Supabase Dashboard → SQL Editor → New query
-- It creates the comments table and sets up Row Level Security

-- 1. Create the comments table
create table if not exists public.comments (
  id bigint generated always as identity primary key,
  slide_index integer not null,
  author_name text not null default 'Anonymous',
  body text not null,
  created_at timestamptz not null default now()
);

-- 2. Enable Row Level Security
alter table public.comments enable row level security;

-- 3. Allow anyone to read comments
create policy "Anyone can read comments"
  on public.comments
  for select
  using (true);

-- 4. Allow anonymous inserts (no auth required)
create policy "Anyone can insert comments"
  on public.comments
  for insert
  with check (true);

-- 5. Create an index for fast per-slide lookups
create index if not exists idx_comments_slide
  on public.comments (slide_index, created_at desc);
