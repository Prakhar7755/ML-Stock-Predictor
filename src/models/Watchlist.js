import mongoose from "mongoose";

const WatchlistItemSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
      default: "",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const WatchlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      default: "Primary Watchlist",
    },
    items: {
      type: [WatchlistItemSchema],
      default: [],
    },
  },
  { timestamps: true },
);

WatchlistSchema.index({ user: 1, name: 1 }, { unique: true });

export default mongoose.models.Watchlist ||
  mongoose.model("Watchlist", WatchlistSchema);
