-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query).
-- Creates the `posts` table that lib/posts.js and the /api/posts routes expect,
-- and locks it down with RLS so only published posts are publicly readable.
-- Writes (insert/update/delete) and reading drafts go through the service-role
-- key in our API routes after verifying the signed-in user is an admin email.

create table if not exists public.posts (
  id bigint generated always as identity primary key,
  title text not null,
  slug text not null unique,
  excerpt text default '',
  content text not null default '',
  tags text[] default '{}',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.posts enable row level security;

drop policy if exists "Public can read published posts" on public.posts;
create policy "Public can read published posts"
  on public.posts
  for select
  using (published = true);

-- Comments — anonymous (name + text), auto-published, moderated via the
-- admin dashboard using the service-role key.
create table if not exists public.comments (
  id bigint generated always as identity primary key,
  post_slug text not null references public.posts(slug) on update cascade on delete cascade,
  name text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists comments_post_slug_idx on public.comments(post_slug);

alter table public.comments enable row level security;

drop policy if exists "Public can read comments" on public.comments;
create policy "Public can read comments"
  on public.comments
  for select
  using (true);

drop policy if exists "Public can add comments" on public.comments;
create policy "Public can add comments"
  on public.comments
  for insert
  with check (
    char_length(name) between 1 and 60
    and char_length(content) between 1 and 2000
  );
