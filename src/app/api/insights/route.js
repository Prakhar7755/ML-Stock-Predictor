import { fail, ok, requireUser } from '@/lib/api';
import { buildTechnicalSnapshot } from '@/lib/market';

export function fallbackInsight(snapshot, riskProfile, reason) {
  const trend = snapshot.trend;
  const rangePosition =
    snapshot.high90 === snapshot.low90
      ? 0
      : ((snapshot.latest - snapshot.low90) / (snapshot.high90 - snapshot.low90)) * 100;

  return [
    `${snapshot.symbol} is ${trend} with a 90-day return of ${snapshot.return90d.toFixed(2)}%.`,
    `It is trading around ${rangePosition.toFixed(0)}% of its 90-day range, so ${riskProfile} investors should compare this with position size and stop-loss rules before acting.`,
    `${reason} This is a deterministic technical summary rather than a Gemini response.`,
  ].join(' ');
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

    const prompt = `You are an educational stock-market assistant. Give a concise, non-advisory analysis for ${snapshot.symbol}. Use this data: ${JSON.stringify(
      snapshot
    )}. User risk profile: ${user.riskProfile}. Include risks and avoid telling the user to buy or sell.`;

    const geminiRes = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        model: 'gemini-3.5-flash',
        input: prompt,
      }),
    });

    if (!geminiRes.ok) {
      return ok({
        provider: 'local-fallback',
        snapshot,
        insight: fallbackInsight(snapshot, user.riskProfile, 'Gemini request failed.'),
      });
    }

    const geminiJson = await geminiRes.json();
    const insight =
      geminiJson?.output_text ||
      fallbackInsight(snapshot, user.riskProfile, 'Gemini did not return valid text.');

    return ok({
      provider: 'gemini',
      snapshot,
      insight,
    });
  } catch (err) {
    console.error('Insights error:', err);
    return fail('Internal Server Error.', 500);
  }
}
