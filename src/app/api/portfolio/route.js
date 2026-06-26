import { connectDB } from "@/lib/db";
import { fail, ok, requireUser } from "@/lib/api";
import Holding from "@/models/Holding";
import { calculatePortfolioMetrics, getQuotes } from "@/lib/market";

export async function GET() {
  try {
    const { user, response } = await requireUser();
    if (response) return response;

    await connectDB();
    const holdings = await Holding.find({ user: user._id }).sort({ symbol: 1 });
    const quotes = await getQuotes(holdings.map((holding) => holding.symbol));
    const portfolio = calculatePortfolioMetrics(holdings, quotes);

    return ok({ portfolio });
  } catch (err) {
    console.error("Portfolio fetch error:", err);
    return fail("Internal Server Error.", 500);
  }
}

export async function POST(req) {
  try {
    const { user, response } = await requireUser();
    if (response) return response;

    const {
      symbol,
      name = "",
      quantity,
      averageBuyPrice,
      boughtAt,
      broker = "Manual",
      notes = "",
    } = await req.json();

    if (!symbol?.trim() || Number(quantity) <= 0 || Number(averageBuyPrice) <= 0) {
      return fail("Symbol, quantity, and average buy price are required.");
    }

    await connectDB();
    const holding = await Holding.create({
      user: user._id,
      symbol: symbol.trim().toUpperCase(),
      name: name.trim(),
      quantity: Number(quantity),
      averageBuyPrice: Number(averageBuyPrice),
      boughtAt: boughtAt ? new Date(boughtAt) : new Date(),
      broker: broker.trim(),
      notes: notes.trim(),
    });

    return ok({ message: "Holding added.", holding }, { status: 201 });
  } catch (err) {
    console.error("Portfolio create error:", err);
    return fail("Internal Server Error.", 500);
  }
}

export async function DELETE(req) {
  try {
    const { user, response } = await requireUser();
    if (response) return response;

    const { id } = await req.json();
    if (!id) return fail("Holding id is required.");

    await connectDB();
    await Holding.deleteOne({ _id: id, user: user._id });

    return ok({ message: "Holding removed." });
  } catch (err) {
    console.error("Portfolio delete error:", err);
    return fail("Internal Server Error.", 500);
  }
}
