// src/app/(components)/ToastMount.jsx  (Client Component)
"use client";
import { Toaster } from "react-hot-toast";

export default function ToastMount() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3500,
        style: { background: "#1f1f1f", color: "#fff" },
      }}
    />
  );
}
