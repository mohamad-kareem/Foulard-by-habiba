import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
  await connectDB();
  const items = await Product.find().sort({ createdAt: -1 });
  return new Response(JSON.stringify(items), { status: 200 });
}

export async function POST(req) {
  await connectDB();
  const token = cookies().get("token")?.value;
  const user = token ? verifyToken(token) : null;
  if (!user || user.role !== "admin") {
    return new Response(JSON.stringify({ error: "Admin only" }), {
      status: 403,
    });
  }

  const body = await req.json();
  const created = await Product.create({ ...body, createdBy: user.id });
  return new Response(JSON.stringify(created), { status: 201 });
}
