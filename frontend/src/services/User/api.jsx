import axios from "axios";
import axiosInstance from "../../utils/axios";

// Fetch courts by venueId
export const fetchCourtsByVenue = async (venueId) => {
  const res = await axiosInstance.get(`booking/${venueId}/courts`);
  return res.data.data;
};

// Fetch available slots for court & date
export const fetchAvailableSlots = async ({ venueId, courtId, date }) => {
  if (!venueId || !courtId || !date) return [];
  const res = await axiosInstance.get("booking/slots", {
    params: { venueId, courtId, date },
  });
  return res.data.data;
};

// Create booking
export const createBookingApi = async (bookingData) => {
  const res = await axiosInstance.post("/api/bookings", bookingData);
  return res.data;
};
