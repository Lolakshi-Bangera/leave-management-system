import React from "react";

import {
  AccountCircleRounded,
  NotificationsNoneRounded,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";

export default function Topbar() {
  const { user } = useAuth();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "white",
        color: "#0F172A",
        borderBottom: "1px solid #E2E8F0",
      }}
    >
      <Toolbar sx={{ justifyContent: "flex-end" }}>
        <IconButton>
          <NotificationsNoneRounded />
        </IconButton>
        <Stack direction="row" alignItems="center" spacing={1.2} sx={{ ml: 1 }}>
          <AccountCircleRounded color="primary" />
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {user?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.role}
            </Typography>
          </Box>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
