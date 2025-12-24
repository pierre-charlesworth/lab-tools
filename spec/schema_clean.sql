-- 1. PROFILES TABLE
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  username text,
  avatar_url text,
  preferences jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. PROTOCOLS TABLE
create table public.protocols (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text check (type in ('pcr_workspace', 'growth_curve_setup', 'timer_preset', 'general')),
  name text not null,
  description text,
  data jsonb not null default '{}'::jsonb,
  is_favorite boolean default false,
  last_used_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index protocols_user_id_idx on public.protocols(user_id);
create index protocols_type_idx on public.protocols(type);

-- 3. EXPERIMENTS TABLE
create table public.experiments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  protocol_id uuid references public.protocols(id) on delete set null,
  type text check (type in ('pcr_run', 'growth_curve_run', 'timer_log')),
  name text not null,
  notes text,
  status text check (status in ('running', 'completed', 'aborted')) default 'running',
  data jsonb not null default '{}'::jsonb,
  started_at timestamptz default now(),
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index experiments_user_id_started_at_idx on public.experiments(user_id, started_at desc);

-- 4. RLS POLICIES (Make sure RLS is enabled)
alter table public.profiles enable row level security;
alter table public.protocols enable row level security;
alter table public.experiments enable row level security;

-- Profiles Policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Protocols Policies
create policy "Users can view own protocols" on public.protocols for select using (auth.uid() = user_id);
create policy "Users can insert own protocols" on public.protocols for insert with check (auth.uid() = user_id);
create policy "Users can update own protocols" on public.protocols for update using (auth.uid() = user_id);
create policy "Users can delete own protocols" on public.protocols for delete using (auth.uid() = user_id);

-- Experiments Policies
create policy "Users can view own experiments" on public.experiments for select using (auth.uid() = user_id);
create policy "Users can insert own experiments" on public.experiments for insert with check (auth.uid() = user_id);
create policy "Users can update own experiments" on public.experiments for update using (auth.uid() = user_id);
create policy "Users can delete own experiments" on public.experiments for delete using (auth.uid() = user_id);
