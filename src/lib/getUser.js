import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function getUserFromCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = verifyToken(token); // { id, email, role, name }
    return decoded;
  } catch (err) {
    return null;
  }
}
