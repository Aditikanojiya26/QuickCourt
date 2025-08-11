// models/booking.model.js
import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courtId: { type: Schema.Types.ObjectId, ref: "Court", required: true },
    venueId: { type: Schema.Types.ObjectId, ref: "Venue", required: true },
    date: { type: Date, required: true },
    startTime: { type: Number, required: true },
    endTime: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["confirmed", "cancelled", "completed"], default: "confirmed" },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: null
    }
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
