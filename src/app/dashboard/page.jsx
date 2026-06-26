'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const services = [
  ['Portfolio', '/portfolio', 'Track holdings, live value, and P&L.'],
  ['Watchlist', '/watchlist', 'Save symbols and monitor live quotes.'],
  ['Alerts', '/alerts', 'Create target-price rules.'],
  ['Paper Trading', '/simulator', 'Log simulated buy and sell orders.'],
  ['AI Insights', '/insights', 'Generate concise Gemini-backed summaries.'],
  ['Prediction', '/predict', 'Use the existing ML prediction workflow.'],
];

export default function DashboardPage() {
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    async function load() {
      const [meRes, portfolioRes, watchlistRes, alertsRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/portfolio'),
        fetch('/api/watchlist'),
        fetch('/api/alerts'),
      ]);

      const [me, portfolio, watchlist, alerts] = await Promise.all([
        meRes.json(),
        portfolioRes.json(),
        watchlistRes.json(),
        alertsRes.json(),
      ]);

      setState({ loading: false, me, portfolio, watchlist, alerts });
    }

    load().catch(() => setState({ loading: false, error: true }));
  }, []);

  if (state.loading) return <Page title="Dashboard">Loading...</Page>;

  if (!state.me?.success) {
    return (
      <Page title="Dashboard">
        <p className="text-gray-400">Login to use personalized services.</p>
        <Link className="mt-4 inline-block rounded-lg bg-emerald-600 px-4 py-2" href="/login">
          Go to account
        </Link>
      </Page>
    );
  }

  const portfolio = state.portfolio?.portfolio;
  const activeAlerts = state.alerts?.alerts?.filter((alert) => alert.isActive).length || 0;

  return (
    <Page title={`Welcome, ${state.me.user.name}`}>
      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Invested" value={formatMoney(portfolio?.invested)} />
        <Metric label="Current Value" value={formatMoney(portfolio?.currentValue)} />
        <Metric label="P&L" value={formatMoney(portfolio?.pnl)} />
        <Metric label="Active Alerts" value={activeAlerts} />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {services.map(([title, href, description]) => (
          <Link
            key={href}
            href={href}
            className="rounded-xl border border-gray-800 bg-gray-900 p-5 hover:border-emerald-700"
          >
            <h2 className="font-semibold text-white">{title}</h2>
            <p className="mt-2 text-sm text-gray-400">{description}</p>
          </Link>
        ))}
      </div>
    </Page>
  );
}

function Page({ title, children }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 text-gray-100">
      <h1 className="text-3xl font-bold">{title}</h1>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value ?? '--'}</p>
    </div>
  );
}

function formatMoney(value) {
  if (!Number.isFinite(value)) return '--';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value);
}
