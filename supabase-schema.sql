-- =============================================
-- IRALINK DASHBOARD — Supabase Schema
-- Run this in the Supabase SQL Editor
-- =============================================

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- =============================================
-- PROFILES (extends Supabase auth.users)
-- =============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null default '',
  company_name text default '',
  industry text default '',
  team_size int default 1,
  plan text default 'trial' check (plan in ('trial', 'starter', 'pro', 'enterprise')),
  stripe_customer_id text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, company_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'company_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================
-- ORGANIZATIONS
-- =============================================
create table public.organizations (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  industry text default '',
  team_size int default 1,
  settings jsonb default '{}',
  created_at timestamptz default now()
);

-- =============================================
-- AUTOMATIONS
-- =============================================
create table public.automations (
  id uuid default uuid_generate_v4() primary key,
  org_id uuid references public.organizations(id) on delete cascade not null,
  name text not null,
  description text default '',
  status text default 'draft' check (status in ('active', 'paused', 'suggested', 'failed', 'draft')),
  trigger_config text default '',
  actions jsonb default '[]',
  time_saved_hours numeric default 0,
  runs_count int default 0,
  success_rate numeric default 0,
  created_by text default 'user' check (created_by in ('ai', 'user')),
  last_run_at timestamptz,
  created_at timestamptz default now()
);

-- =============================================
-- INTEGRATIONS
-- =============================================
create table public.integrations (
  id uuid default uuid_generate_v4() primary key,
  org_id uuid references public.organizations(id) on delete cascade not null,
  type text not null,
  name text not null,
  status text default 'disconnected' check (status in ('connected', 'disconnected', 'error', 'pending')),
  config jsonb default '{}',
  last_sync_at timestamptz,
  created_at timestamptz default now()
);

-- =============================================
-- AI ANALYSES
-- =============================================
create table public.ai_analyses (
  id uuid default uuid_generate_v4() primary key,
  org_id uuid references public.organizations(id) on delete cascade not null,
  date date default current_date,
  type text default 'weekly' check (type in ('weekly', 'daily', 'on_demand')),
  findings jsonb default '[]',
  recommendations jsonb default '[]',
  automations_suggested int default 0,
  time_saved_potential numeric default 0,
  score int default 0,
  status text default 'pending' check (status in ('completed', 'in_progress', 'pending')),
  created_at timestamptz default now()
);

-- =============================================
-- AI LOGS
-- =============================================
create table public.ai_logs (
  id uuid default uuid_generate_v4() primary key,
  org_id uuid references public.organizations(id) on delete cascade not null,
  action text not null,
  details text default '',
  status text default 'info' check (status in ('success', 'error', 'info')),
  created_at timestamptz default now()
);

-- =============================================
-- FILES
-- =============================================
create table public.files (
  id uuid default uuid_generate_v4() primary key,
  org_id uuid references public.organizations(id) on delete cascade not null,
  name text not null,
  type text not null,
  size_bytes bigint default 0,
  storage_path text not null,
  analyzed boolean default false,
  analysis_result jsonb,
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- =============================================
-- BILLING
-- =============================================
create table public.billing (
  id uuid default uuid_generate_v4() primary key,
  org_id uuid references public.organizations(id) on delete cascade not null,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text default 'trial',
  status text default 'active' check (status in ('active', 'canceled', 'past_due', 'trialing')),
  current_period_end timestamptz,
  created_at timestamptz default now()
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.automations enable row level security;
alter table public.integrations enable row level security;
alter table public.ai_analyses enable row level security;
alter table public.ai_logs enable row level security;
alter table public.files enable row level security;
alter table public.billing enable row level security;

-- Profiles: users can read/update their own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Organizations: owner has full access
create policy "Org owner full access" on public.organizations
  for all using (auth.uid() = owner_id);

-- Automations: org members can access
create policy "Automations org access" on public.automations
  for all using (
    org_id in (select id from public.organizations where owner_id = auth.uid())
  );

-- Integrations: org members can access
create policy "Integrations org access" on public.integrations
  for all using (
    org_id in (select id from public.organizations where owner_id = auth.uid())
  );

-- AI Analyses: org members can access
create policy "AI analyses org access" on public.ai_analyses
  for all using (
    org_id in (select id from public.organizations where owner_id = auth.uid())
  );

-- AI Logs: org members can access
create policy "AI logs org access" on public.ai_logs
  for all using (
    org_id in (select id from public.organizations where owner_id = auth.uid())
  );

-- Files: org members can access
create policy "Files org access" on public.files
  for all using (
    org_id in (select id from public.organizations where owner_id = auth.uid())
  );

-- Billing: org members can view
create policy "Billing org access" on public.billing
  for all using (
    org_id in (select id from public.organizations where owner_id = auth.uid())
  );

-- =============================================
-- INDEXES
-- =============================================
create index idx_automations_org on public.automations(org_id);
create index idx_automations_status on public.automations(status);
create index idx_integrations_org on public.integrations(org_id);
create index idx_ai_analyses_org on public.ai_analyses(org_id);
create index idx_ai_logs_org on public.ai_logs(org_id);
create index idx_files_org on public.files(org_id);

-- =============================================
-- STORAGE BUCKET
-- =============================================
insert into storage.buckets (id, name, public) values ('company-files', 'company-files', false);

create policy "Authenticated users can upload files" on storage.objects
  for insert with check (bucket_id = 'company-files' and auth.role() = 'authenticated');

create policy "Users can view own org files" on storage.objects
  for select using (bucket_id = 'company-files' and auth.role() = 'authenticated');
