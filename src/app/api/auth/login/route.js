import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user)
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 400,
      });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 400,
      });

    // ✅ Include name + email in token
    const token = signToken({
      id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
    });

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return new Response(
      JSON.stringify({ message: "Login successful", role: user.role }),
      {
        status: 200,
      }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
