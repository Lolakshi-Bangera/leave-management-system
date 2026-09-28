import React from "react";
import { useEffect, useState } from "react";
import {
  CheckCircleRounded,
  EventRounded,
  GroupRounded,
  HourglassTopRounded,
} from "@mui/icons-material";
import {
  Alert,
  Card,
  CardContent,
  Grid,
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
import { useNavigate } from "react-router-dom";
import StatCard from "../../components/common/StatCard";
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

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const load = async () => {
    try {
      setError("");
      const [dashboard, leaves] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/leaves"),
      ]);
      setStats(dashboard.data.stats);
      setRequests(leaves.data.leaves || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load admin dashboard.",
      );
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
        <Typography variant="h4">Admin Dashboard</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Manage leave requests and view an overall summary.
        </Typography>
      </div>
      {error && <Alert severity="error">{error}</Alert>}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Total Employees"
            value={stats.totalEmployees}
            icon={<GroupRounded />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Pending Requests"
            value={stats.pending}
            icon={<HourglassTopRounded />}
            color="#F59E0B"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Approved Requests"
            value={stats.approved}
            icon={<CheckCircleRounded />}
            color="#16A34A"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Rejected Requests"
            value={stats.rejected}
            icon={<EventRounded />}
            color="#DC2626"
          />
        </Grid>
      </Grid>
      <Card>
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="h6">Recent Leave Requests</Typography>
            <Button size="small" onClick={() => navigate("/admin/requests")}>
              View all
            </Button>
          </Stack>
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
                    "Status",
                    "Action",
                  ].map((x) => (
                    <TableCell key={x}>{x}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.slice(0, 5).map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>{row.employee?.name || "-"}</TableCell>
                    <TableCell>{typeLabels[row.leaveType]}</TableCell>
                    <TableCell>{formatDate(row.startDate)}</TableCell>
                    <TableCell>{formatDate(row.endDate)}</TableCell>
                    <TableCell>{row.days}</TableCell>
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
                    <TableCell colSpan={7} align="center">
                      No leave requests yet.
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
