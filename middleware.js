import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

function isAdminEmail(email) {
  const allowed = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return !!email && allowed.includes(email.toLowerCase());
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow the sign-in page through always
  if (pathname === "/admin/signin") return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.redirect(new URL("/admin/signin", request.url));
  }

  return response;
}

export const config = {
  matcher: "/admin/:path*",
};
