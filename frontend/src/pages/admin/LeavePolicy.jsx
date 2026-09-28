import React from "react";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import api from "../../services/api";

const defaults = {
  casualAnnual: 12,
  sickAnnual: 8,
  earnedMonthly: 1,
  casualCarryForward: true,
  sickCarryForward: false,
  earnedCarryForward: true,
};

export default function LeavePolicy() {
  const [form, setForm] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    api
      .get("/admin/policy")
      .then(({ data }) => setForm({ ...defaults, ...data.policy }))
      .catch((err) =>
        setError(err.response?.data?.message || "Unable to load leave policy."),
      )
      .finally(() => setLoading(false));
  }, []);

  const change = (name, value) =>
    setForm((current) => ({ ...current, [name]: value }));

  const save = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    try {
      setSaving(true);
      await api.put("/admin/policy", {
        ...form,
        casualAnnual: Number(form.casualAnnual),
        sickAnnual: Number(form.sickAnnual),
        earnedMonthly: Number(form.earnedMonthly),
      });
      setSuccess("Leave policy updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update leave policy.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Leave Policy</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Configure annual leave allowances, monthly earned leave and
          carry-forward rules.
        </Typography>
      </div>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <Card>
        <CardContent component="form" onSubmit={save} sx={{ p: 4 }}>
          <Stack spacing={3}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Casual Leave / Year"
                  value={form.casualAnnual}
                  onChange={(e) => change("casualAnnual", e.target.value)}
                  inputProps={{ min: 0, step: 1 }}
                  disabled={loading}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Sick Leave / Year"
                  value={form.sickAnnual}
                  onChange={(e) => change("sickAnnual", e.target.value)}
                  inputProps={{ min: 0, step: 1 }}
                  disabled={loading}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Earned Leave / Month"
                  value={form.earnedMonthly}
                  onChange={(e) => change("earnedMonthly", e.target.value)}
                  inputProps={{ min: 0, step: 0.5 }}
                  disabled={loading}
                />
              </Grid>
            </Grid>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Carry Forward
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={Boolean(form.casualCarryForward)}
                        onChange={(e) =>
                          change("casualCarryForward", e.target.checked)
                        }
                      />
                    }
                    label="Casual Leave"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={Boolean(form.sickCarryForward)}
                        onChange={(e) =>
                          change("sickCarryForward", e.target.checked)
                        }
                      />
                    }
                    label="Sick Leave"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={Boolean(form.earnedCarryForward)}
                        onChange={(e) =>
                          change("earnedCarryForward", e.target.checked)
                        }
                      />
                    }
                    label="Earned Leave"
                  />
                </Stack>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Current recommended setup: Casual and Earned carry forward;
                  Sick expires at the end of the leave year.
                </Typography>
              </CardContent>
            </Card>

            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveRoundedIcon />}
              disabled={saving || loading}
              sx={{ alignSelf: "flex-start" }}
            >
              {saving ? "Saving..." : "Save Policy"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
