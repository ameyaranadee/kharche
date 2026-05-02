interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  valueColor?: string;
}

function StatCard({ label, value, sub, valueColor = "text-neutral-900" }: StatCardProps) {
  return (
    <div className="flex-1 rounded-xl bg-white p-5 shadow-sm">
      <p className="mb-1 text-sm text-neutral-500">{label}</p>
      <p className={`text-2xl font-semibold ${valueColor}`}>{value}</p>
      <p className="mt-1 text-xs text-neutral-400">{sub}</p>
    </div>
  );
}

interface StatsCardsProps {
  income: number;
  expenses: number;
  saved: number;
}

export default function StatsCards({ income, expenses, saved }: StatsCardsProps) {
  const savingsPct = income > 0 ? Math.round((saved / income) * 100) : 0;

  return (
    <div className="flex gap-4">
      <StatCard
        label="Income"
        value={`$${income.toLocaleString()}`}
        sub="this month"
        valueColor="text-green-600"
      />
      <StatCard
        label="Expenses"
        value={`$${expenses.toLocaleString()}`}
        sub="this month"
        valueColor="text-red-500"
      />
      <StatCard
        label="Saved"
        value={`$${saved.toLocaleString()}`}
        sub={`${savingsPct}% of income`}
      />
    </div>
  );
}
