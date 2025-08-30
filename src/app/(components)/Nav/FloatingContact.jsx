"use client";
import { useState } from "react";

function FloatingContact() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState("");

  const sendMessage = async () => {
    setStatus("Sending...");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("Message sent!");
        setMsg("");
      } else {
        setStatus(data.error || "Failed to send");
      }
    } catch (err) {
      setStatus("Error sending message");
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-violet-600 text-white shadow-lg flex items-center justify-center hover:bg-violet-700 transition-all"
      >
        💬
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Send a message
            </h2>
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-3 border rounded-lg text-gray-800 placeholder-gray-500"
              rows="4"
            />
            {status && <p className="text-sm mt-2 text-gray-600">{status}</p>}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={sendMessage}
                className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FloatingContact;
