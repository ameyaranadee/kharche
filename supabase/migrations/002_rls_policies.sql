-- Personal app: allow all operations via anon key
-- (add auth checks here later when you add user accounts)

alter table transactions enable row level security;
alter table splits enable row level security;
alter table subscriptions enable row level security;
alter table categories enable row level security;

create policy "allow_all" on transactions for all using (true) with check (true);
create policy "allow_all" on splits for all using (true) with check (true);
create policy "allow_all" on subscriptions for all using (true) with check (true);
create policy "allow_all" on categories for all using (true) with check (true);
