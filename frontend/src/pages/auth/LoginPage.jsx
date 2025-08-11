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
import back1 from "../../assets/Login_background.jpg";
import back2 from "../../assets/Login_super_background.jpg";

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
    // Outer div with back2 as background image
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: `url(${back2})` }}
    >
      <div className="absolute inset-0 bg-white opacity-20"></div>
      {/* Overlay to dim the background if needed */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Main content container with relative positioning and higher z-index */}
      <div className="relative w-full max-w-sm md:max-w-3xl z-10">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-6 md:p-8 flex flex-col gap-6 bg-white/90 dark:bg-black/70 rounded"
              >
                <div className="text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  {/* <p className="text-muted-foreground text-sm">
                    Login to your Acme Inc account
                  </p> */}
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="Enter your email"
                    {...register("emailOrUsername", {
                      required: "Email is required",
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
                  <span className="bg-white/90 text-muted-foreground relative z-10 px-2">
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
                  src={back1}
                  alt="Login Illustration"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-white text-center text-xs *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}