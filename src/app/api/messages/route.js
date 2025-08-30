import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
  try {
    await connectDB();
    const messages = await Message.find().sort({ createdAt: -1 }).lean();
    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
      });
    }

    const decoded = verifyToken(token);
    const { message } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message cannot be empty" }),
        { status: 400 }
      );
    }

    const newMessage = await Message.create({
      userId: decoded.id,
      name: decoded.name,
      email: decoded.email,
      message,
    });

    return new Response(
      JSON.stringify({ message: "Message sent", data: newMessage }),
      { status: 201 }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
