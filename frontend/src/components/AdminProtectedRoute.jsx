import { Navigate } from "react-router-dom";
import useEcommerceStore from "../store/FireflyStore";

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useEcommerceStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Handle both string and array role formats
  const userRole = Array.isArray(user.role) ? user.role[0] : user.role;

  if (userRole !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
