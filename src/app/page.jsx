import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden bg-gray-950 px-6 text-center">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-emerald-500 opacity-20 blur-[100px]"></div>

      <div className="relative z-10 max-w-4xl">
        <div className="mb-6 inline-flex items-center rounded-full border border-gray-800 bg-gray-900/50 px-3 py-1 text-sm text-gray-400 backdrop-blur-sm">
          <span className="mr-2 flex h-2 w-2 rounded-full bg-emerald-500"></span>
          AI-Powered Market Analysis
        </div>

        <h1 className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-7xl">
          Predict the Future of <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            Stock Markets
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-400">
          Leverage advanced machine learning algorithms to forecast stock trends
          with precision. Make data-driven investment decisions today.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/predict"
            className="rounded-xl bg-emerald-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-emerald-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            Start Analysis
          </Link>
        </div>
      </div>
    </section>
  );
}
