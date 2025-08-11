import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../utils/axios";
import { queryClient } from "../../utils/queryClient";


export const useUsersQuery = () => {
  return useQuery({
    queryKey: ["users", "list"],
    queryFn: async () => {
      const res = await axiosInstance.get("admin/getUsers", { withCredentials: true });
     
      return res.data;
    },
    retry: false,
  });
};

export const useApproveVenueMutation = () => {
  
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosInstance.patch(`admin/venues/${id}/approve`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingVenues"]);
    },
  });
};

export const useRejectVenueMutation = () => {
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosInstance.patch(`admin/venues/${id}/reject`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingVenues"]);
},
});
};

export const usePendingVenuesQuery = () => {
  return useQuery({
    queryKey: ["venues", "pending"],
    queryFn: async () => {
      const res = await axiosInstance.get("admin/pending", { withCredentials: true });
      return res.data;
    },
    retry: false,
  });
};