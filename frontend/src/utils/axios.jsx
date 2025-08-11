import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1/", // ⬅️ Replace with your API base URL
  withCredentials: true, // ⬅️ Include cookies for auth (optional)
});

export default axiosInstance;
