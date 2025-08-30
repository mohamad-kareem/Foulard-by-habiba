import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST(req) {
  const cookieStore = await cookies();

  // expire the token cookie
  cookieStore.set({
    name: "token",
    value: "",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
  });

  // redirect after logout
  const url = new URL(req.url);
  const to = url.searchParams.get("redirect") || "/landingpage";

  return new Response(null, {
    status: 302,
    headers: { Location: to },
  });
}
