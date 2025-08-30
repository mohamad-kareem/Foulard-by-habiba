import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        title: String,
        image: String,
        price: Number,
        qty: Number,
      },
    ],
    total: Number,
    status: {
      type: String,
      enum: ["pending", "paid", "shipped"],
      default: "pending",
    },
    phone: String, // 📌 new
    country: String, // 📌 new
    note: String, // 📌 new
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
