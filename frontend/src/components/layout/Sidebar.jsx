import React from "react";
import {
  DashboardRounded, EventAvailableRounded, HistoryRounded,
  AccountBalanceWalletRounded, PeopleRounded, AssignmentRounded, TuneRounded,
  LogoutRounded
} from "@mui/icons-material";
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, Divider, Button
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const employeeItems = [
  ["/employee/dashboard", "Dashboard", <DashboardRounded />],
  ["/employee/apply-leave", "Apply Leave", <EventAvailableRounded />],
  ["/employee/history", "Leave History", <HistoryRounded />],
  ["/employee/balance", "Leave Balance", <AccountBalanceWalletRounded />]
];

const adminItems = [
  ["/admin/dashboard", "Dashboard", <DashboardRounded />],
  ["/admin/requests", "Leave Requests", <AssignmentRounded />],
  ["/admin/employees", "Employees", <PeopleRounded />],
  ["/admin/policy", "Leave Policy", <TuneRounded />]
];

export default function Sidebar({ role }) {
  const { logout } = useAuth();
  const items = role === "admin" ? adminItems : employeeItems;

  return (
    <Drawer variant="permanent" sx={{
      width: 240,
      flexShrink: 0,
      "& .MuiDrawer-paper": {
        width: 240, boxSizing: "border-box", bgcolor: "#0F172A", color: "#CBD5E1",
        border: 0
      }
    }}>
      <Box sx={{ p: 2.5 }}>
        <Typography variant="h6" sx={{ color: "white" }}>◈ Leave Management</Typography>
        <Typography variant="caption" sx={{ color: "#94A3B8" }}>
          {role === "admin" ? "Administration" : "Employee Portal"}
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "#1E293B" }} />

      <List sx={{ p: 1.5 }}>
        {items.map(([path, label, icon]) => (
          <ListItemButton
            key={path}
            component={NavLink}
            to={path}
            sx={{
              borderRadius: 2, mb: .5, color: "#CBD5E1",
              "&.active": { bgcolor: "#2563EB", color: "white" },
              "&:hover": { bgcolor: "#1E293B" }
            }}
          >
            <ListItemIcon sx={{ minWidth: 38, color: "inherit" }}>{icon}</ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ mt: "auto", p: 2 }}>
        <Button fullWidth startIcon={<LogoutRounded />} onClick={logout}
          sx={{ color: "#CBD5E1", justifyContent: "flex-start" }}>
          Logout
        </Button>
      </Box>
    </Drawer>
  );
}