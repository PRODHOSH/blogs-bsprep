import { createClient } from "../../../lib/supabase/server";
import { isAdminEmail } from "../../../lib/adminAuth";

// Handles the redirect back from Supabase/Google OAuth: exchanges the auth
// code for a session (setting cookies), then gates entry to admin emails only.
export default async function handler(req, res) {
  const { code, next = "/admin" } = req.query;
  const supabase = createClient(req, res);

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return res.redirect(303, "/admin/signin?error=auth_failed");
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    await supabase.auth.signOut();
    return res.redirect(303, "/admin/signin?error=not_admin");
  }

  return res.redirect(303, next);
}
