-- Create user profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  created_at timestamptz default now()
);

-- Create quantum circuits library table
create table public.quantum_circuits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  guppy_code text not null,
  circuit_type text,
  parameters jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create quantum job execution history table
create table public.quantum_jobs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  circuit_id uuid references public.quantum_circuits(id) on delete set null,
  status text default 'pending',
  backend_type text not null,
  shots integer default 1024,
  parameters jsonb default '{}'::jsonb,
  results jsonb,
  error_message text,
  execution_time_ms integer,
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.quantum_circuits enable row level security;
alter table public.quantum_jobs enable row level security;

-- RLS Policies for profiles
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- RLS Policies for quantum_circuits
create policy "Users can view own circuits"
  on public.quantum_circuits for select
  using (auth.uid() = user_id);

create policy "Users can insert own circuits"
  on public.quantum_circuits for insert
  with check (auth.uid() = user_id);

create policy "Users can update own circuits"
  on public.quantum_circuits for update
  using (auth.uid() = user_id);

create policy "Users can delete own circuits"
  on public.quantum_circuits for delete
  using (auth.uid() = user_id);

-- RLS Policies for quantum_jobs
create policy "Users can view own jobs"
  on public.quantum_jobs for select
  using (auth.uid() = user_id);

create policy "Users can insert own jobs"
  on public.quantum_jobs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own jobs"
  on public.quantum_jobs for update
  using (auth.uid() = user_id);

create policy "Users can delete own jobs"
  on public.quantum_jobs for delete
  using (auth.uid() = user_id);

-- Auto-create profile trigger function
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email)
  );
  return new;
end;
$$;

-- Trigger to auto-create profile on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();