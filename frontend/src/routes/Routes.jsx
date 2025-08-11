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
import FacilityOwnerLayout from "../pages/Facilityowner/FacilityOwnerLayout";
import FacilityOwnerDashboard from "../pages/Facilityowner/FacilityOwnerDashboard";
import PendingVenues from "../pages/admin/PendingVenues";
import VenueForm from "../pages/Facilityowner/VenueForm";
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
          { path: "venues/pending", element: <PendingVenues /> },
          // other admin routes can go here
        ],
      },
    ],
  },
  {
  path: "/facilityowner",
  element: <ProtectedRoute allowedRoles={["facilityowner"]} />,
  children: [
    {
      element: <FacilityOwnerLayout />,
      children: [
        { path: "dashboard", element: <FacilityOwnerDashboard /> },

        // Venue CRUD pages
       // { path: "venues", element: <VenueListPage /> },           // List venues
        { path: "venues/create", element: <VenueForm /> },  // Create venue
        // { path: "venues/edit/:id", element: <VenueEditPage /> },  // Edit venue by ID
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
