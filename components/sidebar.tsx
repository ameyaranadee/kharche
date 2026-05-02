"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  ScrollText,
  Users,
  CreditCard,
  TrendingUp,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  badge?: string;
  disabled?: boolean;
};

const navItems: { section: string; items: NavItem[] }[] = [
  {
    section: "MAIN",
    items: [
      { label: "Overview", href: "/overview", icon: LayoutDashboard },
      { label: "Chat", href: "/log", icon: MessageSquare, badge: "AI" },
      { label: "Ledger", href: "/ledger", icon: ScrollText },
    ],
  },
  {
    section: "CONNECTED",
    items: [
      { label: "Splitwise", href: "/splitwise", icon: Users },
      { label: "Subscriptions", href: "/subscriptions", icon: CreditCard },
    ],
  },
  {
    section: "COMING SOON",
    items: [
      {
        label: "Investments",
        href: "#",
        icon: TrendingUp,
        disabled: true,
        badge: "soon",
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-48 shrink-0 flex flex-col bg-white border-r border-neutral-200 px-4 py-5">
      <div className="mb-6 px-1">
        <span className="text-[15px] font-semibold tracking-tight text-neutral-900">
          kharche
        </span>
      </div>

      <nav className="flex flex-col gap-5">
        {navItems.map((group) => (
          <div key={group.section}>
            <p className="mb-1.5 px-1 text-[10px] font-semibold tracking-widest text-neutral-400 uppercase">
              {group.section}
            </p>
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors ${
                        item.disabled
                          ? "cursor-default text-neutral-300 pointer-events-none"
                          : active
                            ? "bg-neutral-100 font-medium text-neutral-900"
                            : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                      }`}
                    >
                      <Icon size={15} strokeWidth={1.8} />
                      <span className="flex-1">{item.label}</span>
                      {item.badge === "AI" && (
                        <span className="rounded bg-neutral-900 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                          AI
                        </span>
                      )}
                      {item.badge === "soon" && (
                        <span className="text-[10px] text-neutral-300">
                          soon
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
