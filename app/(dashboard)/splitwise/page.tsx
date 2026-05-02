import { dummySplitwise } from "@/lib/dummy-data";

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div
      className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-neutral-700"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

export default function SplitwisePage() {
  const { youOwe, owedToYou } = dummySplitwise;

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-2xl font-semibold text-neutral-900">Splitwise</h1>

      <div className="flex flex-col gap-4">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-neutral-500">You owe</h2>
          <div className="flex flex-col gap-4">
            {youOwe.map((entry) => (
              <div key={entry.id} className="flex items-center gap-3">
                <Avatar initials={entry.initials} color={entry.color} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900">{entry.person}</p>
                  <p className="text-xs text-neutral-400">
                    {entry.description} · {entry.date}
                  </p>
                </div>
                <span className="text-sm font-semibold text-red-500 tabular-nums mr-3">
                  -${Math.abs(entry.amount).toFixed(2)}
                </span>
                <button className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
                  Settle
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-neutral-500">Owed to you</h2>
          <div className="flex flex-col gap-4">
            {owedToYou.map((entry) => (
              <div key={entry.id} className="flex items-center gap-3">
                <Avatar initials={entry.initials} color={entry.color} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900">{entry.person}</p>
                  <p className="text-xs text-neutral-400">
                    {entry.description} · {entry.date}
                  </p>
                </div>
                <span className="text-sm font-semibold text-green-600 tabular-nums mr-3">
                  +${entry.amount.toFixed(2)}
                </span>
                <button className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
                  Remind
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
