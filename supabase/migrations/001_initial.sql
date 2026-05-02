-- Enable pgvector extension for future embeddings
create extension if not exists vector;

-- Categories
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  color text not null default '#6b7280',
  icon text not null default 'tag',
  created_at timestamptz not null default now()
);

insert into categories (name, color, icon) values
  ('Dining', '#f97316', 'pizza'),
  ('Groceries', '#22c55e', 'shopping-cart'),
  ('Transport', '#3b82f6', 'car'),
  ('Entertainment', '#a855f7', 'film'),
  ('Shopping', '#ec4899', 'bag'),
  ('Utilities', '#6b7280', 'zap'),
  ('Subscriptions', '#8b5cf6', 'tv'),
  ('Income', '#16a34a', 'briefcase'),
  ('Rent', '#0ea5e9', 'home'),
  ('Healthcare', '#14b8a6', 'heart'),
  ('Travel', '#f59e0b', 'plane'),
  ('Other', '#9ca3af', 'tag');

-- Transactions
create table transactions (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  merchant text not null,
  amount numeric(12, 2) not null,
  category text not null default 'Other',
  source text not null default 'manual', -- 'bofa' | 'discover' | 'manual' | 'chat'
  raw_description text,
  notes text,
  created_at timestamptz not null default now()
);

create index transactions_date_idx on transactions (date desc);
create index transactions_category_idx on transactions (category);

-- Splits
create table splits (
  id uuid primary key default gen_random_uuid(),
  txn_id uuid references transactions (id) on delete cascade,
  with_person text not null,
  owed numeric(12, 2) not null,
  settled boolean not null default false,
  splitwise_id text,
  created_at timestamptz not null default now()
);

-- Subscriptions
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  merchant text not null,
  amount numeric(12, 2) not null,
  cycle text not null default 'monthly', -- 'monthly' | 'yearly' | 'weekly'
  next_renewal_date date not null,
  linked_txn_id uuid references transactions (id) on delete set null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
