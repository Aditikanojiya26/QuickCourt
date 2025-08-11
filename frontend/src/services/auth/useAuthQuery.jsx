import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { queryClient } from "../../utils/queryClient";

export const useAuthQuery = () => {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const res = await axiosInstance.get("users/me", { withCredentials: true });
      console.log(res.data.data)
      return res.data.data
    },
    retry: false,
  });
}
export const useLoginMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ emailOrUsername, password }) => {
      const res = await axiosInstance.post("users/login", {
        email: emailOrUsername,
        username: emailOrUsername,
        password,
      });
      
      return res.data;
    },
    onSuccess: async (user) => {
      await queryClient.invalidateQueries(["auth", "me"]);
      toast.success("Login successful!");
      // const data = user.data.user;
      // const path = getUserRoleRedirectPath(data.role);
      navigate('/');
    },
    onError: (err) => {
      const message = err?.response?.data?.message || "Login failed";
      toast.error(message);
    },
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: async () => {
      await axiosInstance.post("/users/logout", {}, { withCredentials: true });
    },
    onSuccess: () => {
      // Clear cached user immediately
      queryClient.setQueryData(["auth", "me"], null);
      window.location.href = "/";
    },
    onError: (error) => {
      console.error("Logout failed", error);
    },
  });
};

export const useForgotPasswordMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ email }) => {
      const res = await axiosInstance.post("users/forgot-password", { email });
      return res.data;
    },
    onSuccess: (data, variables) => {
      toast.success(data.message || "OTP sent!");

      navigate(`/reset-password?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (err) => {
      const message = err?.response?.data?.message || "Failed to send OTP";
      toast.error(message);
    },
  });
};
export const useResetPasswordMutation = () => {
const navigate = useNavigate();
  return useMutation({
    mutationFn: async ({ email, otp, newPassword }) => {
      const res = await axiosInstance.post("users/reset-password", {
        email,
        otp,
        newPassword,
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Password reset successful!");
      // Optionally redirect to login or home page after reset
      navigate("/login");
    },
    onError: (err) => {
      const message = err?.response?.data?.message || "Failed to reset password";
      toast.error(message);
    },
  });
};

  export const useRegisterMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (formData) => {
      const res = await axiosInstance.post("/users/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Registered. OTP sent — check your email.");
      navigate("/verify-otp", { state: { email: data?.data?.email } });
    },
    onError: (err) => {
      const message = err?.response?.data?.message || "Registration failed";
      toast.error(message);
    },
  });
};


const verifyOtp = async ({ email, otp }) => {
  const response = await axiosInstance.post("users/verify-registration", {
    email,
    otp,
  });
  return response.data;
};

export const useVerifyOtpMutation = () => {
  return useMutation({
    mutationFn: verifyOtp,
  });
};
