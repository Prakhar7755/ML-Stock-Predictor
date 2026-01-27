import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <section
      className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-6
      bg-gradient-to-br from-indigo-950 via-indigo-900 to-sky-950"
    >
      {/* Glow blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-112 w-md rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -right-40 h-112 w-md rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />

      <div className="relative z-10 max-w-3xl text-center">
        <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
          Smarter trading with
          <br />
          <span className="bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
            AI Stock Predictions
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-indigo-200 sm:text-xl">
          Analyze market trends, forecast performance, and make confident
          investment decisions using machine learning–powered insights.
        </p>

        <div className="flex justify-center">
          <Link
            href="/predict"
            className="group relative inline-flex items-center rounded-xl px-8 py-4 text-lg font-semibold text-white"
          >
            <span
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-cyan-500
                             transition-transform duration-300 group-hover:scale-105"
            />
            <span className="relative z-10 drop-shadow-lg">Get Started →</span>
          </Link>
        </div>

        {/* Subtle branding */}
        <div className="mt-20 opacity-40">
          <Image
            src="/svg1.svg"
            alt="App logo"
            width={80}
            height={80}
            className="mx-auto brightness-200"
            priority={false}
          />
        </div>
      </div>
    </section>
  );
}
