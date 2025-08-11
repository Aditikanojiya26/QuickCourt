import { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../public/vite.svg";
import { useAuth } from "../context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "../services/auth/useAuthQuery";
import getUserRoleRedirectPath from "../utils/roleRedirect";
const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user}  = useAuth(); 
   const dashboardPath = user ? getUserRoleRedirectPath(user.role) : "/login";
    const logoutMutation = useLogoutMutation();
    const navLinks = [
        { name: "Dashboard", path: dashboardPath },
        { name: "About", path: "/about" },

        
    ];

    return (
        <nav className="sticky top-0 z-50 py-3  backdrop-blur-transparent shadow-md font-[Poppins]">
            <div className="container mx-auto flex justify-between items-center px-4">
                <NavLink to="/" className="hover:text-red-500 transition">
                    <div className="flex items-center space-x-3">
                        <img src={logo} alt="Logo" className="h-10 w-10" />
                        <span className="text-xl font-semibold">Reware</span>
                    </div>
                </NavLink>

                <ul className="hidden lg:flex gap-8 bg-white/10 px-6 py-2 rounded-full shadow-md">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <NavLink
                                to={link.path}
                                className={({ isActive }) =>
                                    isActive
                                        ? "text-red-500 font-semibold"
                                        : "hover:text-red-500 transition"
                                }
                            >
                                {link.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                <div className="hidden lg:flex gap-4 items-center">
                    {user ? (
                        <>
                            <Avatar>
                                <AvatarImage src={user.avatar} alt={user.fullName} />
                                <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                            </Avatar>
                            <Button variant="outline" className="rounded-full"  onClick={() => logoutMutation.mutate()}>Logout</Button>
                        </>
                    ) : (
                        <NavLink
                            to="/login"
                            className="px-4 py-2 border rounded-full hover:bg-white hover:text-black transition"
                        >
                            Sign In
                        </NavLink>
                    )}
                </div>

                {/* Hamburger Button */}
                <div className="lg:hidden">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="text-black focus:outline-none"
                    >
                        <svg
                            className="w-7 h-7"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {menuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="lg:hidden px-4 pb-4 pt-2 bg-white shadow-md">
                    <ul className="flex flex-col space-y-3">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <NavLink
                                    to={link.path}
                                    onClick={() => setMenuOpen(false)}
                                    className={({ isActive }) =>
                                        isActive
                                            ? "text-red-500 font-semibold"
                                            : "hover:text-red-500 transition"
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                    <div className="flex flex-col gap-3 mt-4">
                        {!user ? (
                            <>
                                <NavLink
                                    to="/login"
                                    onClick={() => setMenuOpen(false)}
                                    className="px-4 py-2 border rounded-full text-center hover:bg-gray-100 transition"
                                >
                                    Sign In
                                </NavLink>
                                {/* <NavLink
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="text-white px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-700 rounded-full text-center hover:brightness-110 transition"
                >
                  Create Account
                </NavLink> */}
                            </>
                        ) : (
                            <Button variant="outline" className="rounded-full" onClick={() => logoutMutation.mutate()}>Logout</Button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
