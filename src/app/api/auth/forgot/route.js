import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";
import { sendMail } from "@/lib/mailer";

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 1000 * 60 * 15; // 15 min
    await user.save();

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;

    // Send email
    await sendMail({
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset</h2>
        <p>Hello ${user.name || ""},</p>
        <p>You requested to reset your password. Click below to reset:</p>
        <a href="${resetLink}" style="color:#6366f1;font-weight:bold;">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    return new Response(
      JSON.stringify({ message: "Password reset link sent to your email" }),
      { status: 200 }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
