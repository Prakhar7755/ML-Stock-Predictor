import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Company from "@/models/Company";

export async function GET() {
  try {
    await connectDB();
    const companies = await Company.find().sort({ name: 1 });

    if (!companies.length) {
      return NextResponse.json(
        { success: false, message: "No companies found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Companies fetched successfully.",
      companies,
    });
  } catch (err) {
    console.error("🔥 Error fetching companies:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error." },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const { name, symbol } = await req.json();

    if (!name?.trim() || !symbol?.trim()) {
      return NextResponse.json(
        { success: false, message: "Name and Symbol both are required." },
        { status: 400 },
      );
    }

    await connectDB();

    const company = await Company.create({
      name: name.trim(),
      symbol: symbol.trim(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "New company record created.",
        data: company,
      },
      { status: 201 },
    );
  } catch (err) {
    if (err.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "A company with this symbol already exists.",
        },
        { status: 409 },
      );
    }

    console.error("🔥 Error creating company:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error." },
      { status: 500 },
    );
  }
}
