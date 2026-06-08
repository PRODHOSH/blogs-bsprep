import { createClient } from "./supabase/server";

export function isAdminEmail(email) {
  const allowed = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return !!email && allowed.includes(email.toLowerCase());
}

// Resolves the signed-in user from request cookies and checks them against ADMIN_EMAILS.
// Returns the user when they're an admin, otherwise null.
export async function getAdminUser(req, res) {
  const supabase = createClient(req, res);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && isAdminEmail(user.email)) return user;
  return null;
}
