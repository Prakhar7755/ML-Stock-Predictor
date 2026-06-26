import { connectDB } from '@/lib/db';
import { fail, ok, requireUser } from '@/lib/api';
import PaperOrder from '@/models/PaperOrder';

export async function GET() {
  try {
    const { user, response } = await requireUser();
    if (response) return response;

    await connectDB();
    const orders = await PaperOrder.find({ user: user._id }).sort({
      executedAt: -1,
    });

    const summary = orders.reduce(
      (acc, order) => {
        const value = order.quantity * order.price;
        if (order.side === 'buy') acc.buyValue += value;
        if (order.side === 'sell') acc.sellValue += value;
        acc.orderCount += 1;
        return acc;
      },
      { buyValue: 0, sellValue: 0, orderCount: 0 }
    );

    return ok({ orders, summary });
  } catch (err) {
    console.error('Paper orders fetch error:', err);
    return fail('Internal Server Error.', 500);
  }
}

export async function POST(req) {
  try {
    const { user, response } = await requireUser();
    if (response) return response;

    const {
      symbol,
      name = '',
      side,
      quantity,
      price,
      orderType = 'market',
      notes = '',
    } = await req.json();

    if (
      !symbol?.trim() ||
      !['buy', 'sell'].includes(side) ||
      Number(quantity) <= 0 ||
      Number(price) <= 0
    ) {
      return fail('Symbol, side, quantity, and price are required.');
    }

    await connectDB();
    const order = await PaperOrder.create({
      user: user._id,
      symbol: symbol.trim().toUpperCase(),
      name: name.trim(),
      side,
      quantity: Number(quantity),
      price: Number(price),
      orderType,
      notes: notes.trim(),
    });

    return ok({ message: 'Paper order recorded.', order }, { status: 201 });
  } catch (err) {
    console.error('Paper order create error:', err);
    return fail('Internal Server Error.', 500);
  }
}
