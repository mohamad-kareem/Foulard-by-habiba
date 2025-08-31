/* Server Component */
import Link from "next/link";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import AvatarDropdown from "@/app/(components)/AvatarDropdown"; // client component
import MobileNav from "@/app/(components)/Nav/MobileNav"; // New client component for mobile

export const dynamic = "force-dynamic";

export default async function NavBar() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let user = null;
  try {
    if (token) user = verifyToken(token); // { id, name, email, role }
  } catch {}

  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";
  const displayName =
    user?.name?.trim() || (user?.email ? user.email.split("@")[0] : "");
  const avatarLetter = displayName?.[0]?.toUpperCase() || "U";

  return (
    <nav className="sticky top-0 z-50 border-b border-violet-200/50 bg-white backdrop-blur-md supports-[backdrop-filter]:bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link href="/landingpage" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white text-sm font-semibold shadow">
              FH
            </span>
            <span className="font-serif text-lg tracking-wide text-violet-900 font-bold">
              Foulard by Habiba
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/shop"
              className="ml-1 rounded-xl bg-gradient-to-r from-violet-700 to-fuchsia-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-violet-400/30 transition hover:scale-105"
            >
              Shop now
            </Link>

            <Link
              href="/cart"
              className="text-sm font-medium text-gray-700 hover:text-violet-700 transition"
            >
              Cart
            </Link>

            {!isLoggedIn ? (
              <Link
                href="/login"
                className="text-sm font-medium text-gray-700 hover:text-violet-700 transition"
              >
                Login
              </Link>
            ) : (
              <>
                {isAdmin && (
                  <Link
                    href="/AdminDashboard"
                    className="text-sm font-medium text-gray-700 hover:text-violet-700 transition"
                  >
                    Admin
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    href="/admin/orders"
                    className="text-sm font-medium text-gray-700 hover:text-violet-700 transition"
                  >
                    Orders
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    href="/admin/messages"
                    className="text-sm font-medium text-gray-700 hover:text-violet-700 transition"
                  >
                    Messages
                  </Link>
                )}
                {/* Avatar dropdown (client component) */}
                <AvatarDropdown />
              </>
            )}
          </div>

          {/* Mobile - Replaced with client component */}
          <MobileNav isLoggedIn={isLoggedIn} isAdmin={isAdmin} user={user} />
        </div>
      </div>
    </nav>
  );
}
