import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function RequireAuth({ children }: { children: JSX.Element }) {
  try {
    const { user } = useAuth();
    const location = useLocation();
    if (!user) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
    return children;
  } catch (e) {
    // if provider missing, redirect to login
    return <Navigate to="/login" replace />;
  }
}

export default RequireAuth;
