import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useRegisterMutation } from "../../services/auth/useAuthQuery";

const RegistrationPage = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("user"); // default
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [coverImage, setCoverImage] = useState(null);

    const mutation = useRegisterMutation();

   const handleSubmit = (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("fullName", fullName);
  formData.append("email", email);
  formData.append("password", password);
  formData.append("role", role);
  if (avatar) formData.append("avatar", avatar);
  if (coverImage) formData.append("coverImage", coverImage);

  mutation.mutate(formData);
};


    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Create an Account
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <Label htmlFor="fullName" className="mb-3">Full Name</Label>
                            <Input
                                id="fullName"
                                type="text"
                                placeholder="John Doe"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <Label htmlFor="email" className="mb-3">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Role */}
                        <div>
                            <Label htmlFor="role" className="mb-3">Role</Label>
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                                className="w-full border rounded px-2 py-1"
                            >
                                <option value="user">User</option>
                                <option value="facilityowner">Facility Owner</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        {/* Password */}
                        <div>
                            <Label htmlFor="password" className="mb-3">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Avatar */}
                        <div>
                            <Label htmlFor="avatar" className="mb-3">Avatar (Required)</Label>
                            <Input
                                id="avatar"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setAvatar(e.target.files[0])}
                                required
                            />
                        </div>



                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? "Registering..." : "Register"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default RegistrationPage;
