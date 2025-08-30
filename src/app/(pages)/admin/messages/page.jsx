"use client";

import { useEffect, useState } from "react";
import { Trash2, Mail } from "lucide-react";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    setLoading(true);
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      if (res.ok) setMessages(data);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!confirm("Delete this message permanently?")) return;
    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m._id !== id));
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete message");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 sm:px-12">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
          User Messages
        </h1>
        <p className="text-slate-500 mt-1">
          Review and manage incoming user inquiries.
        </p>
      </header>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full"></div>
        </div>
      )}

      {/* Empty state */}
      {!loading && messages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-violet-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800">
            No messages yet
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Messages will appear here once users reach out.
          </p>
        </div>
      )}

      {/* Messages */}
      {!loading && messages.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {messages.map((m) => (
            <div
              key={m._id}
              className="flex flex-col justify-between p-6 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Message body */}
              <p className="text-slate-700 leading-relaxed mb-6">{m.message}</p>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">
                    {m.name}
                  </h3>
                  <p className="text-xs text-slate-500">{m.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">
                    {new Date(m.createdAt).toLocaleDateString("en-DE", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <button
                    onClick={() => handleDelete(m._id)}
                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
