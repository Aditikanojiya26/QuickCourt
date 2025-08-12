import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMyBookings } from "../../services/User/api";


const MyBookings = () => {
 const { data: bookings = [], isLoading, isError, error } = useQuery({
  queryKey: ["myBookings"],
  queryFn: fetchMyBookings,
});


  if (isLoading) return <p>Loading your bookings...</p>;
  if (isError) return <p>Error: {error.message || "Failed to fetch bookings."}</p>;

  if (bookings.length === 0) return <p>No bookings found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
      <ul className="space-y-4">
        {bookings.map((booking) => (
  <li key={booking._id} className="border p-4 rounded shadow">
    <p>
      <strong>Venue:</strong> {booking.venueId?.name || "N/A"}
    </p>
    <p>
      <strong>Location:</strong>{' '}
      {booking.venueId?.location
        ? [
            booking.venueId.location.address,
            booking.venueId.location.city,
            booking.venueId.location.state,
            booking.venueId.location.pincode,
          ]
            .filter(Boolean)
            .join(", ")
        : "N/A"}
    </p>
    <p>
      <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}
    </p>
    <p>
      <strong>Time:</strong> {booking.startTime}:00 - {booking.endTime}:00
    </p>
    <p>
      <strong>Status:</strong> {booking.status}
    </p>
  </li>
))}

      </ul>
    </div>
  );
};

export default MyBookings;
