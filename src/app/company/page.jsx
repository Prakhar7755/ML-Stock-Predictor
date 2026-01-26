"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Line } from "react-chartjs-2";
import "@/lib/chartjs";

export default function SelectedCompanyPage() {
  const searchParams = useSearchParams();
  const symbol = searchParams.get("symbol");
  const companyName = searchParams.get("name");

  const [chartData, setChartData] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(true);

  // last 30 days
  const period2 = new Date().toISOString().split("T")[0];
  const period1 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  /* -------------------- Fetch Data -------------------- */
  const fetchData = useCallback(async () => {
    if (!companyName || !symbol) {
      alert("Name and Symbol are required.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      /* ---- Stock Data ---- */
      const stockRes = await fetch("/api/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: companyName,
          symbol,
          period1,
          period2,
        }),
      });

      const stockJson = await stockRes.json();

      if (!stockJson.success || !Array.isArray(stockJson.data)) {
        alert(stockJson.message || "Failed to fetch stock data.");
        return;
      }

      const historicalData = stockJson.data;
      if (!historicalData.length) {
        alert("No data found.");
        return;
      }

      /* ---- Prediction ---- */
      const predictRes = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol,
          data: historicalData,
          method: "linear-regression",
        }),
      });

      const predictJson = await predictRes.json();

      if (!predictJson.success || predictJson.predictedPrice == null) {
        alert("Prediction failed (ML service issue).");
        return;
      }

      /* ---- Chart Build ---- */
      const labels = historicalData.map((d) => d.date);
      const prices = historicalData.map((d) => Number(d.close.toFixed(2)));

      const lastDate = new Date(labels.at(-1));
      lastDate.setDate(lastDate.getDate() + 1);
      const predictedDate = lastDate.toISOString().split("T")[0];

      setChartData({
        labels: [...labels, predictedDate],
        datasets: [
          {
            label: `Close Price`,
            data: [...prices, predictJson.predictedPrice],
            borderColor: "#6366f1",
            backgroundColor: "rgba(99,102,241,0.12)",
            tension: 0.4,
            pointBackgroundColor: prices.map((_, i) =>
              i === prices.length ? "#ef4444" : "#6366f1",
            ),
          },
        ],
      });

      setAnalysisResult(
        `Predicted price for ${companyName} (${symbol}) on ${predictedDate}: ${predictJson.predictedPrice}`,
      );
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [companyName, symbol, period1, period2]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* -------------------- UI -------------------- */
  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-8 text-center text-3xl font-extrabold">
        <span className="bg-gradient-to-r from-indigo-500 to-sky-500 bg-clip-text text-transparent">
          Stock Analysis
        </span>
      </h1>

      {loading && (
        <p className="text-center text-slate-600">Loading analysis…</p>
      )}

      {!loading && analysisResult && (
        <p className="mb-6 text-center text-lg font-medium text-slate-700">
          {analysisResult}
        </p>
      )}

      {!loading && chartData && (
        <div className="rounded-2xl bg-white p-6 shadow">
          <Line data={chartData} />
        </div>
      )}
    </section>
  );
}
