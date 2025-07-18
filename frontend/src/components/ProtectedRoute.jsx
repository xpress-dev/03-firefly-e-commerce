import { Navigate, useLocation } from "react-router-dom";
import useEcommerceStore from "../store/FireflyStore";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useEcommerceStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
