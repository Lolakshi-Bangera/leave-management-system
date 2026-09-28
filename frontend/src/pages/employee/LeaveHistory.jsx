import React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Card,
  CardContent,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import StatusChip from "../../components/common/StatusChip";
import api from "../../services/api";

const typeLabels = {
  casual: "Casual Leave",
  sick: "Sick Leave",
  earned: "Earned Leave",
};
const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function LeaveHistory() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/leaves")
      .then(({ data }) => setRows(data.leaves || []))
      .catch((err) =>
        setError(
          err.response?.data?.message || "Unable to load leave history.",
        ),
      );
  }, []);

  const filtered = useMemo(
    () =>
      rows.filter((row) => {
        const statusMatch = status === "all" || row.status === status;
        const searchMatch =
          !search.trim() ||
          row.reason.toLowerCase().includes(search.toLowerCase());
        return statusMatch && searchMatch;
      }),
    [rows, status, search],
  );

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Leave History</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          View all your leave requests and their status.
        </Typography>
      </div>
      {error && <Alert severity="error">{error}</Alert>}
      <Card>
        <CardContent>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{ mb: 2 }}
          >
            <TextField
              select
              size="small"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              sx={{ minWidth: 160 }}
              label="Status"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </TextField>
            <TextField
              size="small"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by reason..."
            />
          </Stack>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  {[
                    "Type",
                    "Start Date",
                    "End Date",
                    "Days",
                    "Reason",
                    "Status",
                  ].map((x) => (
                    <TableCell key={x}>{x}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>{typeLabels[row.leaveType]}</TableCell>
                    <TableCell>{formatDate(row.startDate)}</TableCell>
                    <TableCell>{formatDate(row.endDate)}</TableCell>
                    <TableCell>{row.days}</TableCell>
                    <TableCell>{row.reason}</TableCell>
                    <TableCell>
                      <StatusChip status={row.status} />
                    </TableCell>
                  </TableRow>
                ))}
                {!filtered.length && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No matching leave requests.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Stack>
  );
}
