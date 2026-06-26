import { connectDB } from '@/lib/db';
import { fail, ok, requireUser } from '@/lib/api';
import Watchlist from '@/models/Watchlist';
import { getQuotes } from '@/lib/market';

async function getDefaultWatchlist(userId) {
  return Watchlist.findOneAndUpdate(
    { user: userId, name: 'Primary Watchlist' },
    { $setOnInsert: { user: userId, name: 'Primary Watchlist', items: [] } },
    { upsert: true, new: true }
  );
}

export async function GET() {
  try {
    const { user, response } = await requireUser();
    if (response) return response;

    await connectDB();
    const watchlist = await getDefaultWatchlist(user._id);
    const quotes = await getQuotes(watchlist.items.map((item) => item.symbol));

    return ok({
      watchlist,
      quotes,
    });
  } catch (err) {
    console.error('Watchlist fetch error:', err);
    return fail('Internal Server Error.', 500);
  }
}

export async function POST(req) {
  try {
    const { user, response } = await requireUser();
    if (response) return response;

    const { symbol, name = '', notes = '' } = await req.json();
    if (!symbol?.trim()) return fail('Symbol is required.');

    await connectDB();
    const watchlist = await getDefaultWatchlist(user._id);
    const normalizedSymbol = symbol.trim().toUpperCase();

    const exists = watchlist.items.some((item) => item.symbol === normalizedSymbol);

    if (!exists) {
      watchlist.items.push({
        symbol: normalizedSymbol,
        name: name.trim(),
        notes: notes.trim(),
      });
      await watchlist.save();
    }

    return ok({
      message: exists ? 'Symbol already exists in watchlist.' : 'Symbol added.',
      watchlist,
    });
  } catch (err) {
    console.error('Watchlist update error:', err);
    return fail('Internal Server Error.', 500);
  }
}

export async function DELETE(req) {
  try {
    const { user, response } = await requireUser();
    if (response) return response;

    const { symbol } = await req.json();
    if (!symbol?.trim()) return fail('Symbol is required.');

    await connectDB();
    const watchlist = await getDefaultWatchlist(user._id);
    watchlist.items = watchlist.items.filter((item) => item.symbol !== symbol.trim().toUpperCase());
    await watchlist.save();

    return ok({ message: 'Symbol removed.', watchlist });
  } catch (err) {
    console.error('Watchlist delete error:', err);
    return fail('Internal Server Error.', 500);
  }
}
