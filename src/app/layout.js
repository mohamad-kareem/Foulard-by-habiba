import "./globals.css";
import NavBar from "@/app/(components)/Nav/NavBar";
import ToastMount from "@/app/(components)/ToastMount";

export const metadata = {
  title: "Foulard by Habiba",
  description: "Classy, feminine, modern foulards.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        {/* Client-only toaster */}
        <ToastMount />
        <NavBar />
        {children}
      </body>
    </html>
  );
}
