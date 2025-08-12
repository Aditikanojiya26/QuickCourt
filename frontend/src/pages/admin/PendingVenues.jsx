import React from "react";
import { usePendingVenuesQuery, useApproveVenueMutation, useRejectVenueMutation } from "../../services/admin/Query";

export default function PendingVenues() {
  const { data, isLoading, isError, error } = usePendingVenuesQuery();
  const approveMutation = useApproveVenueMutation();
  const rejectMutation = useRejectVenueMutation();

  if (isLoading)
    return (
      <p className="text-center text-gray-500 mt-20 text-lg font-medium">
        Loading pending venues...
      </p>
    );
  if (isError)
    return (
      <p className="text-center text-red-600 mt-20 text-lg font-medium">
        Error: {error.message}
      </p>
    );

  const venues = data?.data || [];

  const handleApprove = (id) => {
    approveMutation.mutate(id);
  };

  const handleReject = (id) => {
    rejectMutation.mutate(id);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
        Pending Venues for Approval
      </h1>
      {venues.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No pending venues</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <div
              key={venue._id}
              className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col"
            >
              {/* Header strip with venue name */}
              <div className="bg-black/80 rounded-t-xl px-6 py-3">
                <h2 className="text-xl font-semibold text-white truncate">
                  {venue.name}
                </h2>
              </div>

              {/* Content below header */}
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-sm text-gray-600 truncate mb-2">
                  {venue.location?.address || "No address provided"}
                </p>

                <p className="mt-3 text-gray-800 flex-grow">{venue.description}</p>

                <p className="mt-4 text-sm font-medium text-gray-700 truncate">
                  <span className="font-semibold">Type:</span> {venue.venueType || "N/A"}
                </p>

                <p className="mt-1 text-sm font-medium text-gray-700 truncate">
                  <span className="font-semibold">Owner:</span> {venue.ownerId?.fullName || "Unknown"}
                </p>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => handleApprove(venue._id)}
                    className="flex-1 bg-black/80 hover:bg-green-700 text-white font-semibold rounded-lg py-2 shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={approveMutation.isPending && approveMutation.variables === venue._id}
                  >
                    {approveMutation.isPending && approveMutation.variables === venue._id
                      ? "Approving..."
                      : "Approve"}
                  </button>
                  <button
                    onClick={() => handleReject(venue._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg py-2 shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={rejectMutation.isPending && rejectMutation.variables === venue._id}
                  >
                    {rejectMutation.isPending && rejectMutation.variables === venue._id
                      ? "Rejecting..."
                      : "Reject"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}