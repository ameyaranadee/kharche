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
    <div>
      <p className="mb-6 text-sm text-neutral-500">{monthLabel}</p>
      <div className="flex flex-col gap-4">
        <StatsCards income={stats.income} expenses={stats.expenses} saved={stats.saved} />
        <TrendChart data={trend} />
        <RecentTransactions transactions={transactions} />
      </div>
    </div>
  );
}
