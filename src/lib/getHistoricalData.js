import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export async function getHistoricalData(symbol, period1Input, period2Input) {
  try {
    const now = new Date();

    const period1 = period1Input
      ? new Date(period1Input)
      : new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const period2 = period2Input ? new Date(period2Input) : now;

    if (period1 > period2) {
      throw new Error("period1 must be earlier than or equal to period2");
    }

    const result = await yahooFinance.chart(symbol, {
      period1,
      period2,
      interval: "1d",
    });

    if (!result?.quotes?.length) return null;

    return result.quotes.map((q) => ({
      date: q.date.toISOString().split("T")[0],
      open: q.open,
      high: q.high,
      low: q.low,
      close: q.close,
      volume: q.volume,
    }));
  } catch (err) {
    console.error("❌ Failed to fetch stock data:", err);
    return null;
  }
}

