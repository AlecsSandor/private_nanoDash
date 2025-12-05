import { Navigate } from "react-router";
import { useAppSelector } from "../../store/hooks";
import React from "react"; // ensure React is imported

interface PublicRouteProps {
  children: React.ReactNode; // use React.ReactNode instead of JSX.Element
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const auth = useAppSelector(state => state.auth);

  if (auth.accessToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};