import { fail, ok, requireUser } from '@/lib/api';
import { buildTechnicalSnapshot } from '@/lib/market';
import { generateInsight } from '@/lib/gemini';

export function fallbackInsight(snapshot, riskProfile, reason) {
  const trend = snapshot.trend;
  const rangePosition =
    snapshot.high90 === snapshot.low90
      ? 0
      : ((snapshot.latest - snapshot.low90) / (snapshot.high90 - snapshot.low90)) * 100;

  return {
    summary: `${snapshot.symbol} is currently ${trend} with a 90-day return of ${snapshot.return90d.toFixed(2)}%.`,
    metrics: [
      { label: 'Current Price', value: `$${snapshot.latest.toFixed(2)}` },
      { label: 'Trend', value: trend },
      { label: '90-Day Return', value: `${snapshot.return90d.toFixed(2)}%` },
    ],
    highlights: [
      {
        title: 'Range Position',
        value: `Trading around ${rangePosition.toFixed(0)}% of its 90-day range.`,
      },
      {
        title: '90-Day High / Low',
        value: `$${snapshot.low90.toFixed(2)} - $${snapshot.high90.toFixed(2)}`,
      },
      { title: 'Fallback Note', value: reason },
    ],
    risks: [
      {
        title: 'Position Size Advisory',
        description: `${riskProfile} risk profile investors should double-check stop-loss targets and limits.`,
      },
    ],
    disclaimer:
      'This is a deterministic technical fallback summary rather than a live Gemini response.',
  };
}

export async function POST(req) {
  try {
    const { user, response } = await requireUser();
    if (response) return response;

    const { symbol } = await req.json();
    if (!symbol?.trim()) return fail('Symbol is required.');

    const snapshot = await buildTechnicalSnapshot(symbol.trim().toUpperCase());
    if (!snapshot) return fail('Not enough market data for this symbol.', 404);

    if (!process.env.GEMINI_API_KEY) {
      return ok({
        provider: 'local-fallback',
        snapshot,
        insight: fallbackInsight(snapshot, user.riskProfile, 'AI key is not configured.'),
      });
    }

    try {
      const { insight, model } = await generateInsight(snapshot, user.riskProfile);
      return ok({
        success: true,
        provider: `gemini (${model})`,
        snapshot,
        insight,
      });
    } catch (gemErr) {
      // Gemini request failed – fall back
      return ok({
        success: true,
        provider: 'local-fallback',
        snapshot,
        insight: fallbackInsight(snapshot, user.riskProfile, 'Gemini request failed.'),
        message: gemErr.message,
      });
    }
  } catch (err) {
    console.error('Insights error:', err);
    return fail('Internal Server Error.', 500);
  }
}
