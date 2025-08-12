import React from "react";
import { useQuery } from "@tanstack/react-query";

import axiosInstance from "../../utils/axios";

const fetchApprovedVenues = async () => {
  const { data } = await axiosInstance.get("admin/venues/approved");
  return data.data;
};

const fetchRejectedVenues = async () => {
  const { data } = await axiosInstance.get("admin/venues/rejected");
  return data.data;
};

export default function VenuesStatus() {
  const {
    data: approvedVenues = [],
    isLoading: loadingApproved,
    isError: errorApproved,
    error: approvedError,
  } = useQuery({
    queryKey: ["venues", "approved"],
    queryFn: fetchApprovedVenues,
  });

  const {
    data: rejectedVenues = [],
    isLoading: loadingRejected,
    isError: errorRejected,
    error: rejectedError,
  } = useQuery({
    queryKey: ["venues", "rejected"],
    queryFn: fetchRejectedVenues,
  });

  if (loadingApproved || loadingRejected) {
    return (
      <p className="text-center text-gray-500 text-lg py-6">Loading venues...</p>
    );
  }

  if (errorApproved) {
    return (
      <p className="text-center text-red-600 font-semibold py-6">
        Error loading approved venues: {approvedError.message}
      </p>
    );
  }

  if (errorRejected) {
    return (
      <p className="text-center text-red-600 font-semibold py-6">
        Error loading rejected venues: {rejectedError.message}
      </p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <section>
        <h2 className="text-2xl font-bold mb-4">Approved Venues</h2>
        {approvedVenues.length === 0 ? (
          <p className="text-gray-600">No approved venues found.</p>
        ) : (
          <ul className="space-y-4">
            {approvedVenues.map((venue) => (
              <li
                key={venue._id}
                className="border p-4 rounded shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold">{venue.name}</h3>
                <p className="text-gray-700">{venue.description}</p>
                <p className="mt-1 text-sm text-green-600 font-medium">
                  Status: {venue.status}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Rejected Venues</h2>
        {rejectedVenues.length === 0 ? (
          <p className="text-gray-600">No rejected venues found.</p>
        ) : (
          <ul className="space-y-4">
            {rejectedVenues.map((venue) => (
              <li
                key={venue._id}
                className="border p-4 rounded shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold">{venue.name}</h3>
                <p className="text-gray-700">{venue.description}</p>
                <p className="mt-1 text-sm text-red-600 font-medium">
                  Status: {venue.status}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
