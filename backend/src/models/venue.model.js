// models/venue.model.js
import mongoose, { Schema } from "mongoose";

const venueSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    description: { type: String },
    sportsTypes: [{ type: String, required: true }], // e.g., ["Badminton", "Tennis"]
    amenities: [{ type: String }], // e.g., ["Parking", "Drinking Water"]
    about: { type: String },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    photos: [{ type: String }], // cloudinary URLs
  },
  { timestamps: true }
);

export const Venue = mongoose.model("Venue", venueSchema);
