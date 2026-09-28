import React from "react";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import api from "../../services/api";

const initialForm = {
  name: "",
  email: "",
  password: "",
  department: "General",
  joiningDate: new Date().toISOString().slice(0, 10),
};

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [policy, setPolicy] = useState(null);
  const [form, setForm] = useState(initialForm);

  const loadEmployees = async () => {
    try {
      setError("");
      const { data } = await api.get("/admin/employees");
      setEmployees(data.employees || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load employees.");
    }
  };

  useEffect(() => {
    loadEmployees();
    api
      .get("/admin/policy")
      .then(({ data }) => setPolicy(data.policy))
      .catch(() => {});
  }, []);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const openDialog = () => {
    setForm(initialForm);
    setError("");
    setSuccess("");
    setShowPassword(false);
    setOpen(true);
  };

  const closeDialog = () => {
    if (!saving) setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setSaving(true);
      const { data } = await api.post("/admin/employees", form);
      setEmployees((current) => [data.employee, ...current]);
      setSuccess("Employee added successfully.");
      setForm(initialForm);
      setOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add employee.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
      >
        <div>
          <Typography variant="h4">Employees</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Add employees and manage their login details and joining dates.
          </Typography>
          {policy && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Current policy: {policy.casualAnnual} Casual/year ·{" "}
              {policy.sickAnnual} Sick/year · {policy.earnedMonthly}{" "}
              Earned/month.
            </Typography>
          )}
        </div>
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={openDialog}
        >
          Add Employee
        </Button>
      </Stack>

      {success && <Alert severity="success">{success}</Alert>}
      {error && !open && <Alert severity="error">{error}</Alert>}

      <Card>
        <CardContent>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  {[
                    "Name",
                    "Email",
                    "Department",
                    "Joining Date",
                    "Leave Balance",
                    "Status",
                  ].map((heading) => (
                    <TableCell key={heading}>{heading}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee._id} hover>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.department || "General"}</TableCell>
                    <TableCell>
                      {employee.joiningDate
                        ? new Date(employee.joiningDate).toLocaleDateString(
                            "en-IN",
                          )
                        : "-"}
                    </TableCell>
                    <TableCell>
                      C {employee.leaveBalance?.casual ?? 0} · S{" "}
                      {employee.leaveBalance?.sick ?? 0} · E{" "}
                      {employee.leaveBalance?.earned ?? 0}
                    </TableCell>
                    <TableCell>
                      <Chip size="small" label="Active" color="success" />
                    </TableCell>
                  </TableRow>
                ))}
                {!employees.length && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                      No employees found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add Employee</DialogTitle>
          <DialogContent>
            <Stack spacing={2.2} sx={{ pt: 1 }}>
              {error && <Alert severity="error">{error}</Alert>}

              <TextField
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                fullWidth
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                fullWidth
              />

              <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                required
                fullWidth
                helperText="Minimum 6 characters"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((current) => !current)}
                        edge="end"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <VisibilityOffRoundedIcon />
                        ) : (
                          <VisibilityRoundedIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Joining Date"
                name="joiningDate"
                type="date"
                value={form.joiningDate}
                onChange={handleChange}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ max: new Date().toISOString().slice(0, 10) }}
                helperText="Earned leave is calculated from completed months since this date."
              />

              <FormControl fullWidth>
                <InputLabel id="department-label">Department</InputLabel>
                <Select
                  labelId="department-label"
                  label="Department"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                >
                  <MenuItem value="General">General</MenuItem>
                  <MenuItem value="Engineering">Engineering</MenuItem>
                  <MenuItem value="HR">HR</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                  <MenuItem value="Sales">Sales</MenuItem>
                  <MenuItem value="Operations">Operations</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={closeDialog} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? "Adding..." : "Add Employee"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Stack>
  );
}
