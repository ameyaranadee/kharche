import StatsCards from "@/components/overview/stats-cards";
import TrendChart from "@/components/overview/trend-chart";
import RecentTransactions from "@/components/overview/recent-transactions";
import { getRecentTransactions, getCurrentMonthStats, getMonthlyTrend } from "@/lib/db";

export const revalidate = 0;

export default async function OverviewPage() {
  const [stats, transactions, trend] = await Promise.all([
    getCurrentMonthStats(),
    getRecentTransactions(5),
    getMonthlyTrend(),
  ]);

  const now = new Date();
  const monthLabel = now.toLocaleString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">{monthLabel}</h1>
      </div>

      <div className="flex flex-col gap-4">
        <StatsCards income={stats.income} expenses={stats.expenses} saved={stats.saved} />
        <TrendChart data={trend} />
        <RecentTransactions transactions={transactions} />
      </div>
    </div>
  );
}
