-- Esquema base multi-tenant para hoteles.

create extension if not exists pgcrypto;

create table if not exists tenants (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  plan text not null default 'starter',
  created_at timestamptz not null default now()
);

create table if not exists hotel_users (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  email text not null,
  role text not null check (role in ('owner', 'manager', 'agent', 'viewer')),
  created_at timestamptz not null default now(),
  unique (tenant_id, email)
);

create table if not exists bot_configs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  bot_name text not null,
  locale text not null default 'es',
  tone text not null default 'professional',
  prompt_override text,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id)
);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  channel text not null,
  guest_id text,
  status text not null default 'open',
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_type text not null check (sender_type in ('guest', 'bot', 'agent', 'system')),
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- RLS
alter table tenants enable row level security;
alter table hotel_users enable row level security;
alter table bot_configs enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;

-- Convención: set_config('app.tenant_id', '<uuid>', true) al inicio de cada request.
create policy tenant_isolation_tenants
  on tenants
  using (id::text = current_setting('app.tenant_id', true));

create policy tenant_isolation_hotel_users
  on hotel_users
  using (tenant_id::text = current_setting('app.tenant_id', true));

create policy tenant_isolation_bot_configs
  on bot_configs
  using (tenant_id::text = current_setting('app.tenant_id', true));

create policy tenant_isolation_conversations
  on conversations
  using (tenant_id::text = current_setting('app.tenant_id', true));

create policy tenant_isolation_messages
  on messages
  using (tenant_id::text = current_setting('app.tenant_id', true));
