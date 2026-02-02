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
      className={`relative flex flex-col border-r border-gray-800 bg-gray-900 transition-all duration-300 ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-gray-800 px-4">
        {!collapsed && (
          <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Market Watch
          </span>
        )}

        <button
          onClick={() => setCollapsed((v) => !v)}
          className="ml-auto rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Company List */}
      <ul className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {companies.map(({ name, symbol }) => (
          <li key={symbol}>
            <Link
              href={`/company?symbol=${symbol}&name=${name}`}
              className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
            >
              {/* Name */}
              {!collapsed && <span>{name}</span>}

              {/* Symbol */}
              <span
                className={`text-xs font-bold text-gray-600 group-hover:text-emerald-500
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
