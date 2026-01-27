import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Company from "@/models/Company";
import mongoose from "mongoose";

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { name, symbol } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid company ID format." },
        { status: 400 },
      );
    }

    if (!name?.trim() || !symbol?.trim()) {
      return NextResponse.json(
        { success: false, message: "Name and Symbol both are required." },
        { status: 400 },
      );
    }

    await connectDB();

    const updated = await Company.findByIdAndUpdate(
      id,
      { name: name.trim(), symbol: symbol.trim() },
      { new: true },
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Company not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Company details updated successfully.",
      data: updated,
    });
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

    console.error("🔥 Update error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error." },
      { status: 500 },
    );
  }
}
