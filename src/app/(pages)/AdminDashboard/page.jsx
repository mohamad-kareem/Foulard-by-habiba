"use client";

import { useEffect, useState } from "react";
import {
  FaBoxOpen,
  FaEuroSign,
  FaWarehouse,
  FaTrash,
  FaSync,
  FaUpload,
} from "react-icons/fa";

export default function AdminPage() {
  const [me, setMe] = useState(null);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [imgUploading, setImgUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    price: "",
    image: "",
    description: "",
    category: "Foulard",
    stock: 50,
  });

  const load = async () => {
    try {
      setLoading(true);
      const [userRes, productsRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/products"),
      ]);
      const u = await userRes.json();
      setMe(u.user || null);
      const p = await productsRes.json();
      setProducts(Array.isArray(p) ? p : []);
    } catch {
      setMessage({ text: "Failed to load data", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Upload failed");
      setForm((f) => ({ ...f, image: data.url }));
      setMessage({ text: "Image uploaded successfully", type: "success" });
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setImgUploading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.image) {
      setMessage({ text: "Please upload an image first", type: "error" });
      return;
    }
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ text: "Product created successfully", type: "success" });
        setForm({
          title: "",
          price: "",
          image: "",
          description: "",
          category: "Foulard",
          stock: 50,
        });
        load();
      } else {
        setMessage({
          text: data.error || "Error creating product",
          type: "error",
        });
      }
    } catch {
      setMessage({ text: "Network error", type: "error" });
    }
  };

  const del = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      const r = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (r.ok) {
        setMessage({ text: "Product deleted", type: "success" });
        load();
      } else {
        setMessage({ text: "Failed to delete product", type: "error" });
      }
    } catch {
      setMessage({ text: "Network error", type: "error" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-950 via-purple-900 to-violet-800">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-300 mb-3"></div>
          <span className="text-sm text-violet-200">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!me || me.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center px-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-md max-w-md w-full">
          <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaBoxOpen className="text-red-600 text-2xl" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-700">Admin privileges required</p>
        </div>
      </div>
    );
  }

  // Stats
  const totalValue = products.reduce(
    (s, p) => s + (p.price || 0) * (p.stock || 0),
    0
  );
  const totalStock = products.reduce((s, p) => s + (p.stock || 0), 0);

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-violet-800 text-white p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-3xl font-bold">📦 Product Management</h1>
      </div>

      {/* Stats */}
      {/* Stats */}
      <div className="mb-8">
        {/* Desktop layout */}
        <div className="hidden sm:grid sm:grid-cols-3 gap-4">
          {[
            {
              label: "Total Products",
              value: products.length,
              icon: <FaBoxOpen />,
              color: "from-slate-500 to-slate-700",
            },
            {
              label: "Total Stock",
              value: totalStock,
              icon: <FaWarehouse />,
              color: "from-slate-500 to-slate-700",
            },
            {
              label: "Total Value",
              value: `€${totalValue.toFixed(2)}`,
              icon: <FaEuroSign />,
              color: "from-slate-500 to-slate-700",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`rounded-xl p-3 bg-gradient-to-br ${stat.color} shadow-md flex items-center justify-between`}
            >
              <div>
                <p className="text-sm text-white/80">{stat.label}</p>
                <h3 className="text-xl font-bold text-white">{stat.value}</h3>
              </div>
              <div className="p-2 rounded-full bg-white/20 text-white">
                <span className="text-base">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile compact bar */}
        <div className="sm:hidden flex items-center justify-around bg-white/10 backdrop-blur-md rounded-lg border border-white/20 py-2 px-3 text-md text-white shadow">
          <div className="flex flex-col items-center">
            <FaBoxOpen className="text-indigo-300 mb-1" />
            <span>{products.length}</span>
            <span className="text-[12px] text-white/60">Products</span>
          </div>
          <div className="flex flex-col items-center">
            <FaWarehouse className="text-emerald-300 mb-1" />
            <span>{totalStock}</span>
            <span className="text-[12px] text-white/60">Stock</span>
          </div>
          <div className="flex flex-col items-center">
            <FaEuroSign className="text-slate-300 mb-1" />
            <span>€{totalValue.toFixed(0)}</span>
            <span className="text-[12px] text-white/60">Value</span>
          </div>
        </div>
      </div>

      {/* Content split */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Product Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/20">
          <h2 className="text-lg font-semibold mb-6">➕ Add New Product</h2>
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-sm mb-1">Product Title</label>
              <input
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-gray-300 focus:ring-2 focus:ring-violet-400 text-white"
                placeholder="Enter product title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Product Image</label>
              {form.image ? (
                <div className="space-y-2 text-center">
                  <img
                    src={form.image}
                    alt="preview"
                    className="mx-auto h-40 object-contain rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, image: "" })}
                    className="text-sm text-violet-300 hover:text-white"
                  >
                    Change Image
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-white/30 rounded-lg cursor-pointer hover:border-violet-400 transition">
                  <FaUpload className="text-violet-300 text-2xl mb-2" />
                  <span className="text-sm text-violet-200">Upload image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    className="sr-only"
                  />
                </label>
              )}
              {imgUploading && (
                <div className="flex justify-center text-violet-200 text-sm mt-2">
                  <div className="animate-spin h-4 w-4 border-2 border-violet-300 border-t-transparent rounded-full mr-2"></div>
                  Uploading...
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Price (€)</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-gray-300 focus:ring-2 focus:ring-violet-400 text-white"
                  placeholder="0.00"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Stock</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-gray-300 focus:ring-2 focus:ring-violet-400 text-white"
                  placeholder="50"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Description</label>
              <textarea
                rows="3"
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-gray-300 focus:ring-2 focus:ring-violet-400 text-white"
                placeholder="Product description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <button
              disabled={imgUploading}
              className="w-full py-3 rounded-lg bg-violet-600 hover:bg-violet-700 transition font-medium"
            >
              {imgUploading ? "Processing..." : "Create Product"}
            </button>
          </form>
        </div>

        {/* Product Inventory */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/20 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">📋 Product Inventory</h2>
            <button
              onClick={load}
              className="text-sm text-violet-200 hover:text-white flex items-center gap-1"
            >
              <FaSync /> Refresh
            </button>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-10 text-violet-200 text-sm">
              No products yet. Add your first product!
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-violet-400 scrollbar-track-violet-900/30">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center gap-4 p-4 border border-white/20 rounded-lg bg-white/5 hover:bg-violet-800/40 transition"
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-14 w-14 object-cover rounded-md"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{p.title}</h3>
                    <p className="text-sm text-violet-200">
                      €{p.price} • {p.stock} in stock
                    </p>
                  </div>
                  <button
                    onClick={() => del(p._id)}
                    className="p-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/40 transition"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
