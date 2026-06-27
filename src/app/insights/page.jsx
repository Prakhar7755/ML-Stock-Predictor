'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  Info, 
  BarChart3, 
  Activity, 
  ShieldAlert,
  Loader2,
  Search,
  DollarSign
} from 'lucide-react';

export default function InsightsPage() {
  const [symbol, setSymbol] = useState('AAPL');
  const [state, setState] = useState({});

  async function submit(e) {
    e.preventDefault();
    if (!symbol?.trim()) return;
    setState({ loading: true });

    try {
      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol }),
      });
      const json = await res.json();
      setState({ loading: false, data: json });
    } catch (err) {
      setState({ loading: false, error: 'Failed to connect to the server.' });
    }
  }

  // Defensive parsing in case the API returns plain string (legacy or fallback failure)
  const isSuccess = state.data?.success;
  const rawInsight = state.data?.insight;
  const isStructured = typeof rawInsight === 'object' && rawInsight !== null;

  const insight = isStructured 
    ? rawInsight 
    : {
        summary: rawInsight || '',
        metrics: [],
        highlights: [],
        risks: [],
        disclaimer: 'Technical analysis snapshot.'
      };

  // Helper function to colorize metric values (green for positive returns/trends, red for negative/downward)
  function getValueColorClass(val) {
    const cleanVal = String(val).toLowerCase();
    if (cleanVal.includes('-') || cleanVal.includes('down') || cleanVal.includes('below')) {
      return 'text-rose-400';
    }
    if (cleanVal.includes('+') || cleanVal.includes('up') || cleanVal.includes('above') || cleanVal.includes('strong')) {
      return 'text-emerald-400';
    }
    return 'text-sky-300';
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 text-gray-100">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
            AI Market Insights
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Educational stock snapshot analysis powered by Google Gemini, with automatic local fallback.
          </p>
        </div>
      </div>

      {/* Search Form */}
      <form onSubmit={submit} className="mt-8 flex max-w-md gap-3">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-500" />
          <input 
            className="input w-full pl-10 bg-gray-900/60 border border-gray-800 rounded-xl px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition" 
            value={symbol} 
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="Enter Stock Symbol (e.g. AAPL)"
          />
        </div>
        <button 
          disabled={state.loading}
          className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 px-6 font-semibold shadow-lg shadow-emerald-950/20 active:scale-95 transition flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state.loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Generate
        </button>
      </form>

      {/* Loading & Error States */}
      {state.loading && (
        <div className="mt-12 flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          <p className="text-sm text-gray-400 animate-pulse">Running analysis models & compiling insights...</p>
        </div>
      )}

      {state.error && (
        <div className="mt-8 flex items-start gap-3 rounded-xl border border-rose-900/30 bg-rose-950/10 p-5 text-rose-400">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="text-sm">{state.error}</p>
        </div>
      )}

      {state.data && !isSuccess && (
        <div className="mt-8 flex items-start gap-3 rounded-xl border border-rose-900/30 bg-rose-950/10 p-5 text-rose-400">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="text-sm">{state.data.message}</p>
        </div>
      )}

      {/* Main Results Dashboard */}
      {isSuccess && (
        <div className="mt-10 space-y-6">
          {/* Header Block */}
          <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md p-6 md:p-8">
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-emerald-500/5 blur-3xl" />
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  {symbol} Snapshot
                </span>
                <p className="mt-3 text-sm text-gray-400 uppercase tracking-widest">
                  Analyst Engine: <span className="text-gray-200 font-mono">{state.data.provider}</span>
                </p>
              </div>
            </div>

            {/* High-level Summary */}
            <div className="mt-6 flex items-start gap-4 rounded-xl bg-gray-950/40 border border-gray-800/80 p-5">
              <Info className="h-6 w-6 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-200 text-base">Executive Analysis</h3>
                <p className="mt-1.5 leading-relaxed text-gray-300 text-sm md:text-base">
                  {insight.summary}
                </p>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          {insight.metrics && insight.metrics.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-3">
              {insight.metrics.map((metric, i) => (
                <div key={i} className="rounded-xl border border-gray-800 bg-gray-900/40 p-5 flex flex-col justify-between hover:border-gray-700/80 transition">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{metric.label}</span>
                  <span className={`text-2xl font-bold mt-2 ${getValueColorClass(metric.value)}`}>
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Highlights & Technical Indicators */}
          {insight.highlights && insight.highlights.length > 0 && (
            <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6">
              <h3 className="text-lg font-bold text-gray-200 flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5 text-emerald-400" />
                Technical Highlights
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                {insight.highlights.map((highlight, i) => (
                  <div key={i} className="rounded-xl bg-gray-950/20 border border-gray-800/50 p-4">
                    <span className="text-xs text-gray-500 font-medium">{highlight.title}</span>
                    <p className={`text-sm font-semibold mt-1 ${getValueColorClass(highlight.value)}`}>
                      {highlight.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risks & Considerations */}
          {insight.risks && insight.risks.length > 0 && (
            <div className="rounded-2xl border border-amber-900/30 bg-amber-950/5 p-6">
              <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2 mb-4">
                <ShieldAlert className="h-5 w-5 text-amber-500" />
                Key Educational Risks
              </h3>
              <div className="space-y-4">
                {insight.risks.map((risk, i) => (
                  <div key={i} className="flex gap-3 items-start p-4 rounded-xl bg-amber-950/10 border border-amber-900/20">
                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-200 text-sm">{risk.title}</h4>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">{risk.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Disclaimer */}
          {insight.disclaimer && (
            <div className="rounded-xl border border-gray-950 bg-gray-950/30 p-4 text-center">
              <p className="text-[11px] leading-relaxed text-gray-600 uppercase tracking-wider">
                {insight.disclaimer}
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
