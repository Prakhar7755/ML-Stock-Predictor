import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl
        bg-gradient-to-br from-indigo-950 via-indigo-900 to-sky-950
      border-b border-white/10"
    >
      <div className="h-16 flex items-center justify-between px-6">
        {/* Brand */}
        <Link
          href="/"
          className="group text-xl font-extrabold tracking-tight"
        >
          <span className="bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-indigo-300
                           bg-clip-text text-transparent
                           group-hover:brightness-125 transition">
            AI Stock
          </span>{" "}
          <span className="text-white/80">Prediction</span>
        </Link>

        {/* CTA */}
        <Link
          href="/predict"
          className="group relative overflow-hidden rounded-xl px-6 py-2
                     text-sm font-semibold text-white"
        >
          <span className="absolute inset-0 rounded-xl
            bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-cyan-500
            transition-transform duration-300 group-hover:scale-110" />
          <span className="relative z-10 drop-shadow">
            Custom Analysis →
          </span>
        </Link>
      </div>
    </header>
  );
}
