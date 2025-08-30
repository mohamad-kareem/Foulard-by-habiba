import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function DELETE(req, { params }) {
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

    // ✅ only admins can delete
    if (decoded.role !== "admin") {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
      });
    }

    const deleted = await Message.findByIdAndDelete(params.id);
    if (!deleted) {
      return new Response(JSON.stringify({ error: "Message not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Message deleted successfully" }),
      { status: 200 }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
