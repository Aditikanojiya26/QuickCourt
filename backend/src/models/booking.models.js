// models/booking.model.js
import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courtId: { type: Schema.Types.ObjectId, ref: "Court", required: true },
    venueId: { type: Schema.Types.ObjectId, ref: "Venue", required: true },
    date: { type: Date, required: true },
    startTime: { type: Number, required: true }, // e.g., 8 for 8 AM
    endTime: { type: Number, required: true },   // e.g., 10 for 10 AM
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["confirmed", "cancelled", "completed"], default: "confirmed" },
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
