import { verifyTurnstile, clientIp } from "../../../lib/turnstile";

// Gates the Google OAuth redirect behind a human-verification check —
// the sign-in page calls this before kicking off signInWithOAuth.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { token } = req.body;
  const ok = await verifyTurnstile(token, clientIp(req));

  if (!ok) return res.status(400).json({ error: "Human verification failed. Please try again." });
  return res.json({ ok: true });
}
