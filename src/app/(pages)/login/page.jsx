"use client";
import { useState } from "react";
import Link from "next/link";

export default function AuthPage({ isLogin = true }) {
  const [isLoginMode, setIsLoginMode] = useState(isLogin);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setMsg("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const endpoint = isLoginMode ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isLoginMode
            ? {
                email: form.email,
                password: form.password,
              }
            : form
        ),
      });

      const data = await res.json();
      setMsg(data.message || data.error);

      if (res.ok) {
        if (isLoginMode) {
          if (data.role === "admin") window.location.href = "/AdminDashboard";
          else window.location.href = "/landingpage";
        }
      }
    } catch (error) {
      setMsg("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-violet-800 to-purple-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white text-center mb-2">
          {isLoginMode ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="text-violet-200 text-center mb-8">
          {isLoginMode ? "Sign in to continue" : "Join us to get started"}
        </p>

        <form onSubmit={submit} className="space-y-5">
          {!isLoginMode && (
            <div>
              <input
                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all"
                placeholder="Full name"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
          )}

          <div>
            <input
              className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all"
              placeholder="Email"
              type="email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <input
              className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all"
              placeholder="Password"
              type="password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {/* 🔹 Forgot Password link (only for login mode) */}
          {isLoginMode && (
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-violet-300 hover:text-white text-sm"
              >
                Forgot Password?
              </Link>
            </div>
          )}

          {!isLoginMode && (
            <div>
              <select
                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all"
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                value={form.role}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          <button
            className={`w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-medium shadow-lg hover:shadow-violet-700/30 transition-all flex items-center justify-center ${
              isLoading
                ? "opacity-80"
                : "hover:from-violet-700 hover:to-fuchsia-700"
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : isLoginMode ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {msg && (
          <div
            className={`mt-6 p-3 rounded-lg text-center ${
              msg.includes("error")
                ? "bg-red-400/20 text-red-200"
                : "bg-emerald-400/20 text-emerald-200"
            }`}
          >
            {msg}
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-violet-300">
            {isLoginMode
              ? "Don't have an account?"
              : "Already have an account?"}
            <button
              onClick={toggleMode}
              className="ml-2 text-white font-medium hover:text-violet-200 transition-colors"
            >
              {isLoginMode ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
