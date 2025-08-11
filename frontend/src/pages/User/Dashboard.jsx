import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import UserDashboard from "./UserDashboard";
const Dashboard = () => {
  const { user, isLoading, isError } = useAuth();

  if (isLoading) return <LoadingSpinner/>;
  if (isError || !user) return <div>Error loading user</div>;

  console.log("👤 user:", user); // Should log user object directly

  return <UserDashboard user={user} />;
};
export default Dashboard;