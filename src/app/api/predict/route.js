import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const {
      symbol,
      data = [],
      method = "linear-regression",
    } = await req.json();

    if (!symbol || data.length < 3) {
      return NextResponse.json(
        {
          success: false,
          message: "Symbol and sufficient stock data are required.",
        },
        { status: 400 },
      );
    }

    const closingPrices = data
      .map((d) => d.close)
      .filter((v) => typeof v === "number");

    const res = await fetch(`${process.env.ML_SERVICE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prices: closingPrices,
        method,
      }),
    });

    const json = await res.json();

    return NextResponse.json({
      success: true,
      symbol,
      predictedPrice: json.predicted_price,
    });
  } catch (err) {
    console.error("🔥 Prediction error:", err);
    return NextResponse.json(
      {
        success: false,
        message: `No response from Python/Flask API at ${process.env.ML_SERVICE_URL}.`,
      },
      { status: 500 },
    );
  }
}
