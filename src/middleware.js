import { NextResponse } from "next/server";

export async function middleware(req) {
  if (
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.startsWith("/api") ||
    req.nextUrl.pathname.startsWith("/static") ||
    req.nextUrl.pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  try {
    const token = req.cookies.get("token")?.value || null;

    // ✅ Send only token + path (don't decode in Edge)
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/log-visit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        path: req.nextUrl.pathname,
      }),
    }).catch(() => {});
  } catch (e) {
    console.error("Middleware error:", e.message);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
