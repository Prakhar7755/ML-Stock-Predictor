import { fail, ok } from '@/lib/api';
import { getMarketOverview } from '@/lib/market';

export async function GET() {
  try {
    const overview = await getMarketOverview();
    return ok({ overview });
  } catch (err) {
    console.error('Market overview error:', err);
    return fail('Unable to fetch market overview right now.', 502);
  }
}
