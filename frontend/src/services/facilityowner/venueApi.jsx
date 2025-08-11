import axiosInstance from "../../utils/axios";

export const fetchVenues = () => api.get("/").then((res) => res.data.data);
export const fetchVenue = (id) => api.get(`/${id}`).then((res) => res.data.data);

export const createVenue = (formData) =>
  axiosInstance.post("venues/", formData, { headers: { "Content-Type": "multipart/form-data" } });

export const updateVenue = (id, formData) =>
  axiosInstance.put(`venues/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });

export const deleteVenue = (id) => api.delete(`/${id}`);