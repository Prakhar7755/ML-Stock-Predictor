import { NextResponse } from "next/server";
import { getHistoricalData } from "@/lib/getHistoricalData";

export async function POST(req) {
  try {
    const { name, symbol, period1, period2 } = await req.json();

    if (!name || !symbol || !period1 || !period2) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, Symbol, Period 1 & 2 are all required.",
        },
        { status: 400 },
      );
    }

    const data = await getHistoricalData(symbol, period1, period2);

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: "No stock data found for the given period.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Stock data fetched successfully.",
      symbol,
      data,
    });
  } catch (err) {
    console.error("🔥 Stock API error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error." },
      { status: 500 },
    );
  }
}
