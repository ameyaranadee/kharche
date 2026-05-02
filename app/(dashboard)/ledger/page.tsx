import { getAllTransactions } from "@/lib/db";
import { Transaction } from "@/lib/types";
import {
  ShoppingCart, Pizza, Briefcase, CreditCard, Tv,
  Car, Film, ShoppingBag, Zap, Home, Heart, Plane, Tag,
} from "lucide-react";

export const revalidate = 0;

const categoryIcons: Record<string, React.ReactNode> = {
  Groceries: <ShoppingCart size={14} />,
  Dining: <Pizza size={14} />,
  Income: <Briefcase size={14} />,
  Transport: <Car size={14} />,
  Subscriptions: <Tv size={14} />,
  Entertainment: <Film size={14} />,
  Shopping: <ShoppingBag size={14} />,
  Utilities: <Zap size={14} />,
  Rent: <Home size={14} />,
  Healthcare: <Heart size={14} />,
  Travel: <Plane size={14} />,
  Other: <Tag size={14} />,
};

function formatDay(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

function groupByDate(transactions: Transaction[]) {
  const groups: { date: string; label: string; rows: Transaction[] }[] = [];
  for (const txn of transactions) {
    const last = groups[groups.length - 1];
    if (last && last.date === txn.date) {
      last.rows.push(txn);
    } else {
      groups.push({ date: txn.date, label: formatDay(txn.date), rows: [txn] });
    }
  }
  return groups;
}

function Row({ txn }: { txn: Transaction }) {
  const isIncome = txn.amount > 0;
  return (
    <div className="flex items-center gap-3 py-3 border-b border-neutral-100 last:border-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
        {categoryIcons[txn.category] ?? <CreditCard size={14} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-900 truncate">{txn.merchant}</p>
        <p className="text-xs text-neutral-400">{txn.category}</p>
      </div>
      {txn.notes && (
        <p className="text-xs text-neutral-400 max-w-[140px] truncate hidden sm:block">{txn.notes}</p>
      )}
      <span className={`text-sm font-semibold tabular-nums ${isIncome ? "text-green-600" : "text-neutral-800"}`}>
        {isIncome
          ? `+$${Number(txn.amount).toFixed(2)}`
          : `-$${Math.abs(Number(txn.amount)).toFixed(2)}`}
      </span>
    </div>
  );
}

export default async function LedgerPage() {
  const transactions = await getAllTransactions();
  const groups = groupByDate(transactions);

  const totalIncome = transactions.filter(t => t.amount > 0).reduce((s, t) => s + Number(t.amount), 0);
  const totalExpenses = transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(Number(t.amount)), 0);

  if (transactions.length === 0) {
    return (
      <div>
        <div className="rounded-xl bg-white p-8 shadow-sm text-center">
          <p className="text-sm text-neutral-400">No transactions yet. Log your first expense in the chat.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-end gap-4 text-sm">
        <span className="text-neutral-400">
          <span className="font-medium text-green-600">+${totalIncome.toFixed(2)}</span>
          {" "}income
        </span>
        <span className="text-neutral-400">
          <span className="font-medium text-neutral-800">-${totalExpenses.toFixed(2)}</span>
          {" "}spent
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {groups.map((group) => (
          <div key={group.date}>
            <p className="mb-1 px-1 text-xs font-semibold text-neutral-400 uppercase tracking-wide">
              {group.label}
            </p>
            <div className="rounded-xl bg-white px-4 shadow-sm">
              {group.rows.map((txn) => (
                <Row key={txn.id} txn={txn} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
