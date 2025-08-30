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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-600 mb-3"></div>
          <span className="text-sm text-gray-700">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!me || me.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Header */}
      <div className="mb-5 sm:mb-6">
        <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
          Product Management
        </h1>
        <p className="text-gray-700 text-xs sm:text-sm">
          Manage and track your products
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        {[
          {
            label: "Total Products",
            value: products.length,
            icon: <FaBoxOpen />,
          },
          { label: "Total Stock", value: totalStock, icon: <FaWarehouse /> },
          {
            label: "Total Value",
            value: `€${totalValue.toFixed(2)}`,
            icon: <FaEuroSign />,
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 flex justify-between items-center"
          >
            <div>
              <p className="text-[12px] font-medium text-gray-600">
                {stat.label}
              </p>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
                {stat.value}
              </h3>
            </div>
            <div className="p-2 rounded-lg bg-violet-100 text-violet-600">
              <div className="text-base sm:text-lg">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Content split */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Product Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-sm sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
            Add New Product
          </h2>
          <form onSubmit={submit} className="space-y-4 sm:space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-1.5">
                Product Title
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-violet-500 text-sm text-gray-900 placeholder-gray-700"
                placeholder="Enter product title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            {/* Image Upload */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-1.5">
                Product Image
              </label>
              {form.image ? (
                <div className="space-y-2 text-center">
                  <img
                    src={form.image}
                    alt="preview"
                    className="mx-auto h-32 sm:h-40 object-contain rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, image: "" })}
                    className="text-xs sm:text-sm text-violet-600 hover:text-violet-800"
                  >
                    Change Image
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-28 sm:h-36 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-violet-500 transition">
                  <FaUpload className="text-gray-500 text-xl sm:text-2xl mb-2" />
                  <span className="text-xs sm:text-sm text-gray-700">
                    Upload image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    className="sr-only"
                  />
                </label>
              )}
              {imgUploading && (
                <div className="flex justify-center text-violet-600 text-xs sm:text-sm mt-2">
                  <div className="animate-spin h-4 w-4 border-2 border-violet-600 border-t-transparent rounded-full mr-2"></div>
                  Uploading...
                </div>
              )}
            </div>
            {/* Price + Stock */}
            <div className="grid grid-cols-2 gap-3 sm:gap-5">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-1.5">
                  Price (€)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-violet-500 text-sm text-gray-900 placeholder-gray-700"
                  placeholder="0.00"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-1.5">
                  Stock
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-violet-500 text-sm text-gray-900 placeholder-gray-700"
                  placeholder="50"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </div>
            </div>
            {/* Description */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-1.5">
                Description
              </label>
              <textarea
                rows="3"
                className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-violet-500 text-sm text-gray-900 placeholder-gray-700"
                placeholder="Product description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            {/* Submit */}
            <button
              disabled={imgUploading}
              className="w-full py-2.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition disabled:opacity-50"
            >
              {imgUploading ? "Processing..." : "Create Product"}
            </button>
          </form>
        </div>

        {/* Product Inventory */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-sm sm:text-lg font-semibold text-gray-900">
              Product Inventory
            </h2>
            <button
              onClick={load}
              className="text-xs sm:text-sm text-gray-700 hover:text-gray-900 flex items-center gap-1"
            >
              <FaSync /> Refresh
            </button>
          </div>
          {products.length === 0 ? (
            <div className="text-center py-10 text-gray-600 text-xs sm:text-sm">
              No products yet. Add your first product!
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 space-y-3">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-12 w-12 sm:h-14 sm:w-14 object-cover rounded-md"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate text-sm sm:text-base">
                      {p.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-700">
                      €{p.price} • {p.stock} in stock
                    </p>
                  </div>
                  <button
                    onClick={() => del(p._id)}
                    className="text-gray-500 hover:text-red-600 transition p-1.5 rounded-lg hover:bg-red-50"
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
