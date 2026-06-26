import YahooFinance from "yahoo-finance2";
import { getHistoricalData } from "@/lib/getHistoricalData";

const yahooFinance = new YahooFinance();

export async function getQuote(symbol) {
  const quote = await yahooFinance.quote(symbol);
  const price = quote.regularMarketPrice ?? quote.postMarketPrice ?? null;
  const previousClose = quote.regularMarketPreviousClose ?? null;
  const change = quote.regularMarketChange ?? null;
  const changePercent = quote.regularMarketChangePercent ?? null;

  return {
    symbol: quote.symbol || symbol,
    name: quote.shortName || quote.longName || symbol,
    exchange: quote.fullExchangeName || quote.exchange || "",
    currency: quote.currency || "",
    price,
    previousClose,
    change,
    changePercent,
    marketCap: quote.marketCap ?? null,
    dayHigh: quote.regularMarketDayHigh ?? null,
    dayLow: quote.regularMarketDayLow ?? null,
    volume: quote.regularMarketVolume ?? null,
  };
}

export async function getQuotes(symbols) {
  const cleanSymbols = [...new Set(symbols.map((symbol) => symbol.trim()))]
    .filter(Boolean)
    .map((symbol) => symbol.toUpperCase());

  const results = await Promise.allSettled(
    cleanSymbols.map((symbol) => getQuote(symbol)),
  );

  return results
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);
}

export async function getMarketOverview() {
  const indices = await getQuotes(["^GSPC", "^IXIC", "^DJI", "^NSEI", "^BSESN"]);
  const movers = await getQuotes([
    "AAPL",
    "MSFT",
    "NVDA",
    "TSLA",
    "AMZN",
    "GOOG",
    "META",
    "NFLX",
  ]);

  return {
    indices,
    movers: movers.sort(
      (a, b) => Math.abs(b.changePercent || 0) - Math.abs(a.changePercent || 0),
    ),
  };
}

export function calculatePortfolioMetrics(holdings, quotes) {
  const quoteMap = new Map(quotes.map((quote) => [quote.symbol, quote]));

  const positions = holdings.map((holding) => {
    const quote = quoteMap.get(holding.symbol);
    const currentPrice = quote?.price ?? holding.averageBuyPrice;
    const invested = holding.quantity * holding.averageBuyPrice;
    const currentValue = holding.quantity * currentPrice;
    const pnl = currentValue - invested;
    const pnlPercent = invested ? (pnl / invested) * 100 : 0;

    return {
      id: holding._id.toString(),
      symbol: holding.symbol,
      name: holding.name,
      quantity: holding.quantity,
      averageBuyPrice: holding.averageBuyPrice,
      currentPrice,
      invested,
      currentValue,
      pnl,
      pnlPercent,
    };
  });

  return {
    invested: positions.reduce((sum, item) => sum + item.invested, 0),
    currentValue: positions.reduce((sum, item) => sum + item.currentValue, 0),
    pnl: positions.reduce((sum, item) => sum + item.pnl, 0),
    positions,
  };
}

export async function buildTechnicalSnapshot(symbol) {
  const today = new Date();
  const start = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
  const data = await getHistoricalData(
    symbol,
    start.toISOString().split("T")[0],
    today.toISOString().split("T")[0],
  );

  if (!data?.length) return null;

  const closes = data.map((item) => item.close).filter(Number.isFinite);
  const volumes = data.map((item) => item.volume).filter(Number.isFinite);
  const latest = closes.at(-1);
  const first = closes[0];
  const average20 =
    closes.slice(-20).reduce((sum, value) => sum + value, 0) /
    Math.min(closes.length, 20);
  const averageVolume20 =
    volumes.slice(-20).reduce((sum, value) => sum + value, 0) /
    Math.min(volumes.length, 20);
  const high90 = Math.max(...closes);
  const low90 = Math.min(...closes);

  return {
    symbol,
    latest,
    return90d: first ? ((latest - first) / first) * 100 : 0,
    average20,
    averageVolume20,
    high90,
    low90,
    trend:
      latest > average20
        ? "trading above 20-day average"
        : "trading below 20-day average",
  };
}
