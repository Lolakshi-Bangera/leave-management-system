import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LockRounded,
  MailOutlineRounded,
  VisibilityRounded,
  VisibilityOffRounded,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setSubmitting(true);
      const user = await login(email, password);
      navigate(
        user.role === "admin" ? "/admin/dashboard" : "/employee/dashboard",
        { replace: true },
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to login. Please check your credentials.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        bgcolor: "#F8FAFC",
      }}
    >
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          p: 7,
          bgcolor: "#2563EB",
          color: "white",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ maxWidth: 460 }}>
          <Typography variant="h2" fontWeight={800} sx={{ lineHeight: 1.05 }}>
            Leave
            <br />
            Management
          </Typography>
          <Typography
            variant="h6"
            sx={{ mt: 3, opacity: 0.9, fontWeight: 400 }}
          >
            Manage employee leave requests simply and efficiently.
          </Typography>
          <Box sx={{ mt: 7, fontSize: 100, opacity: 0.35 }}>▣</Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 430,
            p: { xs: 3, md: 5 },
            border: "1px solid #E2E8F0",
            borderRadius: 3,
          }}
        >
          <Typography variant="h4">Welcome Back</Typography>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 4 }}>
            Login to your account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Stack component="form" onSubmit={handleSubmit} spacing={2.2}>
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineRounded />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockRounded />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOffRounded />
                      ) : (
                        <VisibilityRounded />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={submitting}
              sx={{ py: 1.5, mt: 1 }}
            >
              {submitting ? "Signing in..." : "Login"}
            </Button>
          </Stack>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 3 }}
          >
            Demo accounts: <b>admin@leaveapp.com / Admin@123</b> or{" "}
            <b>john@leaveapp.com / Employee@123</b>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
