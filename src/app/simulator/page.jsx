"use client";

import { useEffect, useState } from "react";

export default function SimulatorPage() {
  const [form, setForm] = useState({ symbol: "", side: "buy", quantity: "", price: "" });
  const [state, setState] = useState({ loading: true });

  async function fetchOrders() {
    const res = await fetch("/api/simulator/orders");
    return res.json();
  }

  async function load() {
    const json = await fetchOrders();
    setState({ loading: false, data: json });
  }

  useEffect(() => {
    let active = true;

    async function loadInitial() {
      try {
        const json = await fetchOrders();
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
    await fetch("/api/simulator/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ symbol: "", side: "buy", quantity: "", price: "" });
    await load();
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 text-gray-100">
      <h1 className="text-3xl font-bold">Paper Trading Simulator</h1>
      <p className="mt-2 text-sm text-gray-400">A simple order journal that adds practical trading-platform depth.</p>

      <form onSubmit={submit} className="mt-8 grid gap-3 rounded-xl border border-gray-800 bg-gray-900 p-5 md:grid-cols-5">
        <input className="input" placeholder="Symbol" value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value })} />
        <select className="input" value={form.side} onChange={(e) => setForm({ ...form, side: e.target.value })}>
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
        <input className="input" type="number" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
        <input className="input" type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <button className="rounded-lg bg-emerald-600 px-5 font-semibold">Record</button>
      </form>

      {state.data?.summary && (
        <p className="mt-6 text-sm text-gray-400">
          Orders: {state.data.summary.orderCount} | Buy value: ${state.data.summary.buyValue.toFixed(2)} | Sell value: ${state.data.summary.sellValue.toFixed(2)}
        </p>
      )}

      <div className="mt-8 grid gap-3">
        {state.data?.orders?.map((order) => (
          <div key={order._id} className="grid gap-2 rounded-xl border border-gray-800 bg-gray-900 p-4 md:grid-cols-5">
            <p className="font-semibold">{order.symbol}</p>
            <p className={order.side === "buy" ? "text-emerald-400" : "text-red-400"}>{order.side.toUpperCase()}</p>
            <p>{order.quantity} shares</p>
            <p>${Number(order.price).toFixed(2)}</p>
            <p className="text-gray-500">{new Date(order.executedAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
