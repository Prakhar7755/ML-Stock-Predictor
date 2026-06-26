import { connectDB } from "@/lib/db";
import { fail, ok, requireUser } from "@/lib/api";
import Alert from "@/models/Alert";
import { getQuotes } from "@/lib/market";

export async function GET() {
  try {
    const { user, response } = await requireUser();
    if (response) return response;

    await connectDB();
    const alerts = await Alert.find({ user: user._id }).sort({ createdAt: -1 });
    const quotes = await getQuotes(alerts.map((alert) => alert.symbol));
    const quoteMap = new Map(quotes.map((quote) => [quote.symbol, quote]));

    const enrichedAlerts = alerts.map((alert) => {
      const quote = quoteMap.get(alert.symbol);
      const currentPrice = quote?.price ?? null;
      const isTriggered =
        alert.isActive &&
        currentPrice != null &&
        ((alert.direction === "above" && currentPrice >= alert.targetPrice) ||
          (alert.direction === "below" && currentPrice <= alert.targetPrice));

      return {
        id: alert._id.toString(),
        symbol: alert.symbol,
        name: alert.name,
        targetPrice: alert.targetPrice,
        direction: alert.direction,
        isActive: alert.isActive,
        currentPrice,
        isTriggered,
        createdAt: alert.createdAt,
      };
    });

    return ok({ alerts: enrichedAlerts });
  } catch (err) {
    console.error("Alerts fetch error:", err);
    return fail("Internal Server Error.", 500);
  }
}

export async function POST(req) {
  try {
    const { user, response } = await requireUser();
    if (response) return response;

    const { symbol, name = "", targetPrice, direction } = await req.json();

    if (
      !symbol?.trim() ||
      Number(targetPrice) <= 0 ||
      !["above", "below"].includes(direction)
    ) {
      return fail("Symbol, target price, and direction are required.");
    }

    await connectDB();
    const alert = await Alert.create({
      user: user._id,
      symbol: symbol.trim().toUpperCase(),
      name: name.trim(),
      targetPrice: Number(targetPrice),
      direction,
    });

    return ok({ message: "Alert created.", alert }, { status: 201 });
  } catch (err) {
    console.error("Alerts create error:", err);
    return fail("Internal Server Error.", 500);
  }
}

export async function PATCH(req) {
  try {
    const { user, response } = await requireUser();
    if (response) return response;

    const { id, isActive } = await req.json();
    if (!id || typeof isActive !== "boolean") {
      return fail("Alert id and active status are required.");
    }

    await connectDB();
    const alert = await Alert.findOneAndUpdate(
      { _id: id, user: user._id },
      { isActive },
      { new: true },
    );

    return ok({ message: "Alert updated.", alert });
  } catch (err) {
    console.error("Alerts update error:", err);
    return fail("Internal Server Error.", 500);
  }
}

export async function DELETE(req) {
  try {
    const { user, response } = await requireUser();
    if (response) return response;

    const { id } = await req.json();
    if (!id) return fail("Alert id is required.");

    await connectDB();
    await Alert.deleteOne({ _id: id, user: user._id });

    return ok({ message: "Alert removed." });
  } catch (err) {
    console.error("Alerts delete error:", err);
    return fail("Internal Server Error.", 500);
  }
}
