import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createBookingApi, fetchAvailableSlots, fetchCourtsByVenue } from "../../services/User/api";

import { queryClient } from "../../utils/queryClient";
const BookVenue = () => {
  const location = useLocation();
  const navigate = useNavigate();
 
  const { venueId } = location.state || {};

  const [courtId, setCourtId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(1);
  const [error, setError] = useState(null);

  // Fetch courts for venue
  const { data: courts = [], isLoading: courtsLoading, isError: courtsError } = useQuery({
  queryKey: ["courts", venueId],
  queryFn: () => fetchCourtsByVenue(venueId),
  enabled: !!venueId,
});

const { data: slots = [], isLoading: slotsLoading } = useQuery({
  queryKey: ["slots", venueId, courtId, date],
  queryFn: () => fetchAvailableSlots({ venueId, courtId, date }),
  enabled: !!venueId && !!courtId && !!date,
});


  const mutation = useMutation( {
    mutationFn: createBookingApi,
    onSuccess: () => {
      alert("Booking created successfully!");
      queryClient.invalidateQueries(["slots", venueId, courtId, date]);
      navigate("/my-bookings"); // change as needed
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Booking failed");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    mutation.mutate({
      venueId,
      courtId,
      date,
      startTime: Number(startTime),
      duration: Number(duration),
    });
  };

  if (!venueId) return <p>Please select a venue first.</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Book Venue</h1>

      {/* Courts dropdown */}
      <div>
        <label className="block mb-1 font-semibold">Court</label>
        {courtsLoading ? (
          <p>Loading courts...</p>
        ) : courtsError ? (
          <p>Error loading courts.</p>
        ) : (
          <select
            value={courtId}
            onChange={(e) => setCourtId(e.target.value)}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select a court</option>
            {courts.map((court) => (
              <option key={court._id} value={court._id}>
                {court.name || court._id}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Date input */}
      <div>
        <label className="block mb-1 font-semibold">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Start Time dropdown from available slots */}
      <div>
        <label className="block mb-1 font-semibold">Start Time</label>
        {slotsLoading ? (
          <p>Loading available slots...</p>
        ) : (
          <select
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select a start time</option>
            {slots
              .filter((slot) => slot.status === "available")
              .map((slot, idx) => (
                <option key={idx} value={Number(slot.time.split("-")[0])}>
                  {slot.time}
                </option>
              ))}
          </select>
        )}
      </div>

      {/* Duration input */}
      <div>
        <label className="block mb-1 font-semibold">Duration (hours)</label>
        <input
          type="number"
          min="1"
          max="10"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        type="submit"
        disabled={mutation.isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {mutation.isLoading ? "Booking..." : "Book Venue"}
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}
    </form>
  );
};

export default BookVenue;
