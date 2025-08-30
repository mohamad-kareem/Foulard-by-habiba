// src/app/api/cart/route.js
export const runtime = "nodejs";

import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Cart from "@/models/Cart";
import Product from "@/models/Product";

// helper: return populated + cleaned cart
async function populatedSafeCart(userId) {
  const cart = await Cart.findOne({ user: userId })
    .populate("items.product", "title image price")
    .lean();
  if (!cart) return { items: [] };
  const items = (cart.items || []).filter((i) => i.product); // drop null products
  return { ...cart, items };
}

// GET /api/cart  -> current user's cart
export async function GET() {
  await connectDB();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const u = token ? verifyToken(token) : null;
  if (!u) return new Response("Unauthorized", { status: 401 });

  const cart = await populatedSafeCart(u.id);
  return Response.json(cart);
}

// POST /api/cart  -> add item { productId, qty? }
export async function POST(req) {
  await connectDB();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const u = token ? verifyToken(token) : null;
  if (!u) return new Response("Unauthorized", { status: 401 });

  const { productId, qty = 1 } = await req.json();
  if (!productId) return new Response("productId required", { status: 400 });

  const product = await Product.findById(productId).lean();
  if (!product) return new Response("Product not found", { status: 404 });

  let cart = await Cart.findOne({ user: u.id });
  if (!cart) cart = await Cart.create({ user: u.id, items: [] });

  const idx = cart.items.findIndex((i) => i.product?.toString() === productId);
  if (idx >= 0) cart.items[idx].qty += qty;
  else cart.items.push({ product: productId, qty });

  await cart.save();
  const out = await populatedSafeCart(u.id);
  return Response.json(out, { status: 201 });
}

// PATCH /api/cart  -> update qty { productId, qty }
export async function PATCH(req) {
  await connectDB();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const u = token ? verifyToken(token) : null;
  if (!u) return new Response("Unauthorized", { status: 401 });

  const { productId, qty } = await req.json();
  if (!productId || typeof qty !== "number")
    return new Response("productId and qty required", { status: 400 });

  const cart = await Cart.findOne({ user: u.id });
  if (!cart) return Response.json({ items: [] });

  const idx = cart.items.findIndex((i) => i.product?.toString() === productId);
  if (idx === -1) return Response.json(await populatedSafeCart(u.id));

  if (qty <= 0) cart.items.splice(idx, 1);
  else cart.items[idx].qty = qty;

  await cart.save();
  const out = await populatedSafeCart(u.id);
  return Response.json(out);
}

// DELETE /api/cart?productId=...
export async function DELETE(req) {
  await connectDB();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const u = token ? verifyToken(token) : null;
  if (!u) return new Response("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  if (!productId) return new Response("productId required", { status: 400 });

  const cart = await Cart.findOne({ user: u.id });
  if (!cart) return Response.json({ items: [] });

  cart.items = cart.items.filter((i) => i.product?.toString() !== productId);
  await cart.save();

  const out = await populatedSafeCart(u.id);
  return Response.json(out);
}
