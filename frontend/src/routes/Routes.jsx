import {
  createBrowserRouter,
} from "react-router-dom";
import {LoginPage} from "../pages/auth/LoginPage";
import ProtectedRoute from "../components/ProtectedRoute";
import RootLayout from "../layout/RootLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminLayout from "../pages/admin/AdminLayout";
import Dashboard from "../pages/User/Dashboard";
import ResetPassword from "../pages/auth/ResetPassword";
import ForgotPassword from "../pages/auth/ForgotPassword";
import RegistrationPage from "../pages/auth/RegistrationPage";
import VerifyOtpPage from "../pages/auth/VerifyOtpPage";
const router = createBrowserRouter([
  {
    path: "/register",
    element: <RegistrationPage />
  },
  {
    path: "/verify-otp",
    element: <VerifyOtpPage />
  },
  {
    path:"/", 
    element:<RootLayout/>,
  },
  {
    path: "/login",
    element: <LoginPage />
  },
    {
    path: "/forgot-password",
    element: <ForgotPassword />
  },
    {
    path: "/reset-password",
    element: <ResetPassword />
  },
  {
    path: "/admin",
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [
      {
        element: <AdminLayout />,  // Use AdminLayout here
        children: [
          { path: "dashboard", element: <AdminDashboard /> },
          // other admin routes can go here
        ],
      },
    ],
  },
  {
    path: "/user/dashboard",
    element: <ProtectedRoute allowedRoles={["user"]} />,
    children: [
      { index: true, element: <Dashboard /> },
    ],
  },
]);
export default router;
