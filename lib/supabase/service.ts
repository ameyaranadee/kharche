import { createClient } from "@supabase/supabase-js";

// Direct client for server-side DB operations (API routes, db.ts).
// Does not depend on cookies — safe for Route Handlers and server actions.
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
