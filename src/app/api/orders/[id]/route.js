// src/app/api/orders/[id]/route.js
export const runtime = "nodejs";

import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function PATCH(req, { params }) {
  await connectDB();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const u = token ? verifyToken(token) : null;
  if (!u || u.role !== "admin")
    return new Response("Forbidden", { status: 403 });

  const { status } = await req.json();
  const allowed = ["pending", "paid", "shipped"]; // map “purchase complete” to "paid"
  if (!allowed.includes(status)) {
    return new Response("Invalid status", { status: 400 });
  }

  const updated = await Order.findByIdAndUpdate(
    params.id,
    { status },
    { new: true }
  ).lean();

  if (!updated) return new Response("Not found", { status: 404 });
  return Response.json(updated);
}

export async function DELETE(_req, { params }) {
  await connectDB();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const u = token ? verifyToken(token) : null;
  if (!u || u.role !== "admin")
    return new Response("Forbidden", { status: 403 });

  await Order.findByIdAndDelete(params.id);
  return Response.json({ ok: true });
}
