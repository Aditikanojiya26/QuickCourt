// src/queries/useLocationSearch.js
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../utils/axios";

const fetchLocations = async (search) => {
  if (!search) return [];
  const res = await axiosInstance.get(`/locations/search?query=${search}`);
  return res.data;
};

export const useLocationSearch = (search) => {
  return useQuery({
    queryKey: ["locations", search],
    queryFn: () => fetchLocations(search),
    enabled: search.length > 0, // prevents empty searches
  });
};
