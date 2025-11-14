import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useContext(AuthContext);

  // For now, allow all since login isn’t implemented yet
  // Later you can add role-based checks here
  return children ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
