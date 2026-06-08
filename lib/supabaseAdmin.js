import { createClient } from "@supabase/supabase-js";

// Service-role client for privileged server-side writes (bypasses RLS).
// Only ever import this in API routes / server code — never ship the service key to the browser.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
