// models/review.model.js
import mongoose, { Schema } from "mongoose";
import { Booking } from "./booking.model.js";
import { Venue } from "./venue.model.js";

const reviewSchema = new Schema(
  {
    venueId: { type: Schema.Types.ObjectId, ref: "Venue", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true }, // NEW link to booking
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, trim: true },
  },
  { timestamps: true }
);

reviewSchema.index({ userId: 1, venueId: 1 }, { unique: true }); // prevent duplicate reviews

// Middleware: after review is saved/updated
reviewSchema.post("save", async function (doc) {
  // Update Booking rating
  await Booking.findByIdAndUpdate(doc.bookingId, { rating: doc.rating });

  // Recalculate Venue average rating
  const agg = await mongoose.model("Review").aggregate([
    { $match: { venueId: doc.venueId } },
    { $group: { _id: "$venueId", avgRating: { $avg: "$rating" } } }
  ]);

  if (agg.length > 0) {
    await Venue.findByIdAndUpdate(doc.venueId, { averageRating: agg[0].avgRating });
  }
});

export const Review = mongoose.model("Review", reviewSchema);
