import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

export default function PrivateRoute({ children }: { children: ReactNode }) {
  const isLoggedIn = localStorage.getItem("token"); // example token check

  return isLoggedIn ? children : <Navigate to="/" replace />;
}
