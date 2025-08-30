export const runtime = "nodejs";

import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import "@/models/User"; // registers User for populate

// POST /api/orders  -> create order from current user's cart
export async function POST(req) {
  await connectDB();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const u = token ? verifyToken(token) : null;
  if (!u) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const { phone, country, note } = body;

  const cart = await Cart.findOne({ user: u.id }).populate("items.product");
  if (!cart || cart.items.length === 0) {
    return new Response("Cart empty", { status: 400 });
  }

  const items = cart.items
    .filter((i) => i.product)
    .map((i) => ({
      product: i.product._id,
      title: i.product.title,
      image: i.product.image,
      price: i.product.price,
      qty: i.qty,
    }));

  if (items.length === 0) return new Response("Cart invalid", { status: 400 });

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  const order = await Order.create({
    user: u.id,
    items,
    total,
    status: "pending",
    phone,
    country,
    note,
  });

  cart.items = [];
  await cart.save();

  return Response.json({ message: "Order placed", order }, { status: 201 });
}

// GET /api/orders  -> admin list
export async function GET() {
  await connectDB();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const u = token ? verifyToken(token) : null;
  if (!u || u.role !== "admin")
    return new Response("Forbidden", { status: 403 });

  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .populate("user", "name email")
    .lean();

  return Response.json(orders);
}
