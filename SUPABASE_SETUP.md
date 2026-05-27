# Supabase Setup

This GitHub Pages version of Signworx Calendar uses Supabase for event storage. Create a new Supabase project for this calendar. Do not reuse another existing project unless you intentionally want this calendar data in that project.

## Create A New Project

1. Go to https://supabase.com/dashboard.
2. Create a new project.
3. Open Project Settings > API.
4. Copy the Project URL.
5. Copy the anon public key.

## Frontend Environment

Create `client/.env` locally:

```env
VITE_SUPABASE_URL=https://your-new-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

GitHub Pages static deployments must be rebuilt after these values change.

## Events Table

Run this SQL in the new Supabase project's SQL editor:

```sql
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text,
  client_name text,
  site_location text,
  start_date date not null,
  end_date date,
  assigned_to text,
  status text,
  priority text,
  all_day boolean default false,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.events enable row level security;
```

## Updated At Trigger

```sql
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_events_updated_at on public.events;

create trigger set_events_updated_at
before update on public.events
for each row
execute function public.set_updated_at();
```

## Optional Comments And Activity Tables

The app can show comments and recent activity. Run this SQL too if you want those existing panels to keep working online:

```sql
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events(id) on delete cascade,
  message text not null,
  user_name text,
  created_at timestamptz default now()
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events(id) on delete set null,
  action text,
  description text,
  changed_by_name text,
  created_at timestamptz default now()
);

alter table public.comments enable row level security;
alter table public.activity_logs enable row level security;
```

## Option A: Temporary Public Testing Policies

Use this only for internal/private testing when the app has no login yet. Anyone with the anon key and table URL can read, insert, update, and delete events.

```sql
create policy "Allow public read events"
on public.events
for select
to anon
using (true);

create policy "Allow public insert events"
on public.events
for insert
to anon
with check (true);

create policy "Allow public update events"
on public.events
for update
to anon
using (true)
with check (true);

create policy "Allow public delete events"
on public.events
for delete
to anon
using (true);

create policy "Allow public read comments"
on public.comments
for select
to anon
using (true);

create policy "Allow public insert comments"
on public.comments
for insert
to anon
with check (true);

create policy "Allow public read activity logs"
on public.activity_logs
for select
to anon
using (true);

create policy "Allow public insert activity logs"
on public.activity_logs
for insert
to anon
with check (true);
```

## Option B: Safer Authenticated-Only Policies

Use this after adding Supabase Auth. Anonymous visitors will not be able to read or change events.

```sql
create policy "Allow authenticated read events"
on public.events
for select
to authenticated
using (true);

create policy "Allow authenticated insert events"
on public.events
for insert
to authenticated
with check (true);

create policy "Allow authenticated update events"
on public.events
for update
to authenticated
using (true)
with check (true);

create policy "Allow authenticated delete events"
on public.events
for delete
to authenticated
using (true);

create policy "Allow authenticated read comments"
on public.comments
for select
to authenticated
using (true);

create policy "Allow authenticated insert comments"
on public.comments
for insert
to authenticated
with check (true);

create policy "Allow authenticated read activity logs"
on public.activity_logs
for select
to authenticated
using (true);

create policy "Allow authenticated insert activity logs"
on public.activity_logs
for insert
to authenticated
with check (true);
```

## Deploy To GitHub Pages

After `client/.env` is set:

```bash
cd client
npm run build
```

Copy `client/dist` to the `gh-pages` branch root and push that branch. GitHub Pages should be configured manually as:

- Source: Deploy from a branch
- Branch: `gh-pages`
- Folder: `/ (root)`
