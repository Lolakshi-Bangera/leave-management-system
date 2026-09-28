import React from "react";
import { useEffect, useState } from "react";
import {
  Alert,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import api from "../../services/api";

export default function LeaveBalance() {
  const [balance, setBalance] = useState({ casual: 0, sick: 0, earned: 0 });
  const [policy, setPolicy] = useState({
    casualAnnual: 12,
    sickAnnual: 8,
    earnedMonthly: 1,
    casualCarryForward: true,
    sickCarryForward: false,
    earnedCarryForward: true,
  });
  const [joiningDate, setJoiningDate] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/users/me")
      .then(({ data }) => {
        setBalance(data.user.leaveBalance || {});
        setPolicy(data.policy || policy);
        setJoiningDate(data.user.joiningDate);
      })
      .catch((err) =>
        setError(
          err.response?.data?.message || "Unable to load leave balance.",
        ),
      );
  }, []);

  const rows = [
    [
      "Casual Leave",
      "casual",
      Number(policy.casualAnnual || 0),
      policy.casualCarryForward,
    ],
    [
      "Sick Leave",
      "sick",
      Number(policy.sickAnnual || 0),
      policy.sickCarryForward,
    ],
    [
      "Earned Leave",
      "earned",
      Number(policy.earnedMonthly || 0),
      policy.earnedCarryForward,
    ],
  ];
  const totalLeft = Object.values(balance).reduce(
    (sum, value) => sum + Number(value || 0),
    0,
  );
  const annualReference =
    Number(policy.casualAnnual || 0) + Number(policy.sickAnnual || 0);

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Leave Balance</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Track your available leave and current company policy.
        </Typography>
      </div>
      {error && <Alert severity="error">{error}</Alert>}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardContent sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h2" color="primary">
                {totalLeft}
              </Typography>
              <Typography variant="h6">Days Available</Typography>
              {joiningDate && (
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  Joined {new Date(joiningDate).toLocaleDateString("en-IN")}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Leave Type Wise Balance
              </Typography>
              <Stack spacing={3}>
                {rows.map(([name, key, allowance, carryForward]) => {
                  const left = Number(balance[key] || 0);
                  const reference =
                    key === "earned"
                      ? Math.max(left, 1)
                      : Math.max(allowance, 1);
                  const percentage = Math.min((left / reference) * 100, 100);
                  return (
                    <div key={key}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography>{name}</Typography>
                        <Typography color="text.secondary">
                          {left} days
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{ mt: 1, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {key === "earned"
                          ? `${allowance} day${allowance === 1 ? "" : "s"} accrued per completed month`
                          : `${allowance} days allocated per year`}{" "}
                        · {carryForward ? "Carries forward" : "Expires yearly"}
                      </Typography>
                    </div>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6">Current Policy</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Casual: {policy.casualAnnual}/year · Sick: {policy.sickAnnual}/year
            · Earned: {policy.earnedMonthly}/month. Casual and Earned{" "}
            {policy.casualCarryForward && policy.earnedCarryForward
              ? "carry forward"
              : "follow the configured carry-forward rules"}
            ; Sick{" "}
            {policy.sickCarryForward
              ? "carries forward"
              : "expires at year-end"}
            .
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  );
}
