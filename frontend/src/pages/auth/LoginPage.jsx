import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "@/services/auth/useAuthQuery";
import { FcGoogle } from "react-icons/fc";
import { queryClient } from "../../utils/queryClient";
import { NavLink } from "react-router-dom";
export function LoginPage({ className, ...props }) {
  const loginMutation = useLoginMutation();

  const {
    register, handleSubmit, formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  const handleGoogleLogin = () => {
    queryClient.invalidateQueries(["auth", "me"]);
    window.location.href = 'http://localhost:8000/api/v1/auth/google';
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-6 md:p-8 flex flex-col gap-6"
              >
                <div className="text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  {/* <p className="text-muted-foreground text-sm">
                    Login to your Acme Inc account
                  </p> */}
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="email">Email or Username</Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="m@example.com"
                    {...register("emailOrUsername", {
                      required: "Email or Username is required",
                    })}
                  />
                  {errors.emailOrUsername && (
                    <p className="text-sm text-red-500">
                      {errors.emailOrUsername.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <NavLink
                      to="/forgot-password"
                      className="text-sm underline-offset-2 hover:underline"
                    >
                      Forgot your password?
                    </NavLink>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full">
                  {loginMutation.isPending ? "Logging in..." : "Login"}
                </Button>

                {/* OR Separator */}
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>

                {/* Social Logins */}
                <div className="grid grid-cols-1">
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                    type="button"
                    onClick={handleGoogleLogin}
                  >
                    <FcGoogle className="h-5 w-5" />
                    Continue with Google
                  </Button>
                </div>


                <div className="text-center text-sm">
                  Don’t have an account?{" "}
                  <NavLink
                    to="/register"
                    className="underline underline-offset-4"
                  >
                    Sign up
                  </NavLink>
                </div>
              </form>

              {/* Right Side Illustration (optional) */}
              <div className="bg-muted relative hidden md:block">
                <img
                  src="https://plus.unsplash.com/premium_photo-1754392582865-6902ee69cdb9?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Login Illustration"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-muted-foreground text-center text-xs *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}

