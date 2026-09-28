import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    return (
      <Navigate
        to={user.role === "admin" ? "/admin/dashboard" : "/employee/dashboard"}
        replace
      />
    );
  }

  return <Outlet />;
}
