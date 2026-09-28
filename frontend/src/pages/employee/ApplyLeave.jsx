import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import api from "../../services/api";

export default function ApplyLeave() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    leaveType: "casual",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.startDate || !form.endDate || !form.reason.trim()) {
      setError("Please fill in all leave details.");
      return;
    }
    if (form.endDate < form.startDate) {
      setError("End date cannot be before start date.");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/leaves", { ...form, reason: form.reason.trim() });
      setSuccess("Leave application submitted successfully.");
      setForm({ leaveType: "casual", startDate: "", endDate: "", reason: "" });
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to submit leave request.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack spacing={3} maxWidth={900}>
      <div>
        <Typography variant="h4">Apply Leave</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Fill in the details to apply for leave.
        </Typography>
      </div>
      {success && <Alert severity="success">{success}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <Card>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Stack component="form" onSubmit={handleSubmit} spacing={2.5}>
            <TextField
              select
              label="Leave Type"
              value={form.leaveType}
              onChange={update("leaveType")}
            >
              <MenuItem value="casual">Casual Leave</MenuItem>
              <MenuItem value="sick">Sick Leave</MenuItem>
              <MenuItem value="earned">Earned Leave</MenuItem>
            </TextField>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="date"
                  label="Start Date"
                  value={form.startDate}
                  onChange={update("startDate")}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="date"
                  label="End Date"
                  value={form.endDate}
                  onChange={update("endDate")}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              multiline
              minRows={5}
              label="Reason"
              value={form.reason}
              onChange={update("reason")}
              placeholder="Please provide reason for your leave..."
            />
            <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate("/employee/dashboard")}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting ? "Submitting..." : "Apply Leave"}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
