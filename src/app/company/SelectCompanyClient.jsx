'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Line } from 'react-chartjs-2';
import '@/lib/chartjs';

const SelectedCompanyClient = () => {
  const searchParams = useSearchParams();
  const symbol = searchParams.get('symbol');
  const companyName = searchParams.get('name');

  const [chartData, setChartData] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [period1, setPeriod1] = useState(() => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(start.getDate() - 30);
    return start.toISOString().split('T')[0];
  });
  const [period2, setPeriod2] = useState(() => new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(Boolean(companyName && symbol));

  useEffect(() => {
    if (!companyName || !symbol || !period1 || !period2) {
      return;
    }

    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);

        /* ---- Stock Data ---- */
        const stockRes = await fetch('/api/stock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: companyName,
            symbol,
            period1,
            period2,
          }),
        });

        const stockJson = await stockRes.json();

        if (!stockJson.success || !Array.isArray(stockJson.data)) {
          alert(stockJson.message || 'Failed to fetch stock data.');
          return;
        }

        const historicalData = stockJson.data;

        /* ---- Prediction ---- */
        const predictRes = await fetch('/api/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            symbol,
            data: historicalData,
            method: 'linear-regression',
          }),
        });

        const predictJson = await predictRes.json();

        if (!predictJson.success || predictJson.predictedPrice == null) {
          alert('Prediction failed.');
          return;
        }

        /* ---- Chart Build ---- */
        const labels = historicalData.map((d) => d.date);
        const prices = historicalData.map((d) => Number(d.close.toFixed(2)));

        const nextDate = new Date(labels.at(-1));
        nextDate.setDate(nextDate.getDate() + 1);
        const predictedDate = nextDate.toISOString().split('T')[0];

        if (!isMounted) return;

        setChartData({
          labels: [...labels, predictedDate],
          datasets: [
            {
              label: 'Close Price',
              data: [...prices, predictJson.predictedPrice],
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.4,
              pointBackgroundColor: prices.map(() => '#10b981'),
            },
          ],
        });

        setAnalysisResult(
          `Predicted price for ${companyName} (${symbol}) on ${predictedDate}: ${predictJson.predictedPrice}`
        );
      } catch (err) {
        console.error(err);
        alert('Something went wrong.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [companyName, symbol, period1, period2]);

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 text-gray-100 md:px-6 md:py-12">
      <h1 className="mb-8 text-center text-3xl font-bold">
        Stock <span className="text-emerald-500">Analysis</span>
      </h1>

      {loading && <p className="text-center text-gray-500 animate-pulse">Loading analysis…</p>}

      {!loading && analysisResult && (
        <p className="mb-6 text-center text-lg font-medium text-emerald-400">{analysisResult}</p>
      )}

      {!loading && chartData && (
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-lg">
          <Line data={chartData} />
        </div>
      )}
    </section>
  );
};

export default SelectedCompanyClient;
