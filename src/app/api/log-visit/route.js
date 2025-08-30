import { connectDB } from "@/lib/mongodb";
import VisitLog from "@/models/VisitLog";
import { verifyToken } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectDB();
    const { token, path } = await req.json();

    let role = "guest";
    let name = "Anonymous";
    let email = "";

    const user = token ? verifyToken(token) : null;

    if (user) {
      role = user.role === "admin" ? "admin" : "user";
      name = user.name;
      email = user.email;
    }

    // ❌ Skip logging super admin
    if (email !== "adminkarim@gmail.com") {
      await VisitLog.create({ role, name, email, path });
    }

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
