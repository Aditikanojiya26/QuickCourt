// models/review.model.js
import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    venueId: { type: Schema.Types.ObjectId, ref: "Venue", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, trim: true },
  },
  { timestamps: true }
);

reviewSchema.index({ userId: 1, venueId: 1 }, { unique: true }); // prevent duplicate reviews

export const Review = mongoose.model("Review", reviewSchema);
