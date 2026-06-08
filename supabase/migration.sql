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
