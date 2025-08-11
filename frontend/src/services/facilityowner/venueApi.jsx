import axiosInstance from "../../utils/axios";

// src/hooks/useVenuesQuery.js
import { useQuery } from "@tanstack/react-query";
// Fetch function to get venues
const fetchVenues = async () => {
  const response = await axiosInstance.get("venues/");
  console.log(response.data.data)
  return response.data.data;  // <-- important
};

// Custom hook for venues query
export const useVenuesQuery = () => {
  return useQuery({
    queryKey: ["venues"],
    queryFn: fetchVenues,
    retry: 2,
  });
};

export const createVenue = (formData) =>
  axiosInstance.post("venues/", formData, { headers: { "Content-Type": "multipart/form-data" } });

// Fetch single venue by ID
const fetchVenueById = async (id) => {

  const response = await axiosInstance.get(`venues/${id}`);
  console.log()
  return response.data.data; // matches your API shape
};

// Custom hook for single venue
export const useVenueByIdQuery = (id) => {
  return useQuery({
    queryKey: ["venue", id], // unique per venue
    queryFn: () => fetchVenueById(id),
    enabled: !!id, // only runs if id is provided
    retry: 2,
  });
};
