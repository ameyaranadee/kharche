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

export default function StatsCards() {
  return (
    <div className="flex gap-4">
      <StatCard
        label="Income"
        value="$6,200"
        sub="salary + freelance"
        valueColor="text-green-600"
      />
      <StatCard
        label="Expenses"
        value="$3,840"
        sub="↑ $310 vs April"
        valueColor="text-red-500"
      />
      <StatCard
        label="Saved"
        value="$2,360"
        sub="38% of income"
      />
    </div>
  );
}
