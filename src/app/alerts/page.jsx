'use client';

import { useEffect, useState } from 'react';

export default function AlertsPage() {
  const [form, setForm] = useState({ symbol: '', targetPrice: '', direction: 'above' });
  const [state, setState] = useState({ loading: true });

  async function fetchAlerts() {
    const res = await fetch('/api/alerts');
    return res.json();
  }

  async function load() {
    const json = await fetchAlerts();
    setState({ loading: false, data: json });
  }

  useEffect(() => {
    let active = true;

    async function loadInitial() {
      try {
        const json = await fetchAlerts();
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

  async function submit(e) {
    e.preventDefault();
    await fetch('/api/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ symbol: '', targetPrice: '', direction: 'above' });
    await load();
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 text-gray-100">
      <h1 className="text-3xl font-bold">Price Alerts</h1>
      <p className="mt-2 text-sm text-gray-400">
        Store user-specific target-price rules and evaluate them against live prices.
      </p>

      <form
        onSubmit={submit}
        className="mt-8 grid gap-3 rounded-xl border border-gray-800 bg-gray-900 p-5 md:grid-cols-4"
      >
        <input
          className="input"
          placeholder="Symbol"
          value={form.symbol}
          onChange={(e) => setForm({ ...form, symbol: e.target.value })}
        />
        <input
          className="input"
          type="number"
          placeholder="Target price"
          value={form.targetPrice}
          onChange={(e) => setForm({ ...form, targetPrice: e.target.value })}
        />
        <select
          className="input"
          value={form.direction}
          onChange={(e) => setForm({ ...form, direction: e.target.value })}
        >
          <option value="above">Above</option>
          <option value="below">Below</option>
        </select>
        <button className="rounded-lg bg-emerald-600 px-5 font-semibold">Create</button>
      </form>

      {state.loading && <p className="mt-8 text-gray-400">Loading...</p>}
      {state.data && !state.data.success && (
        <p className="mt-8 text-red-400">{state.data.message}</p>
      )}

      <div className="mt-8 grid gap-4">
        {state.data?.alerts?.map((alert) => (
          <div
            key={alert.id}
            className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900 p-5"
          >
            <div>
              <p className="font-semibold">{alert.symbol}</p>
              <p className="text-sm text-gray-500">
                Alert when {alert.direction} ${Number(alert.targetPrice).toFixed(2)}. Current:{' '}
                {price(alert.currentPrice)}
              </p>
            </div>
            <span className={alert.isTriggered ? 'text-emerald-400' : 'text-gray-500'}>
              {alert.isTriggered ? 'Triggered' : alert.isActive ? 'Watching' : 'Paused'}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function price(value) {
  return Number.isFinite(value) ? `$${value.toFixed(2)}` : '--';
}
