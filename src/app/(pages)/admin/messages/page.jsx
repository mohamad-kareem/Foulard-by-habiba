"use client";

import { useEffect, useState } from "react";
import { Trash2, Mail, Eye } from "lucide-react";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

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
    <main className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-violet-800 p-4 sm:p-8 text-white">
      {/* Header */}
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-1">
            📩 User Messages
          </h1>
          <p className="text-violet-200 text-sm sm:text-base">
            Review and manage all incoming inquiries here.
          </p>
        </div>
        {!loading && (
          <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm text-violet-200 shadow-lg self-start sm:self-center">
            Total: {messages.length}
          </span>
        )}
      </header>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin h-10 w-10 border-4 border-violet-400 border-t-transparent rounded-full"></div>
        </div>
      )}

      {/* Empty state */}
      {!loading && messages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-6 shadow-lg">
            <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-violet-300" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold">No messages yet</h2>
          <p className="text-violet-200 text-xs sm:text-sm mt-2">
            Messages will appear here once users reach out.
          </p>
        </div>
      )}

      {/* Messages */}
      {!loading && messages.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-white/20 shadow-lg bg-white/5 backdrop-blur-md">
          {/* Table for larger screens */}
          <table className="hidden md:table min-w-full text-sm text-left">
            <thead className="bg-white/10 text-violet-200 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Message</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {messages.map((m) => (
                <tr
                  key={m._id}
                  className="hover:bg-violet-800/40 transition-all"
                >
                  <td className="px-6 py-4 font-semibold text-white whitespace-nowrap">
                    {m.name}
                  </td>
                  <td className="px-6 py-4 text-violet-200">
                    <a
                      href={`mailto:${m.email}`}
                      className="hover:text-violet-100 underline decoration-dotted"
                    >
                      {m.email}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-violet-100 max-w-xs truncate">
                    {m.message.length > 60
                      ? m.message.slice(0, 60) + "..."
                      : m.message}
                  </td>
                  <td className="px-6 py-4 text-violet-300 whitespace-nowrap">
                    {new Date(m.createdAt).toLocaleDateString("en-DE", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-4 text-center flex justify-center gap-3">
                    <button
                      onClick={() => setSelectedMessage(m)}
                      className="p-2 rounded-lg bg-violet-500/20 text-violet-200 hover:bg-violet-500/30 transition"
                      title="View full message"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(m._id)}
                      className="p-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Card view for mobile */}
          <div className="md:hidden divide-y divide-white/10">
            {messages.map((m) => (
              <div
                key={m._id}
                className="p-4 flex flex-col gap-3 hover:bg-violet-800/40 transition-all"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{m.name}</h3>
                  <span className="text-xs text-violet-300">
                    {new Date(m.createdAt).toLocaleDateString("en-DE", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <a
                  href={`mailto:${m.email}`}
                  className="text-violet-200 text-sm underline decoration-dotted"
                >
                  {m.email}
                </a>
                <p className="text-sm text-violet-100">
                  {m.message.length > 80
                    ? m.message.slice(0, 80) + "..."
                    : m.message}
                </p>
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => setSelectedMessage(m)}
                    className="flex-1 py-2 rounded-lg bg-violet-500/20 text-violet-200 hover:bg-violet-500/30 text-sm"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(m._id)}
                    className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for full message */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-violet-900 to-purple-800 p-6 rounded-2xl shadow-2xl w-full max-w-lg text-white relative">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-3 right-3 text-violet-200 hover:text-white"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">📨 Full Message</h2>
            <p className="mb-6 text-violet-100 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
              {selectedMessage.message}
            </p>
            <div className="border-t border-white/20 pt-4 text-sm text-violet-300 space-y-1">
              <p>
                <span className="font-semibold">From:</span>{" "}
                {selectedMessage.name} ({selectedMessage.email})
              </p>
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {new Date(selectedMessage.createdAt).toLocaleString("en-DE")}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
