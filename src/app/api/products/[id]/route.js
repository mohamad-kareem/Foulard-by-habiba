import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(_req, { params }) {
  await connectDB();
  const doc = await Product.findById(params.id);
  if (!doc) return new Response("Not found", { status: 404 });
  return new Response(JSON.stringify(doc), { status: 200 });
}

export async function PUT(req, { params }) {
  await connectDB();
  const token = cookies().get("token")?.value;
  const user = token ? verifyToken(token) : null;
  if (!user || user.role !== "admin")
    return new Response("Forbidden", { status: 403 });

  const body = await req.json();
  const updated = await Product.findByIdAndUpdate(params.id, body, {
    new: true,
  });
  return new Response(JSON.stringify(updated), { status: 200 });
}

export async function DELETE(_req, { params }) {
  await connectDB();
  const token = cookies().get("token")?.value;
  const user = token ? verifyToken(token) : null;
  if (!user || user.role !== "admin")
    return new Response("Forbidden", { status: 403 });

  await Product.findByIdAndDelete(params.id);
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
