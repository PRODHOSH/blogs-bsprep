import { createClient } from "@supabase/supabase-js";

// Anon client for public reads (e.g. getStaticProps) — relies on RLS to expose
// only published posts. No request/cookie context needed here.
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { auth: { persistSession: false } }
);
