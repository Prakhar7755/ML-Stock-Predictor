"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "@/lib/chartjs";

export default function PredictPage() {
  const [companies, setCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);

  const [selectedCompany, setSelectedCompany] = useState("");
  const [symbol, setSymbol] = useState("");
  const [customCompany, setCustomCompany] = useState("");
  const [customSymbol, setCustomSymbol] = useState("");

  const [period1, setPeriod1] = useState("");
  const [period2, setPeriod2] = useState(
    new Date(Date.now() - 86400000).toISOString().split("T")[0]
  );

  const [method, setMethod] = useState("linear-regression");
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [chartData, setChartData] = useState(null);

  /* -------------------- Fetch Companies -------------------- */
  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await fetch("/api/company");
        const data = await res.json();
        if (data?.success) setCompanies(data.companies);
      } catch (err) {
        console.error("Company fetch failed", err);
      } finally {
        setCompaniesLoading(false);
      }
    }
    fetchCompanies();
  }, []);

  /* -------------------- Company Select -------------------- */
  function handleCompanyChange(e) {
    const value = e.target.value;
    setSelectedCompany(value);

    if (value === "__custom__") {
      setSymbol("");
    } else {
      const found = companies.find((c) => c.name === value);
      setSymbol(found?.symbol || "");
    }
  }

  /* -------------------- Analyze -------------------- */
  async function handleAnalyze() {
    const name =
      selectedCompany === "__custom__" ? customCompany.trim() : selectedCompany;
    const sym =
      selectedCompany === "__custom__"
        ? customSymbol.trim().toUpperCase()
        : symbol;

    if (!name || !sym || !period1 || !period2)
      return alert("Missing fields");

    if (new Date(period1) >= new Date(period2))
      return alert("Invalid date range");

    setLoading(true);
    setAnalysisResult(null);
    setChartData(null);

    try {
      const stockRes = await fetch("/api/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          symbol: sym,
          period1,
          period2,
        }),
      });

      const stockJson = await stockRes.json();
      const historical = stockJson.data;

      const labels = historical.map((d) => d.date);
      const prices = historical.map((d) => d.close);

      const predictRes = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: sym,
          data: historical,
          method,
        }),
      });

      const predictJson = await predictRes.json();
      const predicted = predictJson.predictedPrice;

      const nextDate = new Date(labels.at(-1));
      nextDate.setDate(nextDate.getDate() + 1);

      setChartData({
        labels: [...labels, nextDate.toISOString().split("T")[0]],
        datasets: [
          {
            label: "Close Price",
            data: [...prices, predicted],
            borderColor: "#6366f1",
            backgroundColor: "rgba(99,102,241,0.12)",
            tension: 0.35,
            pointBackgroundColor: prices.map((_, i) =>
              i === prices.length ? "#ef4444" : "#6366f1"
            ),
          },
        ],
      });

      setAnalysisResult(
        `Predicted price for ${name} (${sym}): ${predicted}`
      );
    } catch (err) {
      console.error(err);
      alert("Prediction failed");
    } finally {
      setLoading(false);
    }
  }

  /* -------------------- UI -------------------- */
  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-10 text-center text-4xl font-extrabold tracking-tight">
        <span className="bg-gradient-to-r from-indigo-500 to-sky-500 bg-clip-text text-transparent">
          Stock Price Prediction
        </span>
      </h1>

      <div className="rounded-2xl bg-white p-8 shadow-lg">
        <div className="grid gap-6">
          <Field label="Company">
            <select
              value={selectedCompany}
              onChange={handleCompanyChange}
              disabled={companiesLoading}
              className="input"
            >
              <option value="">Select company</option>
              {companies.map((c) => (
                <option key={c._id} value={c.name}>
                  {c.name}
                </option>
              ))}
              <option value="__custom__">Custom</option>
            </select>
          </Field>

          {selectedCompany === "__custom__" && (
            <div className="grid grid-cols-2 gap-4">
              <Field label="Company Name">
                <input
                  className="input"
                  value={customCompany}
                  onChange={(e) => setCustomCompany(e.target.value)}
                />
              </Field>
              <Field label="Symbol">
                <input
                  className="input uppercase"
                  value={customSymbol}
                  onChange={(e) => setCustomSymbol(e.target.value)}
                />
              </Field>
            </div>
          )}

          <Field label="Prediction Method">
            <select
              className="input"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value="linear-regression">Linear Regression</option>
              <option value="average">Average</option>
              <option value="polynomial-regression">
                Polynomial Regression
              </option>
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Start Date">
              <input
                type="date"
                className="input"
                value={period1}
                onChange={(e) => setPeriod1(e.target.value)}
              />
            </Field>
            <Field label="End Date">
              <input
                type="date"
                className="input"
                value={period2}
                onChange={(e) => setPeriod2(e.target.value)}
              />
            </Field>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="mt-4 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 py-3 font-semibold text-white shadow hover:scale-[1.02] transition"
          >
            {loading ? "Analyzing…" : "Analyze"}
          </button>
        </div>
      </div>

      {analysisResult && (
        <p className="mt-8 text-center text-lg font-medium text-slate-700">
          {analysisResult}
        </p>
      )}

      {chartData && (
        <div className="mt-10 rounded-2xl bg-white p-6 shadow">
          <Line data={chartData} />
        </div>
      )}
    </section>
  );
}

/* -------------------- Small UI Helper -------------------- */
function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-slate-600">
        {label}
      </label>
      {children}
    </div>
  );
}
