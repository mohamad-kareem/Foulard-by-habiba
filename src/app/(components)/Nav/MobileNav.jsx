"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import AvatarDropdown from "@/app/(components)/AvatarDropdown";

export default function MobileNav({ isLoggedIn, isAdmin, user }) {
  const [isOpen, setIsOpen] = useState(false);
  const detailsRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (detailsRef.current && !detailsRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown when a link is clicked
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="md:hidden" ref={detailsRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="list-none rounded-lg p-2 leading-none hover:bg-violet-100 focus:outline-none focus:ring-2 focus:ring-violet-400"
        aria-label="Toggle menu"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          className="text-violet-800"
          fill="none"
        >
          <path
            d="M4 7h16M4 12h16M4 17h16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-3 bg-violet-900 text-white shadow-lg rounded-b-xl z-50">
          <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-3 text-sm">
            <Link
              href="/shop"
              onClick={handleLinkClick}
              className="mt-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-2 text-center font-medium text-white shadow-md hover:scale-105 transition"
            >
              Shop now
            </Link>

            <Link
              href="/cart"
              onClick={handleLinkClick}
              className="py-2 font-medium hover:text-fuchsia-300 transition"
            >
              Cart
            </Link>

            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  onClick={handleLinkClick}
                  className="py-2 font-medium hover:text-fuchsia-300 transition"
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                {isAdmin && (
                  <Link
                    href="/AdminDashboard"
                    onClick={handleLinkClick}
                    className="py-2 font-medium hover:text-fuchsia-300 transition"
                  >
                    Admin
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    href="/admin/orders"
                    onClick={handleLinkClick}
                    className="py-2 font-medium hover:text-fuchsia-300 transition"
                  >
                    Orders
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    href="/admin/messages"
                    onClick={handleLinkClick}
                    className="py-2 font-medium hover:text-fuchsia-300 transition"
                  >
                    Messages
                  </Link>
                )}
                {/* Avatar dropdown (also works in mobile) */}
                <div className="py-2">
                  <AvatarDropdown dark />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
