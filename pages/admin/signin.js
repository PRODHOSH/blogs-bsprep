import Head from "next/head";
import Script from "next/script";
import { useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "../../lib/supabase/client";
import styles from "../../styles/Admin.module.css";

const ERROR_MESSAGES = {
  not_admin: "That Google account isn't authorized for the admin dashboard.",
  auth_failed: "Sign-in failed. Please try again.",
};

export default function AdminSignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const queryError = ERROR_MESSAGES[router.query.error] || "";

  function resetTurnstile() {
    if (typeof window !== "undefined" && window.turnstile) {
      window.turnstile.reset();
    }
  }

  async function handleGoogleSignIn() {
    setLoading(true);
    setError("");

    const turnstileToken =
      document.querySelector('[name="cf-turnstile-response"]')?.value || null;

    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken) {
      setError("Please complete the human verification first.");
      setLoading(false);
      return;
    }

    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      const verifyRes = await fetch("/api/auth/verify-turnstile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: turnstileToken }),
      });

      if (!verifyRes.ok) {
        const data = await verifyRes.json();
        setError(data.error || "Human verification failed. Please try again.");
        setLoading(false);
        resetTurnstile();
        return;
      }
    }

    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/admin`,
      },
    });
  }

  const displayError = error || queryError;

  return (
    <>
      <Head>
        <title>Admin Sign In | BSPrep Blogs</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="lazyOnload"
        />
      )}

      <div className={styles.loginPage}>
        <div className={styles.loginCard}>
          <div className={styles.loginLogo}>
            <span className={styles.bracket}>&lt;</span>
            <span>Admin</span>
            <span className={styles.bracket}>/&gt;</span>
          </div>
          <p className={styles.loginSub}>BSPrep Blogs dashboard</p>

          {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
            <div
              className="cf-turnstile"
              data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              data-theme="light"
              style={{ margin: "4px auto 12px", display: "flex", justifyContent: "center" }}
            />
          )}

          {displayError && <p className={styles.loginError}>{displayError}</p>}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className={styles.loginBtn}
            disabled={loading}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
              <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
            </svg>
            {loading ? "Redirecting…" : "Sign in with Google"}
          </button>
        </div>
      </div>
    </>
  );
}
