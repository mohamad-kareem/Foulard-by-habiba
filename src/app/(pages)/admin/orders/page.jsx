"use client";
import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaClock,
  FaTruck,
  FaTrash,
  FaShoppingBag,
  FaEuroSign,
  FaListAlt,
  FaUser,
  FaEnvelope,
  FaChevronRight,
  FaFilter,
  FaPhone,
  FaGlobe,
  FaStickyNote,
} from "react-icons/fa";

const formatEUR = (n) => `€${Number(n || 0).toFixed(2)}`;
const STATUS_OPTIONS = ["pending", "paid", "shipped"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: updated.status } : o))
      );
      setSelected((sel) =>
        sel && sel._id === id ? { ...sel, status: updated.status } : sel
      );
    }
  };

  const del = async (id) => {
    if (!confirm("Delete this order?")) return;
    const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
    if (res.ok) {
      setOrders((prev) => prev.filter((o) => o._id !== id));
      setSelected(null);
    }
  };

  const filteredOrders = orders.filter(
    (order) => statusFilter === "all" || order.status === statusFilter
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-violet-600 mb-3"></div>
          <span className="text-xs sm:text-sm text-gray-600">
            Loading orders...
          </span>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const paidCount = orders.filter((o) => o.status === "paid").length;
  const shippedCount = orders.filter((o) => o.status === "shipped").length;

  const shortId = (id) => id?.slice(-6)?.toUpperCase();

  const statusBadge = (status) => {
    const base =
      "inline-flex items-center gap-1 rounded-full font-semibold px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs";
    switch (status) {
      case "paid":
        return (
          <span className={`${base} bg-green-200 text-green-800`}>
            <FaCheckCircle className="text-[9px] sm:text-xs" /> Paid
          </span>
        );
      case "shipped":
        return (
          <span className={`${base} bg-blue-200 text-blue-800`}>
            <FaTruck className="text-[9px] sm:text-xs" /> Shipped
          </span>
        );
      default:
        return (
          <span className={`${base} bg-amber-200 text-amber-800`}>
            <FaClock className="text-[9px] sm:text-xs" /> Pending
          </span>
        );
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Header */}
      <div className="mb-5 sm:mb-6">
        <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
          Order Management
        </h1>
        <p className="text-gray-600 text-xs sm:text-base">
          Manage and track customer orders
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[
          {
            label: "Total Orders",
            value: orders.length,
            icon: <FaListAlt />,
          },
          {
            label: "Revenue",
            value: formatEUR(totalRevenue),
            icon: <FaEuroSign />,
          },
          {
            label: "Pending",
            value: pendingCount,
            icon: <FaShoppingBag />,
          },
          {
            label: "Completed",
            value: paidCount + shippedCount,
            icon: <FaCheckCircle />,
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-100 flex justify-between items-center"
          >
            <div>
              <p className="text-[10px] sm:text-xs font-medium text-gray-500">
                {stat.label}
              </p>
              <h3 className="text-base sm:text-xl font-bold text-gray-900 mt-0.5">
                {stat.value}
              </h3>
            </div>
            <div className="p-1.5 sm:p-2 rounded-lg bg-violet-100 text-violet-600">
              <div className="text-sm sm:text-lg">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main content split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders list */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Filter */}
          <div className="p-3 border-b border-gray-200 flex items-center gap-2">
            <FaFilter className="text-violet-600 text-xs sm:text-sm" />
            <select
              className="flex-1 text-xs sm:text-sm border border-violet-300 text-violet-800 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="shipped">Shipped</option>
            </select>
          </div>

          {/* Orders list */}
          <div className="divide-y divide-gray-200 max-h-[calc(100vh-280px)] overflow-y-auto">
            {filteredOrders.length === 0 ? (
              <div className="p-4 sm:p-6 text-center text-gray-500 text-xs sm:text-sm">
                {orders.length === 0
                  ? "No orders yet."
                  : "No orders match your filter."}
              </div>
            ) : (
              filteredOrders.map((o) => (
                <button
                  key={o._id}
                  onClick={() => setSelected(o)}
                  className={`w-full text-left p-3 sm:p-4 transition-all duration-200 ${
                    selected?._id === o._id
                      ? "bg-violet-50 border-l-4 border-l-violet-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-gray-900 text-sm truncate">
                      {o.user?.name || "Unknown"}
                    </span>
                    {statusBadge(o.status)}
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-gray-500">
                      {o.createdAt
                        ? new Date(o.createdAt).toLocaleDateString()
                        : "—"}
                    </span>
                    <span className="font-semibold text-violet-700">
                      {formatEUR(o.total)}
                    </span>
                  </div>
                  <div className="flex items-center mt-1 text-[10px] sm:text-xs text-gray-400">
                    <span>Order #{shortId(o._id)}</span>
                    <FaChevronRight className="ml-auto text-[9px] sm:text-xs" />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Order details */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10">
              <div className="mb-3 p-3 rounded-full bg-violet-100 text-violet-600">
                <FaListAlt className="text-xl sm:text-2xl" />
              </div>
              <h3 className="text-sm sm:text-lg font-medium text-gray-900 mb-1">
                Select an order
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm max-w-md">
                Choose an order from the list to view details, update status, or
                manage items.
              </p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-xl font-bold text-gray-900 flex items-center gap-2 flex-wrap">
                    Order #{shortId(selected._id)}
                    {statusBadge(selected.status)}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    {selected.createdAt
                      ? new Date(selected.createdAt).toLocaleString()
                      : "—"}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <select
                    value={selected.status}
                    onChange={(e) => updateStatus(selected._id, e.target.value)}
                    className={`rounded-lg text-xs sm:text-sm py-1.5 px-2 sm:px-3 border focus:ring-2 focus:ring-violet-500 focus:border-violet-500
                      ${
                        selected.status === "pending"
                          ? "bg-amber-50 border-amber-300 text-amber-700"
                          : selected.status === "paid"
                          ? "bg-green-50 border-green-300 text-green-700"
                          : "bg-blue-50 border-blue-300 text-blue-700"
                      }`}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => del(selected._id)}
                    className="flex items-center justify-center p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors text-sm"
                    title="Delete order"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              {/* Customer card */}
              <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gray-50 border border-gray-200">
                <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2 text-sm">
                  <FaUser className="text-violet-600" /> Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">
                      {selected.user?.name || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900 flex items-center gap-2 text-sm sm:text-base">
                      <FaEnvelope className="text-gray-400" />
                      {selected.user?.email || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900 flex items-center gap-2 text-sm sm:text-base">
                      <FaPhone className="text-gray-400" />
                      {selected.phone || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Country</p>
                    <p className="font-medium text-gray-900 flex items-center gap-2 text-sm sm:text-base">
                      <FaGlobe className="text-gray-400" />
                      {selected.country || "—"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs sm:text-sm text-gray-500">Note</p>
                    <p className="font-medium text-gray-900 flex items-center gap-2 text-sm sm:text-base">
                      <FaStickyNote className="text-gray-400" />
                      {selected.note || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200">
                  <h3 className="font-medium text-gray-800 text-sm sm:text-base">
                    Order Items
                  </h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {(selected.items || []).map((it, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4"
                    >
                      <img
                        src={it.image}
                        alt={it.title}
                        className="h-10 w-10 sm:h-14 sm:w-14 rounded-lg object-cover border border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate text-sm sm:text-base">
                          {it.title}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          Qty: {it.qty}
                        </div>
                      </div>
                      <div className="font-semibold text-violet-700 text-sm sm:text-base">
                        {formatEUR(it.price)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center p-3 sm:p-4 bg-violet-50">
                  <span className="font-medium text-gray-800 text-sm sm:text-base">
                    Total Amount
                  </span>
                  <span className="font-bold text-violet-700 text-base sm:text-lg">
                    {formatEUR(selected.total)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
