# Database Schema (Supabase / PostgreSQL)

## Overview
This schema is designed for the Lab Companion App. It uses **PostgreSQL** hosted on Supabase.
*   **Auth**: Managed by Supabase Auth (GoTrue).
*   **Public Tables**: All data lives in the `public` schema.
*   **Security**: Row Level Security (RLS) is ENABLED on all tables. Users can only access their own data.

## Tables

### 1. `profiles`
Extends the default `auth.users` table with application-specific user data.

```sql
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  username text,
  avatar_url text,
  preferences jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS: Users can view/edit their own profile
```

### 2. `protocols`
The "Library" of saved configurations (PCR setups, Timer presets, etc.).

```sql
create table public.protocols (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  
  -- Discriminator for what kind of data this is
  type text check (type in ('pcr_workspace', 'growth_curve_setup', 'timer_preset', 'general')),
  
  name text not null,
  description text,
  
  -- The core payload. 
  -- For PCR: { "primers": [], "mastermix": {}, "cycler": {} }
  data jsonb not null default '{}'::jsonb,
  
  is_favorite boolean default false,
  last_used_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for faster library lookups
create index protocols_user_id_idx on public.protocols(user_id);
create index protocols_type_idx on public.protocols(type);
```

### 3. `experiments`
Runtime logs of actual lab work. Distinct from protocols (planning) -> this is execution.

```sql
create table public.experiments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  
  -- Optional link to the protocol used as a template
  protocol_id uuid references public.protocols(id) on delete set null,
  
  type text check (type in ('pcr_run', 'growth_curve_run', 'timer_log')),
  name text not null, -- e.g. "E. coli Growth Curve #4"
  notes text,
  
  status text check (status in ('running', 'completed', 'aborted')) default 'running',
  
  -- Runtime data.
  -- For Growth: { "timepoints": [...], "ods": [...] }
  data jsonb not null default '{}'::jsonb,
  
  started_at timestamptz default now(),
  completed_at timestamptz,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for history views
create index experiments_user_id_started_at_idx on public.experiments(user_id, started_at desc);
```

## Security Policies (RLS)

All tables typically follow the standard "Owner Only" policy:

```sql
-- Example for protocols
create policy "Users can view their own protocols" 
on public.protocols for select 
using ( auth.uid() = user_id );

create policy "Users can insert their own protocols" 
on public.protocols for insert 
with check ( auth.uid() = user_id );

create policy "Users can update their own protocols" 
on public.protocols for update 
using ( auth.uid() = user_id );

create policy "Users can delete their own protocols" 
on public.protocols for delete 
using ( auth.uid() = user_id );
```

## Types for TypeScript
We will use `supabase gen types` to automatically generate these into `src/types/supabase.ts`.
