import Link from "next/link";
import { ShoppingCart, Pizza, Briefcase, CreditCard, Tv, Car, Film, ShoppingBag, Zap, Home, Heart, Plane, Tag } from "lucide-react";
import { Transaction } from "@/lib/types";

const categoryIcons: Record<string, React.ReactNode> = {
  Groceries: <ShoppingCart size={15} />,
  Dining: <Pizza size={15} />,
  Income: <Briefcase size={15} />,
  Transport: <Car size={15} />,
  Subscriptions: <Tv size={15} />,
  Entertainment: <Film size={15} />,
  Shopping: <ShoppingBag size={15} />,
  Utilities: <Zap size={15} />,
  Rent: <Home size={15} />,
  Healthcare: <Heart size={15} />,
  Travel: <Plane size={15} />,
  Other: <Tag size={15} />,
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function TransactionRow({ txn }: { txn: Transaction }) {
  const isIncome = txn.amount > 0;
  return (
    <div className="flex items-center gap-3 py-3 border-b border-neutral-100 last:border-0">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 shrink-0">
        {categoryIcons[txn.category] ?? <CreditCard size={15} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-900 truncate">{txn.merchant}</p>
        <p className="text-xs text-neutral-400">
          {txn.category} · {formatDate(txn.date)}
        </p>
      </div>
      <span className={`text-sm font-semibold tabular-nums ${isIncome ? "text-green-600" : "text-red-500"}`}>
        {isIncome
          ? `+$${Number(txn.amount).toFixed(2)}`
          : `-$${Math.abs(Number(txn.amount)).toFixed(2)}`}
      </span>
    </div>
  );
}

export default function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900">Recent transactions</h2>
          <Link href="/log" className="text-xs font-medium text-blue-500 hover:underline">
            add one →
          </Link>
        </div>
        <p className="py-4 text-center text-sm text-neutral-400">
          No transactions yet. Use the chat to log your first expense.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-900">Recent transactions</h2>
        <Link href="#" className="text-xs font-medium text-blue-500 hover:underline">
          view all
        </Link>
      </div>
      <div>
        {transactions.map((txn) => (
          <TransactionRow key={txn.id} txn={txn} />
        ))}
      </div>
    </div>
  );
}
