import StatsCards from "@/components/overview/stats-cards";
import TrendChart from "@/components/overview/trend-chart";
import RecentTransactions from "@/components/overview/recent-transactions";

export default function OverviewPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">May 2025</h1>
        <button className="text-neutral-400 hover:text-neutral-600">···</button>
      </div>

      <div className="flex flex-col gap-4">
        <StatsCards />
        <TrendChart />
        <RecentTransactions />
      </div>
    </div>
  );
}
