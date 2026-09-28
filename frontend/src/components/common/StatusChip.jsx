import React from "react";
import { Chip } from "@mui/material";

const config = {
  pending: { label: "Pending", color: "warning" },
  approved: { label: "Approved", color: "success" },
  rejected: { label: "Rejected", color: "error" }
};

export default function StatusChip({ status }) {
  const item = config[status] || config.pending;
  return <Chip size="small" label={item.label} color={item.color} />;
}