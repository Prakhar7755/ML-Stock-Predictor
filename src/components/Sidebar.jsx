"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const companies = [
  { name: "Apple", symbol: "AAPL" },
  { name: "Amazon", symbol: "AMZN" },
  { name: "Google", symbol: "GOOG" },
  { name: "Microsoft", symbol: "MSFT" },
  { name: "Meta", symbol: "META" },
  { name: "Tesla", symbol: "TSLA" },
  { name: "Netflix", symbol: "NFLX" },
  { name: "Nvidia", symbol: "NVDA" },
  { name: "Adobe", symbol: "ADBE" },
  { name: "Salesforce", symbol: "CRM" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`relative h-screen transition-all duration-300
        bg-gradient-to-b from-indigo-900 via-indigo-800 to-sky-900
        border-r border-white/10
        ${collapsed ? "w-20" : "w-72"}`}
    >
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-fuchsia-500/10 to-cyan-400/10" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 py-4">
        {!collapsed && (
          <span className="text-sm font-extrabold tracking-wide text-white/90">
            Companies
          </span>
        )}

        <button
          onClick={() => setCollapsed((v) => !v)}
          className="rounded-lg bg-white/10 p-1 text-white backdrop-blur
                     hover:bg-white/20 hover:scale-110 transition"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Company List */}
      <ul className="relative z-10 px-3 space-y-2">
        {companies.map(({ name, symbol }) => (
          <li key={symbol}>
            <Link
              href={`/company?symbol=${symbol}&name=${name}`}
              className="group flex items-center justify-between rounded-xl px-4 py-2
                         bg-white/10 backdrop-blur
                         text-sm font-medium text-white/90
                         shadow-sm
                         hover:bg-gradient-to-r hover:from-indigo-500/40 hover:to-cyan-500/40
                         hover:shadow-lg hover:scale-[1.03]
                         transition"
            >
              {/* Name */}
              {!collapsed && (
                <span className="group-hover:text-white">
                  {name}
                </span>
              )}

              {/* Symbol */}
              <span
                className={`text-xs font-bold tracking-wide text-cyan-300
                  ${collapsed ? "mx-auto" : ""}`}
              >
                {symbol}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
