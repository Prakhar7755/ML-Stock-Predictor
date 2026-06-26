"use client";

import { useEffect, useState } from "react";

export default function MarketPage() {
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    fetch("/api/market/overview")
      .then((res) => res.json())
      .then((json) => setState({ loading: false, data: json }))
      .catch(() => setState({ loading: false, error: true }));
  }, []);

  const overview = state.data?.overview;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 text-gray-100">
      <h1 className="text-3xl font-bold">Market Overview</h1>
      <p className="mt-2 text-sm text-gray-400">Global indices and large-cap movers from Yahoo Finance.</p>

      {state.loading && <p className="mt-8 text-gray-400">Loading market data...</p>}
      {state.error && <p className="mt-8 text-red-400">Unable to load market data.</p>}

      {overview && (
        <div className="mt-8 grid gap-8">
          <QuoteGrid title="Indices" quotes={overview.indices} />
          <QuoteGrid title="Movers" quotes={overview.movers} />
        </div>
      )}
    </section>
  );
}

function QuoteGrid({ title, quotes }) {
  return (
    <div>
      <h2 className="mb-3 text-xl font-semibold">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quotes.map((quote) => (
          <div key={quote.symbol} className="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-white">{quote.symbol}</p>
                <p className="truncate text-sm text-gray-500">{quote.name}</p>
              </div>
              <p className={quote.changePercent >= 0 ? "text-emerald-400" : "text-red-400"}>
                {formatPercent(quote.changePercent)}
              </p>
            </div>
            <p className="mt-4 text-2xl font-bold">{formatNumber(quote.price)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatNumber(value) {
  if (!Number.isFinite(value)) return "--";
  return value.toFixed(2);
}

function formatPercent(value) {
  if (!Number.isFinite(value)) return "--";
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}
