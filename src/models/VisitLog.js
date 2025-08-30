// models/VisitLog.js
import mongoose from "mongoose";

const VisitLogSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["guest", "user", "admin"], default: "guest" },
    name: { type: String, default: "Anonymous" },
    email: { type: String, default: "" },
    path: { type: String }, // 👈 which page visited
  },
  { timestamps: true }
);

export default mongoose.models.VisitLog ||
  mongoose.model("VisitLog", VisitLogSchema);
