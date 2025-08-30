"use client";
import { useState, useRef, useEffect } from "react";
import { User } from "lucide-react";

export default function AvatarDropdown({ dark = false }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Circle user icon */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gray-400 to-gray-500 text-white shadow hover:scale-105 transition"
        aria-label="User menu"
      >
        <User className="h-5 w-5" />
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          className={`absolute mt-2 w-40 rounded-lg shadow-lg border p-2
            ${
              dark
                ? "bg-violet-800 text-white border-violet-600"
                : "bg-white text-gray-800 border-gray-200"
            }
            left-0 md:right-0 md:left-auto
          `}
        >
          <form action="/api/auth/logout?redirect=/landingpage" method="POST">
            <button
              type="submit"
              className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-violet-100 hover:text-violet-800 transition"
            >
              Logout
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
