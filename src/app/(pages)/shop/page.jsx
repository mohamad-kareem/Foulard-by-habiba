"use client";
import { useEffect, useState } from "react";
import {
  FaShoppingCart,
  FaCheckCircle,
  FaExclamationCircle,
  FaStar,
  FaHeart,
  FaFilter,
  FaEye,
  FaTimes,
} from "react-icons/fa";

import Footer from "@/app/(components)/footer";

export default function ShopPage() {
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState({
    show: false,
    text: "",
    type: "success",
  });
  const [priceFilter, setPriceFilter] = useState("all");
  const [wishlist, setWishlist] = useState(new Set());
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setItems);
  }, []);

  const showToast = (text, type = "success") => {
    setToast({ show: true, text, type });
    setTimeout(() => setToast({ show: false, text: "", type }), 2200);
  };

  const addToCart = async (productId) => {
    const r = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, qty: 1 }),
    });
    if (r.ok) showToast(" Added to cart!", "success");
    else showToast("⚠️ Please login to add items.", "error");
  };

  const toggleWishlist = (productId) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId);
      showToast("Removed from favorites", "success");
    } else {
      newWishlist.add(productId);
      showToast("Added to favorites", "success");
    }
    setWishlist(newWishlist);
  };

  const filteredItems = items.filter((item) => {
    let matchesPrice = true;
    if (priceFilter === "under50") {
      matchesPrice = item.price < 50;
    } else if (priceFilter === "50-100") {
      matchesPrice = item.price >= 50 && item.price <= 100;
    } else if (priceFilter === "over100") {
      matchesPrice = item.price > 100;
    }
    return matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast.show && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-lg text-white font-medium flex items-center gap-2 transition-all duration-300 animate-fade-in
          ${toast.type === "success" ? "bg-emerald-600" : "bg-rose-600"}`}
        >
          {toast.type === "success" ? (
            <FaCheckCircle className="text-sm" />
          ) : (
            <FaExclamationCircle className="text-sm" />
          )}
          {toast.text}
        </div>
      )}

      {/* Hero */}
      <header className="relative py-16 px-4 bg-gradient-to-r from-gray-900 to-violet-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-violet/20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
        <div className="relative max-w-5xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Elegant Foulards
          </h1>
          <p className="text-base md:text-lg max-w-2xl mx-auto font-light mb-8 opacity-90">
            Premium silk foulards crafted with precision to elevate your style.
          </p>
          <a
            href="#products"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-gray-900 font-semibold text-sm hover:bg-gray-100 transition-all"
          >
            Explore Collection
          </a>
        </div>
      </header>

      {/* Products */}
      <div
        id="products"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
      >
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <p className="text-gray-600 text-sm md:text-base">
            ✨ Handpicked luxury foulards for every occasion ✨
          </p>
          <div className="inline-flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200">
            <FaFilter className="text-violet-600 text-base" />
            <select
              className="bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-violet-300 text-gray-800 font-medium text-sm md:text-base cursor-pointer"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option value="all">All Prices</option>
              <option value="under50">Under €50</option>
              <option value="50-100">€50 - €100</option>
              <option value="over100">Over €100</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((product) => (
              <div
                key={product._id}
                className="group bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-500 overflow-hidden flex flex-col relative"
              >
                {/* Image */}
                <div className="relative h-72 w-full overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>

                  {/* Stock badge (smaller) */}
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-violet-700">
                    {product.stock ?? 0} in stock
                  </span>

                  {/* Action Buttons */}
                  <div className="absolute right-4 top-4 flex flex-col gap-2">
                    {/* Heart (always visible if in wishlist, else only on hover) */}
                    <button
                      onClick={() => toggleWishlist(product._id)}
                      className={`flex items-center justify-center w-10 h-10 rounded-full bg-white/95 transition-colors
      ${
        wishlist.has(product._id)
          ? "opacity-100 bg-rose-50 shadow-md"
          : "opacity-0 group-hover:opacity-100 hover:bg-rose-100"
      }`}
                    >
                      <FaHeart
                        className={`w-5 h-5 ${
                          wishlist.has(product._id)
                            ? "text-rose-500"
                            : "text-gray-500"
                        }`}
                      />
                    </button>

                    {/* Eye (hover only) */}
                    <button
                      onClick={() => setPreviewImage(product.image)}
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-white/95 hover:bg-violet-100 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <FaEye className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`text-amber-400 text-sm ${
                          star <= 4 ? "" : "opacity-30"
                        }`}
                      />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">(24)</span>
                  </div>

                  <h3 className="font-semibold text-gray-900 text-base mb-2 line-clamp-1">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 text-xs line-clamp-2 mb-4 flex-1">
                    {product.description ||
                      "Luxury silk foulard with elegant pattern."}
                  </p>

                  {/* Price + Cart */}
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-violet-900 font-bold text-lg">
                      €{product.price}
                    </span>
                    <button
                      onClick={() => addToCart(product._id)}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-violet-900 hover:bg-violet-800 text-white font-medium text-xs transition-all"
                    >
                      <FaShoppingCart className="text-sm" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-6 bg-white rounded-xl border border-gray-200">
            <h3 className="text-base font-semibold text-gray-800 mb-1.5">
              No products found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto text-sm">
              Try adjusting your filter criteria to find what you're looking
              for.
            </p>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-6 right-6 text-white text-2xl hover:text-gray-300"
          >
            <FaTimes />
          </button>
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-3xl max-h-[80vh] rounded-lg object-contain"
          />
        </div>
      )}
      <Footer />
    </div>
  );
}
