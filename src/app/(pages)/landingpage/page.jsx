/* eslint-disable @next/next/no-img-element */
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Footer from "@/app/(components)/footer";
import FloatingContact from "@/app/(components)/Nav/FloatingContact";
export const metadata = {
  title: "Foulard — Modern Headscarves & Accessories",
  description: "Classy, feminine, modern foulards.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getFeaturedProducts() {
  await connectDB();
  const items = await Product.find().sort({ createdAt: -1 }).limit(4).lean();
  return items || [];
}

export default async function LandingPage() {
  const products = await getFeaturedProducts();

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-rose-50 text-gray-900">
      <div id="top"></div> {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 sm:w-80 h-60 sm:h-80 bg-violet-400 rounded-full blur-3xl animate-[pulse-slow_8s_ease-in-out_infinite]"></div>

          <div className="absolute bottom-0 right-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-fuchsia-600 rounded-full blur-3xl animate-[pulse-slow_8s_ease-in-out_infinite]"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-10 pb-14 sm:pt-10 sm:pb-15">
          <div className="grid gap-10 sm:gap-16 md:grid-cols-2 items-center">
            {/* Text */}
            <div className="space-y-6 sm:space-y-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-200/50 bg-white/80 px-3 py-1.5 text-xs sm:text-sm text-violet-700 shadow-lg backdrop-blur-sm">
                ✨ New Collection • Limited Drop
              </span>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-light leading-tight text-violet-900">
                Elevate your style with our{" "}
                <span className="block mt-2 bg-gradient-to-r from-violet-700 via-fuchsia-600 to-rose-500 bg-clip-text text-transparent">
                  modern foulards
                </span>
              </h1>

              <p className="max-w-xl text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                Soft textures, elegant drape, and photo-ready colors. Crafted
                for everyday grace and moments that deserve a little sparkle.
              </p>

              <div className="flex flex-wrap gap-3 sm:gap-4">
                <a
                  href="/shop"
                  className="relative rounded-lg sm:rounded-xl bg-gradient-to-r from-violet-700 to-fuchsia-600 px-5 sm:px-6 py-3 sm:py-4 text-white text-sm sm:text-base shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-xl"
                >
                  Shop the Collection
                </a>
                <a
                  href="/register"
                  className="rounded-lg sm:rounded-xl border border-violet-200/60 bg-white/80 px-4 sm:px-5 py-2.5 sm:py-3.5 text-sm sm:text-base text-violet-800 backdrop-blur-sm hover:bg-white hover:shadow-md"
                >
                  Join our community
                </a>
              </div>

              <div className="flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-violet-500"></div>
                  Premium feel
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-violet-500"></div>
                  Hijab-friendly sizes
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-violet-500"></div>
                  Fast shipping
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="relative rounded-2xl border border-violet-100/50 bg-white/70 p-1.5 shadow-2xl backdrop-blur-md overflow-hidden">
                <div className="absolute  bg-gradient-to-br from-violet-100/20 to-rose-100/20 z-10"></div>
                <img
                  alt="Elegant woman wearing a foulard"
                  src="/women.png"
                  className="h-[380px] sm:h-[500px] md:h-[580px] w-full rounded-xl object-cover relative z-0"
                />
              </div>

              {/* Floating accents */}
              <div className="absolute -bottom-5 -left-5 hidden sm:block rotate-[-6deg] rounded-xl border border-fuchsia-100/60 bg-white/80 p-1.5 shadow-xl backdrop-blur-md animate-[float-slow_6s_ease-in-out_infinite]">
                <img
                  alt="Detail of foulard texture"
                  src="scarfs.png"
                  className="h-28 sm:h-36 w-28 sm:w-36 rounded-lg object-fill"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ===== BENEFITS ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Breathable luxury",
              desc: "Soft, airy, camera-ready",
              icon: "💎",
              color: "bg-violet-100/50",
            },
            {
              title: "Modest-friendly",
              desc: "Full coverage if you want it",
              icon: "🧕",
              color: "bg-rose-100/50",
            },
            {
              title: "Wrinkle-lite",
              desc: "Stay sleek on the go",
              icon: "🧴",
              color: "bg-fuchsia-100/50",
            },
            {
              title: "Easy care",
              desc: "Hand-wash & quick-dry",
              icon: "🫧",
              color: "bg-violet-100/50",
            },
          ].map((b, i) => (
            <div
              key={i}
              className={`group rounded-xl sm:rounded-2xl border border-white/30 ${b.color} p-4 sm:p-6 shadow-sm backdrop-blur-sm hover:shadow-md hover:-translate-y-1 transition-all`}
            >
              <div className="text-2xl sm:text-3xl mb-3 sm:mb-4 transform group-hover:scale-110 transition-transform">
                {b.icon}
              </div>
              <div className="text-sm sm:text-lg font-semibold text-violet-800">
                {b.title}
              </div>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-semibold text-gray-900 leading-snug">
              Featured Picks
            </h2>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-base text-gray-600 max-w-lg">
              Curated selections that embody elegance and sophistication for the
              discerning taste.
            </p>
          </div>

          {/* Desktop button */}
          <a
            href="/shop"
            className="hidden sm:flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 sm:px-6 py-2.5 sm:py-3 text-violet-700 text-sm sm:text-base font-medium transition-all hover:bg-violet-50 hover:shadow-lg hover:-translate-y-0.5"
          >
            Explore All
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              ></path>
            </svg>
          </a>
        </div>

        {/* Products Grid */}
        {products.length ? (
          <div className="grid gap-5 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <div
                key={p._id}
                className="group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-48 sm:h-60 md:h-72 lg:h-[200px] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="absolute left-3 sm:left-4 top-3 sm:top-4 rounded-full bg-white/90 px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-semibold text-violet-700 backdrop-blur-sm shadow-sm">
                    €{p.price}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4 sm:p-5">
                  <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1.5 sm:mb-2 group-hover:text-violet-700 transition-colors line-clamp-1">
                    {p.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mb-3 sm:mb-4 leading-relaxed">
                    {p.description ||
                      "Premium quality with exquisite craftsmanship and attention to detail."}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className="w-3 h-3 sm:w-4 sm:h-4 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-[10px] sm:text-xs text-gray-500 ml-1">
                        (42)
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-violet-100 text-violet-700">
                      {p.stock ?? 0} in stock
                    </span>
                  </div>

                  <a
                    href={`/shop`}
                    className="mt-3 sm:mt-4 w-full flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-3 sm:px-4 py-2.5 sm:py-3 text-white font-medium text-xs sm:text-sm transition-all hover:bg-violet-700 hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Explore Now
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-2xl border-2 border-dashed border-violet-200 bg-violet-50/50 p-8 sm:p-12 text-center backdrop-blur-sm">
            <div className="max-w-md mx-auto">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-violet-100 text-violet-600 mb-4 sm:mb-5">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  ></path>
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5 sm:mb-2">
                No products yet
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                Start building your collection by adding products in the admin
                panel.
              </p>
              <a
                href="/admin"
                className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 sm:px-6 py-2 sm:py-2.5 text-white font-medium text-xs sm:text-sm transition-all hover:bg-violet-700 hover:shadow-lg"
              >
                Add Products
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
              </a>
            </div>
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="mt-8 sm:mt-10 text-center sm:hidden">
          <a
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-5 py-2.5 text-violet-700 text-sm font-medium transition-all hover:bg-violet-50 hover:shadow-lg"
          >
            View All Products
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              ></path>
            </svg>
          </a>
        </div>
      </section>
      {/* ===== BRAND STORY ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-2">
          {/* Left side - text */}
          <div>
            <span className="inline-block rounded-full bg-violet-100/50 px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs text-violet-700 mb-3 sm:mb-4">
              Our Philosophy
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-violet-900 leading-snug">
              Crafted for confidence
            </h3>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
              We obsess over drape, opacity, and touch — so your foulard sits
              beautifully from first wrap to last photo. Whether worn as a
              headscarf, neck scarf, or shoulder cover, each piece is designed
              to flatter.
            </p>

            {/* Buttons */}
            <div className="mt-5 sm:mt-6 flex flex-wrap gap-3">
              <a
                href="/register"
                className="rounded-lg bg-gradient-to-r from-violet-700 to-fuchsia-600 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm md:text-base text-white shadow-lg hover:scale-[1.03] hover:shadow-xl transition-all"
              >
                Become a member
              </a>
              <a
                href="/login"
                className="rounded-lg border border-violet-200/60 bg-white/80 px-3.5 sm:px-4 py-2 text-xs sm:text-sm md:text-base text-violet-800 backdrop-blur-sm hover:bg-white hover:shadow-md"
              >
                Sign in
              </a>
            </div>
          </div>

          {/* Right side - image */}
          <div>
            <div className="relative rounded-xl border border-violet-100/50 bg-white/70 p-1.5 shadow-2xl backdrop-blur-md overflow-hidden">
              <img
                alt="Woman elegantly styling a foulard"
                src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1400&auto=format&fit=crop"
                className="h-52 sm:h-72 md:h-[420px] lg:h-[480px] w-full rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      {/* ===== TESTIMONIALS ===== */}
      {/* ===== TESTIMONIALS ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        {/* Section header with decorative elements */}
        <div className="text-center mb-16 relative">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-violet-400 to-transparent opacity-60"></div>
          <h3 className="font-serif text-4xl sm:text-5xl font-light text-violet-900 mb-4">
            Voices of Elegance
          </h3>
          <p className="text-violet-600/80 max-w-2xl mx-auto text-lg">
            Discover what makes our community truly special
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              quote:
                "The drape is unreal — it frames the face so softly and stays put all day.",
              name: "Aya",
              role: "Content Creator",
              avatar:
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
            },
            {
              quote:
                "Beautiful colors and feels premium. I wear it for both casual days and events.",
              name: "Lina",
              role: "Fashion Blogger",
              avatar:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
            },
            {
              quote:
                "Finally a scarf that looks amazing in photos without constant fixing!",
              name: "Mira",
              role: "Influencer",
              avatar:
                "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
            },
          ].map((t, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-violet-50/70 p-8 shadow-lg shadow-violet-100/50 backdrop-blur-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-2"
            >
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
                <div className="absolute transform rotate-45 bg-violet-200/30 text-center text-white w-36 h-10 -right-12 top-5"></div>
              </div>

              {/* Avatar */}
              <div className="relative mb-6">
                <div className="absolute -inset-2 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="relative w-16 h-16 rounded-full object-cover z-10 mx-auto border-2 border-white shadow-md"
                />
              </div>

              {/* Quote icon */}
              <div className="text-center mb-5">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-violet-100/60 text-violet-600 text-2xl">
                  "
                </div>
              </div>

              {/* Testimonial text */}
              <p className="text-gray-700 text-center italic leading-relaxed mb-6 relative">
                {t.quote}
                {/* Floating decorative elements */}
                <span className="absolute -left-2 -top-3 text-5xl text-violet-200/40 font-serif">
                  “
                </span>
              </p>

              {/* Author info */}
              <div className="text-center border-t border-violet-100/50 pt-5">
                <div className="font-semibold text-violet-900">{t.name}</div>
                <div className="text-xs text-violet-600/80 tracking-wider uppercase mt-1">
                  {t.role}
                </div>
                {/* Rating stars */}
                <div className="flex justify-center mt-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-4 h-4 text-amber-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>

              {/* Hover effect background */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl -m-4"></div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <p className="text-violet-700/90 mb-6">Inspired by these stories?</p>
          <a
            href="/stories"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-white border border-violet-200 text-violet-800 font-medium shadow-sm hover:shadow-md hover:bg-violet-50 transition-all group"
          >
            Read more stories
            <svg
              className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </a>
        </div>
      </section>
      {/* ===== CTA ===== */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 pb-14 sm:pb-20">
        <div className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-violet-700 to-fuchsia-600 p-5 sm:p-8 text-center text-white">
          <h3 className="font-serif text-xl sm:text-3xl md:text-4xl font-light">
            Ready to elevate your style?
          </h3>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base text-violet-100 max-w-xl sm:max-w-2xl mx-auto leading-relaxed">
            Join thousands of women who have discovered the perfect blend of
            elegance and comfort.
          </p>
          <div className="mt-4 sm:mt-6 flex justify-center gap-2 sm:gap-3">
            <a
              href="/shop"
              className="rounded-md sm:rounded-lg bg-white px-4 sm:px-6 py-1.5 sm:py-2.5 text-[11px] sm:text-sm md:text-base text-violet-700 font-medium shadow hover:scale-[1.03] hover:shadow-md transition-all"
            >
              Shop Now
            </a>
            <a
              href="/landingpage#top"
              className="rounded-md sm:rounded-lg border border-white/30 px-4 sm:px-6 py-1.5 sm:py-2.5 text-[11px] sm:text-sm md:text-base text-white backdrop-blur-sm hover:bg-white/10"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>
      <FloatingContact />
      {/* ===== FOOTER ===== */}
      <Footer />
    </main>
  );
}
