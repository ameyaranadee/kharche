import Link from "next/link";
import { ShoppingCart, Pizza, Briefcase, CreditCard, Tv } from "lucide-react";
import { dummyTransactions } from "@/lib/dummy-data";
import { Transaction } from "@/lib/types";

const categoryIcons: Record<string, React.ReactNode> = {
  Groceries: <ShoppingCart size={15} />,
  Dining: <Pizza size={15} />,
  Income: <Briefcase size={15} />,
  Transport: <CreditCard size={15} />,
  Subscriptions: <Tv size={15} />,
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function TransactionRow({ txn }: { txn: Transaction }) {
  const isIncome = txn.amount > 0;
  return (
    <div className="flex items-center gap-3 py-3 border-b border-neutral-100 last:border-0">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
        {categoryIcons[txn.category] ?? <CreditCard size={15} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-900 truncate">{txn.merchant}</p>
        <p className="text-xs text-neutral-400">
          {txn.category} · {formatDate(txn.date)}
        </p>
      </div>
      <span className={`text-sm font-semibold tabular-nums ${isIncome ? "text-green-600" : "text-red-500"}`}>
        {isIncome ? "+" : ""}
        {isIncome
          ? `$${txn.amount.toFixed(2)}`
          : `-$${Math.abs(txn.amount).toFixed(2)}`}
      </span>
    </div>
  );
}

export default function RecentTransactions() {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-900">Recent transactions</h2>
        <Link href="#" className="text-xs font-medium text-blue-500 hover:underline">
          view all
        </Link>
      </div>
      <div>
        {dummyTransactions.map((txn) => (
          <TransactionRow key={txn.id} txn={txn} />
        ))}
      </div>
    </div>
  );
}
