import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema(
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
    targetPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    direction: {
      type: String,
      enum: ["above", "below"],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastTriggeredAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

AlertSchema.index({ user: 1, symbol: 1, isActive: 1 });

export default mongoose.models.Alert || mongoose.model("Alert", AlertSchema);
