"use client";

import { useEffect, useState } from "react";

export default function PortfolioPage() {
  const [form, setForm] = useState({ symbol: "", name: "", quantity: "", averageBuyPrice: "" });
  const [state, setState] = useState({ loading: true });

  async function fetchPortfolio() {
    const res = await fetch("/api/portfolio");
    return res.json();
  }

  async function load() {
    const json = await fetchPortfolio();
    setState({ loading: false, data: json });
  }

  useEffect(() => {
    let active = true;

    async function loadInitial() {
      try {
        const json = await fetchPortfolio();
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
    await fetch("/api/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ symbol: "", name: "", quantity: "", averageBuyPrice: "" });
    await load();
  }

  async function remove(id) {
    await fetch("/api/portfolio", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  }

  const portfolio = state.data?.portfolio;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 text-gray-100">
      <h1 className="text-3xl font-bold">Portfolio</h1>
      <p className="mt-2 text-sm text-gray-400">User-owned holdings with live quote based P&L.</p>

      <form onSubmit={submit} className="mt-8 grid gap-3 rounded-xl border border-gray-800 bg-gray-900 p-5 md:grid-cols-5">
        <input placeholder="Symbol" className="input" value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value })} />
        <input placeholder="Name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Quantity" type="number" className="input" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
        <input placeholder="Avg buy price" type="number" className="input" value={form.averageBuyPrice} onChange={(e) => setForm({ ...form, averageBuyPrice: e.target.value })} />
        <button className="rounded-lg bg-emerald-600 px-4 py-3 font-semibold">Add Holding</button>
      </form>

      {state.loading && <p className="mt-8 text-gray-400">Loading...</p>}
      {state.data && !state.data.success && <p className="mt-8 text-red-400">{state.data.message}</p>}

      {portfolio && (
        <>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Metric label="Invested" value={money(portfolio.invested)} />
            <Metric label="Current Value" value={money(portfolio.currentValue)} />
            <Metric label="P&L" value={money(portfolio.pnl)} />
          </div>

          <div className="mt-8 overflow-hidden rounded-xl border border-gray-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-900 text-gray-400">
                <tr>
                  <th className="p-3">Symbol</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Avg</th>
                  <th className="p-3">Current</th>
                  <th className="p-3">P&L</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {portfolio.positions.map((item) => (
                  <tr key={item.id} className="border-t border-gray-800">
                    <td className="p-3 font-semibold">{item.symbol}</td>
                    <td className="p-3">{item.quantity}</td>
                    <td className="p-3">{money(item.averageBuyPrice)}</td>
                    <td className="p-3">{money(item.currentPrice)}</td>
                    <td className={item.pnl >= 0 ? "p-3 text-emerald-400" : "p-3 text-red-400"}>{money(item.pnl)}</td>
                    <td className="p-3 text-right">
                      <button onClick={() => remove(item.id)} className="text-gray-400 hover:text-red-400">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function money(value) {
  if (!Number.isFinite(value)) return "--";
  return `$${value.toFixed(2)}`;
}
