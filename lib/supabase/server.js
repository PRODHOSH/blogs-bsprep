import { createServerClient, serializeCookieHeader } from "@supabase/ssr";

// For use in API routes / getServerSideProps (Pages Router) where we have
// Node's `req`/`res` objects rather than the Web Request/Response used by middleware.
export function createClient(req, res) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return Object.entries(req.cookies || {}).map(([name, value]) => ({ name, value }));
        },
        setAll(cookiesToSet) {
          const existing = res.getHeader("Set-Cookie");
          const prior = existing ? (Array.isArray(existing) ? existing : [existing]) : [];
          res.setHeader("Set-Cookie", [
            ...prior,
            ...cookiesToSet.map(({ name, value, options }) =>
              serializeCookieHeader(name, value, options)
            ),
          ]);
        },
      },
    }
  );
}
