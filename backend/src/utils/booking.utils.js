import { Court } from "../models/court.model.js";
import { Booking } from "../models/booking.models.js";
import dayjs from "dayjs";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Helper: generate slot strings from start/end float hours
function toSlotString(startHourFloat, endHourFloat) {
  const sh = Math.floor(startHourFloat).toString().padStart(2, "0");
  const sm = Math.round((startHourFloat - Math.floor(startHourFloat)) * 60)
    .toString()
    .padStart(2, "0");
  const eh = Math.floor(endHourFloat).toString().padStart(2, "0");
  const em = Math.round((endHourFloat - Math.floor(endHourFloat)) * 60)
    .toString()
    .padStart(2, "0");
  return `${sh}:${sm}-${eh}:${em}`;
}

function generateSlotsFromWindows(windows, slotDuration = 60) {
  const out = [];
  for (const w of windows) {
    let cur = w.start;
    while (cur + slotDuration / 60 <= w.end) {
      out.push({
        slot: toSlotString(cur, cur + slotDuration / 60),
        pricePerHour: w.pricePerHour || 0,
      });
      cur += slotDuration / 60;
    }
  }
  return out;
}

// Main function
export const getAvailableSlotsForCourtOnDate = async (courtId, date) => {
  const court = await Court.findById(courtId);
  if (!court) throw new Error("Court not found");

  const { operatingHours } = court; // your court object
  const type = new Date(date).getDay() >= 6 ? "weekends" : "weekdays";
  const windows = operatingHours[type] || [];

  const slots = [];
  windows.forEach((w) => {
    let cur = w.start;
    while (cur < w.end) {
      const startHour = Math.floor(cur).toString().padStart(2, "0");
      const startMin = Math.round((cur - Math.floor(cur)) * 60)
        .toString()
        .padStart(2, "0");
      let next = cur + 1; // 1 hour slot
      const endHour = Math.floor(next).toString().padStart(2, "0");
      const endMin = Math.round((next - Math.floor(next)) * 60)
        .toString()
        .padStart(2, "0");
      slots.push({
        slot: `${startHour}:${startMin}-${endHour}:${endMin}`,
        pricePerHour: w.pricePerHour,
        isBooked: false,
      });
      cur += 1; // increment by 1 hour
    }
  });

  // fetch existing bookings
  const bookings = await Booking.find({ courtId, date });
  const bookedSlots = bookings.map((b) => b.slot);

  // mark booked slots
  return slots.map((s) => ({
    ...s,
    isBooked: bookedSlots.includes(s.slot),
  }));
};