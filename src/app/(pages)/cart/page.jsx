"use client";
import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import Footer from "@/app/(components)/footer";

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    phone: "",
    country: "",
    note: "",
  });

  const [toast, setToast] = useState({
    show: false,
    text: "",
    type: "success",
  });

  const load = async () => {
    try {
      setLoading(true);
      const r = await fetch("/api/cart", { cache: "no-store" });
      if (!r.ok) {
        setCart(null);
        return;
      }
      const data = await r.json();
      setCart(data || { items: [] });
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setQty = async (productId, qty) => {
    if (!productId) return;
    const r = await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, qty }),
    });
    if (r.ok) setCart(await r.json());
  };

  const removeItem = async (productId) => {
    if (!productId) return;
    const r = await fetch(`/api/cart?productId=${productId}`, {
      method: "DELETE",
    });
    if (r.ok) setCart(await r.json());
  };

  const showToast = (text, type = "success") => {
    setToast({ show: true, text, type });
    setTimeout(() => setToast({ show: false, text: "", type }), 2500);
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      const r = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderDetails),
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok) {
        showToast("Order placed successfully!", "success");
        setShowModal(false);
        setOrderDetails({ phone: "", country: "", note: "" });
        load();
      } else {
        showToast(data.error || "Checkout failed", "error");
      }
    } catch {
      showToast("Checkout failed", "error");
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-fuchsia-100">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-violet-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-violet-50 to-fuchsia-100">
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center p-6 sm:p-8 bg-white rounded-2xl shadow-md max-w-md w-full">
            <img
              src="/shopping1.png"
              alt="Empty cart"
              className="mx-auto h-20 sm:h-28 opacity-80 mb-4"
            />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Please log in
            </h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Login to view your shopping cart
            </p>
            <a
              href="/login"
              className="inline-block mt-5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-violet-600 text-white text-sm sm:text-base font-medium hover:bg-violet-700 transition"
            >
              Go to Login
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const items = Array.isArray(cart.items) ? cart.items : [];
  const safeItems = items.filter((i) => i?.product);
  const total = safeItems.reduce((sum, i) => {
    const price = Number(i?.product?.price ?? 0);
    const qty = Number(i?.qty ?? 1);
    return sum + price * qty;
  }, 0);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-violet-50 to-fuchsia-100">
      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 relative">
        {/* Toast */}
        {toast.show && (
          <div
            className={`fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg text-white font-medium text-xs sm:text-sm z-50 transition 
            ${toast.type === "success" ? "bg-green-600" : "bg-rose-600"}`}
          >
            {toast.text}
          </div>
        )}

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-violet-800 mb-6 sm:mb-8">
          Shopping Cart
        </h1>

        {safeItems.length ? (
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-4 sm:space-y-6">
              {safeItems.map((i, idx) => {
                const pid = i.product?._id;
                const title = i.product?.title ?? "Item";
                const image = i.product?.image ?? "/placeholder.png";
                const price = Number(i.product?.price ?? 0);
                const qty = Number(i.qty ?? 1);

                return (
                  <div
                    key={pid || `${title}-${idx}`}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 
               bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition"
                  >
                    {/* Product Image */}
                    <img
                      src={image}
                      className="h-20 w-40 md:h-24 md:w-40 object-cover rounded-lg border flex-shrink-0"
                      alt={title}
                    />

                    {/* Info + Controls */}
                    <div className="flex-1 w-full min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      {/* Info */}
                      <div className="min-w-0">
                        <div className="font-medium sm:font-semibold text-gray-900 text-base truncate">
                          {title}
                        </div>
                        <div className="text-violet-700 font-semibold sm:font-bold mt-1 text-sm sm:text-base">
                          €{price.toFixed(2)}
                        </div>
                      </div>

                      {/* Quantity + Remove */}
                      <div className="flex items-center justify-between sm:justify-end gap-3">
                        {/* Quantity */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setQty(pid, Math.max(1, qty - 1))}
                            className="h-8 w-8 flex items-center justify-center rounded-md border border-violet-200 
                       text-violet-700 hover:bg-violet-50 hover:border-violet-400 
                       transition text-sm"
                            disabled={!pid}
                          >
                            -
                          </button>
                          <span
                            className="h-8 w-10 flex items-center justify-center rounded-md border border-gray-300 
                           bg-white font-medium text-gray-800 text-sm"
                          >
                            {qty}
                          </span>
                          <button
                            onClick={() => setQty(pid, qty + 1)}
                            className="h-8 w-8 flex items-center justify-center rounded-md border border-violet-200 
                       text-violet-700 hover:bg-violet-50 hover:border-violet-400 
                       transition text-sm"
                            disabled={!pid}
                          >
                            +
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(pid)}
                          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium 
                     text-red-600 hover:text-white hover:bg-red-500 
                     focus:outline-none focus:ring-2 focus:ring-red-300 
                     transition disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!pid}
                          aria-label="Delete item"
                        >
                          <FaTrashAlt className="h-4 w-4" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-xl shadow-md p-5 sm:p-6 h-fit sticky top-4 sm:top-6">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-4 text-gray-900">
                Order Summary
              </h2>
              <div className="flex justify-between py-1.5 sm:py-2 text-gray-700 text-sm sm:text-base">
                <span>Subtotal</span>
                <span className="font-semibold text-violet-800">
                  €{total.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 text-gray-700 text-xs sm:text-sm md:text-base">
                <span>Shipping</span>
                <span className="text-xs sm:text-sm">
                  Calculated at checkout
                </span>
              </div>
              <hr className="my-2 sm:my-3" />
              <div className="flex justify-between text-sm sm:text-base md:text-lg font-bold text-violet-900">
                <span>Total</span>
                <span>€{total.toFixed(2)}</span>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="w-full mt-5 sm:mt-6 py-2 sm:py-2.5 md:py-3 rounded-lg bg-violet-600 text-white text-sm sm:text-base font-medium hover:bg-violet-700 transition flex justify-center items-center disabled:opacity-50"
                disabled={safeItems.length === 0 || checkingOut}
              >
                Proceed to Checkout
              </button>
              {safeItems.length !== items.length && (
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-amber-700">
                  Some unavailable items were skipped.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 sm:p-10 text-center space-y-3 sm:space-y-4 max-w-md mx-auto">
            <img
              src="/shopping1.png"
              alt="Empty cart"
              className="mx-auto h-20 sm:h-24 md:h-28 opacity-70"
            />
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
              Your cart is empty
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm md:text-base">
              Looks like you haven’t added anything yet.
            </p>
            <a
              href="/shop"
              className="inline-block mt-3 sm:mt-4 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg bg-violet-600 text-white text-xs sm:text-sm md:text-base font-medium hover:bg-violet-700 transition"
            >
              Continue Shopping
            </a>
          </div>
        )}
      </main>

      {/* Checkout Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Enter Order Details
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Phone Number"
                value={orderDetails.phone}
                onChange={(e) =>
                  setOrderDetails({ ...orderDetails, phone: e.target.value })
                }
                className="w-full p-2 border rounded-lg text-gray-800 placeholder-gray-500"
              />
              <input
                type="text"
                placeholder="Country / Location"
                value={orderDetails.country}
                onChange={(e) =>
                  setOrderDetails({ ...orderDetails, country: e.target.value })
                }
                className="w-full p-2 border rounded-lg text-gray-800 placeholder-gray-500"
              />
              <textarea
                placeholder="Note (optional)"
                value={orderDetails.note}
                onChange={(e) =>
                  setOrderDetails({ ...orderDetails, note: e.target.value })
                }
                className="w-full p-2 border rounded-lg text-gray-800 placeholder-gray-500"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700"
              >
                {checkingOut ? "Processing..." : "Confirm Order"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
