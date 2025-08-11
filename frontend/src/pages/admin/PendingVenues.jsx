// src/pages/admin/PendingVenues.jsx
import React from "react";
import { usePendingVenuesQuery, useApproveVenueMutation, useRejectVenueMutation } from "../../services/admin/Query";

export default function PendingVenues() {
  const { data, isLoading, isError, error } = usePendingVenuesQuery();
  const approveMutation = useApproveVenueMutation();
  const rejectMutation = useRejectVenueMutation();

  if (isLoading) return <p>Loading pending venues...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  const venues = data?.data || [];

  const handleApprove = (id) => {
    approveMutation.mutate(id);
  };

  const handleReject = (id) => {
    rejectMutation.mutate(id);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pending Venues for Approval</h1>
      {venues.length === 0 ? (
        <p>No pending venues</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <div key={venue._id} className="border rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold">{venue.name}</h2>
              <p className="text-sm text-gray-600">{venue.location?.address}</p>
              <p className="mt-2 text-gray-800">{venue.description}</p>
              <p className="text-sm mt-1">Type: {venue.venueType}</p>
              <p className="text-sm">Owner: {venue.ownerId?.fullName}</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleApprove(venue._id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  {approveMutation.isPending && approveMutation.variables === venue._id
                    ? "Approving..."
                    : "Approve"}
                </button>
                <button
                  onClick={() => handleReject(venue._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  {rejectMutation.isPending && rejectMutation.variables === venue._id
                    ? "Rejecting..."
                    : "Reject"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
