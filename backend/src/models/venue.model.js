// models/venue.model.js
import mongoose, { Schema } from "mongoose";

const locationSchema = new Schema(
  {
    address: { type: String, required: true },  // Street address
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  { _id: false }
);

const venueSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    location: { type: locationSchema, required: true },
    description: { type: String },
    venueType: { type: String, enum: ["Indoor", "Outdoor"], required: false },
    sportsTypes: [{ type: String, required: true }],
    amenities: [{ type: String }],
    about: { type: String },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    photos: [{ type: String }],
  },
  { timestamps: true }
);

export const Venue = mongoose.model("Venue", venueSchema);
