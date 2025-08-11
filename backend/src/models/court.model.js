// models/court.model.js
import mongoose, { Schema } from "mongoose";

const timeSlotSchema = new Schema(
  {
    start: { type: Number, required: true }, // in 24hr format (8 means 8:00)
    end: { type: Number, required: true },
    pricePerHour: { type: Number, required: true },
  },
  { _id: false }
);

const operatingHoursSchema = new Schema(
  {
    weekdays: [timeSlotSchema],
    weekends: [timeSlotSchema],
    holidays: [timeSlotSchema],
  },
  { _id: false }
);

const courtSchema = new Schema(
  {
    venueId: { type: Schema.Types.ObjectId, ref: "Venue", required: true },
    name: { type: String, required: true },
    sportsType: { type: String, required: true }, // e.g., "Badminton"
    operatingHours: operatingHoursSchema,
  },
  { timestamps: true }
);

export const Court = mongoose.model("Court", courtSchema);
