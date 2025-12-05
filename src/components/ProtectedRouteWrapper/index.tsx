// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

export const ProtectedRoute = () => {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  // If no token → redirect to sign-in
  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  // Otherwise → render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
