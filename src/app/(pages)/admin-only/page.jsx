import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import VisitLog from "@/models/VisitLog";

export default async function AdminOnlyPage() {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const user = token ? verifyToken(token) : null;

  // Restrict access
  if (!user || user.email !== "adminkarim@gmail.com") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-950 text-white">
        <h1 className="text-3xl font-bold">⛔ Access Denied</h1>
        <p className="mt-2 text-gray-200">
          Only the main admin can view visit logs.
        </p>
      </div>
    );
  }

  // Fetch logs (latest first)
  const logs = await VisitLog.find().sort({ createdAt: -1 }).lean();

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-violet-800 p-8 text-white">
      <h1 className="text-4xl font-bold mb-6">👑 Admin Visit Log</h1>
      <p className="mb-8 text-violet-200">
        Logged in as {user.name} (<span className="italic">{user.email}</span>)
      </p>

      <div className="overflow-x-auto bg-white/10 p-6 rounded-2xl shadow-2xl border border-white/20">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-violet-800 text-white uppercase text-xs tracking-wider">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Page</th>
              <th className="px-4 py-3">Visited At</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-violet-200 italic"
                >
                  No visits recorded yet
                </td>
              </tr>
            ) : (
              logs.map((log, i) => (
                <tr
                  key={log._id}
                  className="odd:bg-violet-900/40 even:bg-violet-800/30 border-b border-violet-700/50 hover:bg-violet-700/40 transition"
                >
                  <td className="px-4 py-3">{i + 1}</td>
                  <td
                    className={`px-4 py-3 font-semibold ${
                      log.role === "admin"
                        ? "text-emerald-400"
                        : log.role === "user"
                        ? "text-blue-400"
                        : "text-gray-400"
                    }`}
                  >
                    {log.role}
                  </td>
                  <td className="px-4 py-3">{log.name}</td>
                  <td className="px-4 py-3">{log.email || "-"}</td>
                  <td className="px-4 py-3">{log.path || "-"}</td>
                  <td className="px-4 py-3">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
