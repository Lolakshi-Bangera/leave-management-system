import React from "react";
import { Avatar, Card, CardContent, Stack, Typography } from "@mui/material";

export default function StatCard({ title, value, icon, color = "#2563EB" }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <div>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h4" sx={{ mt: 0.5 }}>
              {value}
            </Typography>
          </div>
          <Avatar sx={{ bgcolor: `${color}18`, color }}>{icon}</Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
}
