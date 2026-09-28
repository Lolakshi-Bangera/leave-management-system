import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

export default function EmployeeLayout() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8FAFC" }}>
      <Sidebar role="employee" />
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Topbar />
        <Box
          component="main"
          sx={{ p: { xs: 2, md: 3.5 }, maxWidth: 1500, mx: "auto" }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
