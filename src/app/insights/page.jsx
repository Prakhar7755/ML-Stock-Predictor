'use client';

import { useState } from 'react';

export default function InsightsPage() {
  const [symbol, setSymbol] = useState('AAPL');
  const [state, setState] = useState({});

  async function submit(e) {
    e.preventDefault();
    setState({ loading: true });

    const res = await fetch('/api/insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol }),
    });
    const json = await res.json();
    setState({ loading: false, data: json });
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 text-gray-100">
      <h1 className="text-3xl font-bold">AI Market Insights</h1>
      <p className="mt-2 text-sm text-gray-400">
        Gemini-backed educational summaries over a technical stock snapshot, with local fallback.
      </p>

      <form onSubmit={submit} className="mt-8 flex gap-3">
        <input className="input" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
        <button className="rounded-lg bg-emerald-600 px-5 font-semibold">Generate</button>
      </form>

      {state.loading && <p className="mt-8 text-gray-400">Generating...</p>}
      {state.data && !state.data.success && (
        <p className="mt-8 text-red-400">{state.data.message}</p>
      )}

      {state.data?.success && (
        <div className="mt-8 rounded-xl border border-gray-800 bg-gray-900 p-6">
          <p className="mb-4 text-sm uppercase tracking-wider text-gray-500">
            Provider: {state.data.provider}
          </p>
          <p className="leading-7 text-gray-200">{state.data.insight}</p>
        </div>
      )}
    </section>
  );
}
