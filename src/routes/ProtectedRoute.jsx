import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../features/auth/context/auth";
import useSessionTimeout from "../services/useSessionTimeout";

export default function ProtectedRoute() {
  useSessionTimeout();
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
}
