"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; avatar: string | null } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser({
          name: user.user_metadata?.full_name ?? user.email ?? "",
          avatar: user.user_metadata?.avatar_url ?? null,
        });
      }
    });
  }, []);

  const pageTitle: Record<string, string> = {
    "/overview": "Overview",
    "/log": "Log expense",
    "/ledger": "Ledger",
    "/splitwise": "Splitwise",
    "/subscriptions": "Subscriptions",
    "/profile": "Profile",
  };

  const title = pageTitle[pathname] ?? "";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-8">
      <h1 className="text-sm font-semibold text-neutral-900">{title}</h1>

      {user && (
        <Link
          href="/profile"
          className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-neutral-50"
        >
          <span className="text-sm text-neutral-600">{user.name.split(" ")[0]}</span>
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="Profile"
              className="h-7 w-7 rounded-full object-cover ring-1 ring-neutral-200"
            />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-200 text-xs font-semibold text-neutral-600">
              {user.name[0]?.toUpperCase()}
            </div>
          )}
        </Link>
      )}
    </header>
  );
}
