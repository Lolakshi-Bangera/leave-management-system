import React from "react";
import { useEffect, useState } from "react";
import {
  Alert,
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
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

export default function LeaveRequests() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get("/admin/leaves");
      setRequests(data.leaves || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load leave requests.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const review = async (id, action) => {
    try {
      setBusyId(id);
      const endpoint =
        action === "approve"
          ? `/admin/leaves/${id}/approve`
          : `/admin/leaves/${id}/reject`;
      const body =
        action === "reject"
          ? {
              rejectionReason:
                window.prompt("Reason for rejection (optional):", "") || "",
            }
          : undefined;
      await api.patch(endpoint, body);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || `Unable to ${action} leave.`);
    } finally {
      setBusyId("");
    }
  };

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Leave Requests</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Review and manage employee leave applications.
        </Typography>
      </div>
      {error && <Alert severity="error">{error}</Alert>}
      <Card>
        <CardContent>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  {[
                    "Employee",
                    "Type",
                    "Start",
                    "End",
                    "Days",
                    "Reason",
                    "Status",
                    "Action",
                  ].map((x) => (
                    <TableCell key={x}>{x}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>{row.employee?.name || "-"}</TableCell>
                    <TableCell>{typeLabels[row.leaveType]}</TableCell>
                    <TableCell>{formatDate(row.startDate)}</TableCell>
                    <TableCell>{formatDate(row.endDate)}</TableCell>
                    <TableCell>{row.days}</TableCell>
                    <TableCell>{row.reason}</TableCell>
                    <TableCell>
                      <StatusChip status={row.status} />
                    </TableCell>
                    <TableCell>
                      {row.status === "pending" && (
                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            disabled={busyId === row._id}
                            onClick={() => review(row._id, "approve")}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            color="error"
                            disabled={busyId === row._id}
                            onClick={() => review(row._id, "reject")}
                          >
                            Reject
                          </Button>
                        </Stack>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {!requests.length && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No leave requests found.
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
