import { dummySubscriptions } from "@/lib/dummy-data";

const COLORS = [
  "#c4b5fd", "#86efac", "#fca5a5", "#93c5fd", "#fcd34d",
  "#6ee7b7", "#f9a8d4", "#a5f3fc",
];

function getInitials(name: string) {
  return name.slice(0, 2);
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function isDueSoon(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date("2025-05-02");
  const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diff <= 5;
}

export default function SubscriptionsPage() {
  const total = dummySubscriptions.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-2xl font-semibold text-neutral-900">Subscriptions</h1>

      <div className="rounded-xl bg-white shadow-sm">
        {dummySubscriptions.map((sub, i) => {
          const soon = isDueSoon(sub.next_renewal_date);
          return (
            <div
              key={sub.id}
              className="flex items-center gap-3 px-5 py-4 border-b border-neutral-100 last:border-0"
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold text-neutral-700"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              >
                {getInitials(sub.merchant)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900">{sub.merchant}</p>
                <p className="text-xs text-neutral-400 capitalize">
                  {sub.cycle} · renews {formatDate(sub.next_renewal_date)}
                </p>
              </div>
              <span className="text-sm font-semibold text-neutral-900 tabular-nums mr-3">
                ${sub.amount.toFixed(2)}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  soon
                    ? "bg-amber-100 text-amber-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {soon ? "due soon" : "active"}
              </span>
            </div>
          );
        })}

        <div className="flex items-center justify-between px-5 py-4 border-t border-neutral-200">
          <span className="text-sm text-neutral-500">Monthly total</span>
          <span className="text-sm font-semibold text-neutral-900 tabular-nums">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
