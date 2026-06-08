// Cloudflare Turnstile server-side verification — https://developers.cloudflare.com/turnstile/

export async function verifyTurnstile(token, ip) {
  if (!process.env.TURNSTILE_SECRET_KEY) return true;
  if (!token) return false;

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: token,
          remoteip: ip,
        }),
      }
    );
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}

export function clientIp(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    ""
  );
}
