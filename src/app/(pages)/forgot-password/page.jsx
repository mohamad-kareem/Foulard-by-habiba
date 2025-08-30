"use client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setMsg(data.message || data.error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-violet-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 p-8 rounded-2xl shadow-lg"
      >
        <h1 className="text-2xl mb-4">Forgot Password</h1>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 mb-4 rounded bg-white/5 border border-white/20"
        />
        <button className="w-full bg-violet-600 py-3 rounded-lg">
          Send Reset Link
        </button>
        {msg && <p className="mt-4 text-center">{msg}</p>}
      </form>
    </div>
  );
}
