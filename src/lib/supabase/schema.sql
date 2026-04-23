-- Paste this into Supabase SQL Editor (Dashboard → SQL Editor → New query → Run).
-- Safe to re-run: everything uses `if not exists` / `on conflict do nothing`.

create extension if not exists "pgcrypto";

-- ─── customers ─────────────────────────────────────────────
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9-]+$'),
  template_id text not null,
  recipient_name text not null,
  message text,
  music_url text,
  image_limit int not null default 3 check (image_limit > 0),
  created_at timestamptz not null default now()
);

-- ─── customer_images ───────────────────────────────────────
create table if not exists public.customer_images (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  storage_path text not null,
  order_index int not null default 0,
  caption text
);

create index if not exists customer_images_customer_order_idx
  on public.customer_images(customer_id, order_index);

-- ─── Row-Level Security ────────────────────────────────────
alter table public.customers enable row level security;
alter table public.customer_images enable row level security;

-- Anon can read (the public NFC landing fetches these).
drop policy if exists "public_read_customers" on public.customers;
create policy "public_read_customers" on public.customers
  for select using (true);

drop policy if exists "public_read_customer_images" on public.customer_images;
create policy "public_read_customer_images" on public.customer_images
  for select using (true);

-- No insert/update/delete policies — service role bypasses RLS
-- and handles all writes from the server.

-- ─── Storage bucket ────────────────────────────────────────
insert into storage.buckets (id, name, public)
  values ('customer-media', 'customer-media', true)
  on conflict (id) do nothing;

drop policy if exists "public_read_customer_media" on storage.objects;
create policy "public_read_customer_media" on storage.objects
  for select using (bucket_id = 'customer-media');
