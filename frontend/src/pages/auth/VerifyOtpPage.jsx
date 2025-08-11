import React from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useVerifyOtpMutation } from "../../services/auth/useAuthQuery";

import {
  Button,
} from "@/components/ui/button";
import {
  Input,
} from "@/components/ui/input";
import {
  Label,
} from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { toast } from "sonner";

const VerifyOtpPage = () => {
  const { state } = useLocation(); // to get email from register page
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: state?.email || "",
      otp: "",
    },
  });

  const mutation = useVerifyOtpMutation();

  const onSubmit = (data) => {
    mutation.mutate(data, {
      onSuccess: () => {
        toast.success("OTP verified successfully!");
        navigate("/login");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Invalid OTP");
      },
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Verify OTP
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="email" className="mb-3">Email</Label>
              <Input id="email" {...register("email")} readOnly />
            </div>

            <div>
              <Label htmlFor="otp" className="mb-3">OTP</Label>
              <Input
                id="otp"
                {...register("otp", { required: true })}
                placeholder="Enter your OTP"
              />
            </div>

            <Button type="submit" className="w-full mb-3" disabled={mutation.isPending}>
              {mutation.isPending ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyOtpPage;
