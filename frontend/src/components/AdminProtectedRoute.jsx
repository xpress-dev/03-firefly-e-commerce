import { Navigate } from "react-router-dom";
import useEcommerceStore from "../store/FireflyStore";

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useEcommerceStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
