import React from "react";
import { useForm } from "react-hook-form";
import { useResetPasswordMutation } from "../../services/auth/useAuthQuery";
import { useLocation } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ResetPassword() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const defaultEmail = params.get("email") || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: defaultEmail,
      otp: "",
      newPassword: "",
    },
  });

  const mutation = useResetPasswordMutation();

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">Reset Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Email */}
        <div className="mb-4">
          <Label htmlFor="email" className="mb-2">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            disabled={mutation.isLoading}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: "Invalid email address",
              },
            })}
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* OTP */}
        <div className="mb-4">
          <Label htmlFor="otp" className="mb-2">OTP</Label>
          <Input
            id="otp"
            type="text"
            placeholder="Enter OTP"
            disabled={mutation.isLoading}
            {...register("otp", {
              required: "OTP is required",
              pattern: {
                value: /^\d{6}$/,
                message: "OTP must be 6 digits",
              },
            })}
            aria-invalid={errors.otp ? "true" : "false"}
          />
          {errors.otp && (
            <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>
          )}
        </div>

        {/* New Password */}
        <div className="mb-6">
          <Label htmlFor="newPassword" className="mb-2">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="New password"
            disabled={mutation.isLoading}
            {...register("newPassword", {
              required: "New password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            aria-invalid={errors.newPassword ? "true" : "false"}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );
}
