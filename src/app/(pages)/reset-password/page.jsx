"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
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
        <h1 className="text-2xl mb-4">Reset Password</h1>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 mb-4 rounded bg-white/5 border border-white/20"
        />
        <button className="w-full bg-violet-600 py-3 rounded-lg">
          Reset Password
        </button>
        {msg && <p className="mt-4 text-center">{msg}</p>}
      </form>
    </div>
  );
}
