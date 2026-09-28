import React from "react";
import { useEffect, useState } from "react";
import {
  CalendarMonthRounded,
  CheckCircleRounded,
  HourglassTopRounded,
  EventBusyRounded,
} from "@mui/icons-material";
import {
  Alert,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import StatCard from "../../components/common/StatCard";
import StatusChip from "../../components/common/StatusChip";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

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

export default function EmployeeDashboard() {
  const { user, refreshUser } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [balance, setBalance] = useState(
    user?.leaveBalance || { casual: 0, sick: 0, earned: 0 },
  );
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const [leaveResponse, currentUser] = await Promise.all([
        api.get("/leaves"),
        refreshUser(),
      ]);
      setLeaves(leaveResponse.data.leaves || []);
      setBalance(currentUser.leaveBalance || {});
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load dashboard.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const available = Object.values(balance).reduce(
    (sum, value) => sum + Number(value || 0),
    0,
  );
  const pending = leaves.filter((x) => x.status === "pending").length;
  const approved = leaves.filter((x) => x.status === "approved").length;
  const rejected = leaves.filter((x) => x.status === "rejected").length;
  const total = 20;
  const percentage = Math.min((available / total) * 100, 100);
  const upcoming = leaves.find(
    (x) => x.status === "approved" && new Date(x.startDate) >= new Date(),
  );

  return (
    <Stack spacing={3}>
      <BoxHeader
        title="Dashboard"
        subtitle={`Good morning, ${user?.name?.split(" ")[0] || "there"}! Here's your leave overview.`}
      />
      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Available Leaves"
            value={available}
            icon={<CalendarMonthRounded />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Pending Requests"
            value={pending}
            icon={<HourglassTopRounded />}
            color="#F59E0B"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Approved Requests"
            value={approved}
            icon={<CheckCircleRounded />}
            color="#16A34A"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Rejected Requests"
            value={rejected}
            icon={<EventBusyRounded />}
            color="#DC2626"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Leave Balance</Typography>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mt: 2, mb: 1 }}
              >
                <Typography variant="body2" color="text.secondary">
                  {available} of {total} days available
                </Typography>
                <Typography fontWeight={600}>
                  {Math.round(percentage)}%
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{ height: 9, borderRadius: 5 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Upcoming Leave</Typography>
              {upcoming ? (
                <Stack sx={{ mt: 2 }} spacing={0.5}>
                  <Typography fontWeight={600}>
                    {typeLabels[upcoming.leaveType]}
                  </Typography>
                  <Typography color="text.secondary">
                    {formatDate(upcoming.startDate)} -{" "}
                    {formatDate(upcoming.endDate)} ({upcoming.days} day
                    {upcoming.days > 1 ? "s" : ""})
                  </Typography>
                </Stack>
              ) : (
                <Typography color="text.secondary" sx={{ mt: 2 }}>
                  No approved upcoming leaves.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Recent Leave Requests
          </Typography>
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
                {leaves.slice(0, 5).map((row) => (
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
                {!leaves.length && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
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

function BoxHeader({ title, subtitle }) {
  return (
    <div>
      <Typography variant="h4">{title}</Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5 }}>
        {subtitle}
      </Typography>
    </div>
  );
}
