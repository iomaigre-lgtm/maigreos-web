-- Workspaces (one per agency)
create table workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  created_at timestamptz default now()
);

-- Link users to workspaces
create table workspace_members (
  workspace_id uuid references workspaces(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null default 'owner',
  primary key (workspace_id, user_id)
);

-- Agency context (equivalent to _memoria/empresa.md)
create table agency_context (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid unique references workspaces(id) on delete cascade,
  mission text,
  voice text,
  services text,
  icp text,
  updated_at timestamptz default now()
);

-- Clients
create table clients (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  name text not null,
  industry text,
  created_at timestamptz default now()
);

-- Client context
create table client_context (
  id uuid primary key default gen_random_uuid(),
  client_id uuid unique references clients(id) on delete cascade,
  briefing text,
  voice text,
  services text,
  icp text,
  visual_identity jsonb default '{}',
  updated_at timestamptz default now()
);

-- API keys (encrypted)
create table api_keys (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  provider text not null check (provider in ('claude', 'openai')),
  encrypted_key text not null,
  created_at timestamptz default now(),
  unique (workspace_id, provider)
);

-- Generation history
create table generations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  client_id uuid references clients(id) on delete set null,
  skill text not null,
  input jsonb not null default '{}',
  output text not null default '',
  created_at timestamptz default now()
);

-- RLS
alter table workspaces enable row level security;
alter table workspace_members enable row level security;
alter table agency_context enable row level security;
alter table clients enable row level security;
alter table client_context enable row level security;
alter table api_keys enable row level security;
alter table generations enable row level security;

-- Helper: get current user's workspace_id
create or replace function my_workspace_id()
returns uuid language sql stable as $$
  select workspace_id from workspace_members where user_id = auth.uid() limit 1;
$$;

-- RLS policies
create policy "workspace members only" on workspaces
  for all using (id = my_workspace_id());

create policy "workspace members only" on agency_context
  for all using (workspace_id = my_workspace_id());

create policy "workspace members only" on clients
  for all using (workspace_id = my_workspace_id());

create policy "workspace members only" on client_context
  for all using (
    client_id in (select id from clients where workspace_id = my_workspace_id())
  );

create policy "workspace members only" on api_keys
  for all using (workspace_id = my_workspace_id());

create policy "workspace members only" on generations
  for all using (workspace_id = my_workspace_id());
