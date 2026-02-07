import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

const PublicRoute = ({ children }) => {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  if (token && user?.role === "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
