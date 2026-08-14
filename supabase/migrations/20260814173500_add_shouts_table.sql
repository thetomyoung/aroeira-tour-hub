-- Slander Wall now persists posts instead of only broadcasting them live.
create table public.shouts (
  id uuid primary key default gen_random_uuid(),
  text text not null default '',
  image text,
  created_at timestamptz not null default now()
);

alter table public.shouts enable row level security;

create policy "public access shouts"
on public.shouts for all
to anon, authenticated
using (true)
with check (true);
