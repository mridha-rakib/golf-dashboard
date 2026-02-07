import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

const ProtectedRoute = ({ children }) => {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user && user.role !== "admin") {
    logout();
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
