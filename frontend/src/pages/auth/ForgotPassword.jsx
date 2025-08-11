import React from "react";
import { useForm } from "react-hook-form";
import { useForgotPasswordMutation } from "../../services/auth/useAuthQuery";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const mutation = useForgotPasswordMutation();

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">Forgot Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
          className="mt-2"
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value:
                  /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: "Invalid email address",
              },
            })}
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={mutation.isLoading}
          className="w-full"
        >
          {mutation.isLoading ? "Sending OTP..." : "Send OTP"}
        </Button>
      </form>
    </div>
  );
}
