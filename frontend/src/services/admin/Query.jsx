import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../utils/axios";


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
