import mongoose from "mongoose";

const HoldingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
      default: "",
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    averageBuyPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    boughtAt: {
      type: Date,
      default: Date.now,
    },
    broker: {
      type: String,
      trim: true,
      default: "Manual",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true },
);

HoldingSchema.index({ user: 1, symbol: 1 });

export default mongoose.models.Holding ||
  mongoose.model("Holding", HoldingSchema);
