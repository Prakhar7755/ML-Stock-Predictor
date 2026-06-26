'use client';

import { useEffect, useState } from 'react';

export default function WatchlistPage() {
  const [symbol, setSymbol] = useState('');
  const [state, setState] = useState({ loading: true });

  async function fetchWatchlist() {
    const res = await fetch('/api/watchlist');
    return res.json();
  }

  async function load() {
    const json = await fetchWatchlist();
    setState({ loading: false, data: json });
  }

  useEffect(() => {
    let active = true;

    async function loadInitial() {
      try {
        const json = await fetchWatchlist();
        if (active) setState({ loading: false, data: json });
      } catch {
        if (active) setState({ loading: false, error: true });
      }
    }

    loadInitial();
    return () => {
      active = false;
    };
  }, []);

  async function add(e) {
    e.preventDefault();
    await fetch('/api/watchlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol }),
    });
    setSymbol('');
    await load();
  }

  async function remove(symbolToRemove) {
    await fetch('/api/watchlist', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol: symbolToRemove }),
    });
    await load();
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 text-gray-100">
      <h1 className="text-3xl font-bold">Watchlist</h1>
      <p className="mt-2 text-sm text-gray-400">
        A personalized symbol list with live quote cards.
      </p>

      <form onSubmit={add} className="mt-8 flex gap-3">
        <input
          className="input"
          placeholder="AAPL"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <button className="rounded-lg bg-emerald-600 px-5 font-semibold">Add</button>
      </form>

      {state.loading && <p className="mt-8 text-gray-400">Loading...</p>}
      {state.data && !state.data.success && (
        <p className="mt-8 text-red-400">{state.data.message}</p>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {state.data?.quotes?.map((quote) => (
          <div key={quote.symbol} className="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">{quote.symbol}</p>
                <p className="text-sm text-gray-500">{quote.name}</p>
              </div>
              <button
                onClick={() => remove(quote.symbol)}
                className="text-sm text-gray-500 hover:text-red-400"
              >
                Remove
              </button>
            </div>
            <p className="mt-4 text-2xl font-bold">{number(quote.price)}</p>
            <p className={quote.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}>
              {percent(quote.changePercent)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function number(value) {
  return Number.isFinite(value) ? value.toFixed(2) : '--';
}

function percent(value) {
  if (!Number.isFinite(value)) return '--';
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}
