import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#2563EB" },
    secondary: { main: "#64748B" },
    success: { main: "#16A34A" },
    warning: { main: "#F59E0B" },
    error: { main: "#DC2626" },
    background: { default: "#F8FAFC", paper: "#FFFFFF" },
    text: { primary: "#0F172A", secondary: "#64748B" }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 }
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", borderRadius: 9, fontWeight: 600 }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: { boxShadow: "0 2px 12px rgba(15, 23, 42, 0.05)", border: "1px solid #E2E8F0" }
      }
    }
  }
});

export default theme;