import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    const token = cookies().get("token")?.value;
    const payload = token ? verifyToken(token) : null;
    if (!payload)
      return new Response(JSON.stringify({ user: null }), { status: 200 });

    const user = await User.findById(payload.id).select("-password");
    return new Response(JSON.stringify({ user }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
