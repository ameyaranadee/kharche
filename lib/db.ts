import { createServiceClient } from "@/lib/supabase/service";
import { Transaction, Subscription, MonthlyData } from "@/lib/types";

export async function getAllTransactions(): Promise<Transaction[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) { console.error(error); return []; }
  return data ?? [];
}

export async function getRecentTransactions(limit = 5): Promise<Transaction[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false })
    .limit(limit);
  if (error) { console.error(error); return []; }
  return data ?? [];
}

export async function getCurrentMonthStats() {
  const supabase = createServiceClient();
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .slice(0, 10);

  const { data, error } = await supabase
    .from("transactions")
    .select("amount")
    .gte("date", firstOfMonth);

  if (error) { console.error(error); return { income: 0, expenses: 0, saved: 0 }; }

  let income = 0;
  let expenses = 0;
  for (const row of data ?? []) {
    if (row.amount > 0) income += Number(row.amount);
    else expenses += Math.abs(Number(row.amount));
  }
  return { income, expenses, saved: income - expenses };
}

export async function getMonthlyTrend(): Promise<MonthlyData[]> {
  const supabase = createServiceClient();

  // Last 6 months
  const months: MonthlyData[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = d.toISOString().slice(0, 10);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().slice(0, 10);
    const label = d.toLocaleString("en-US", { month: "short" });

    const { data } = await supabase
      .from("transactions")
      .select("amount")
      .gte("date", start)
      .lte("date", end);

    let income = 0;
    let expenses = 0;
    for (const row of data ?? []) {
      if (row.amount > 0) income += Number(row.amount);
      else expenses += Math.abs(Number(row.amount));
    }
    months.push({ month: label, income, expenses });
  }
  return months;
}

export async function getSubscriptions(): Promise<Subscription[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("active", true)
    .order("next_renewal_date", { ascending: true });
  if (error) { console.error(error); return []; }
  return data ?? [];
}

export async function insertTransaction(txn: {
  merchant: string;
  amount: number;
  date: string;
  category: string;
  notes?: string;
  source?: string;
}) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("transactions")
    .insert({ ...txn, source: txn.source ?? "chat" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function insertSplit(split: {
  txn_id: string;
  with_person: string;
  owed: number;
}) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("splits").insert(split);
  if (error) throw error;
}

export async function insertSubscription(sub: {
  merchant: string;
  amount: number;
  cycle: string;
  next_renewal_date: string;
  linked_txn_id?: string;
}) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("subscriptions").insert(sub);
  if (error) throw error;
}
