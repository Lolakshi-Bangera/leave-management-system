import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import EmployeeLayout from "./layouts/EmployeeLayout";
import AdminLayout from "./layouts/AdminLayout";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import ApplyLeave from "./pages/employee/ApplyLeave";
import LeaveHistory from "./pages/employee/LeaveHistory";
import LeaveBalance from "./pages/employee/LeaveBalance";
import AdminDashboard from "./pages/admin/AdminDashboard";
import LeaveRequests from "./pages/admin/LeaveRequests";
import Employees from "./pages/admin/Employees";
import LeavePolicy from "./pages/admin/LeavePolicy";
import ProtectedRoute from "./components/common/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute role="employee" />}>
        <Route element={<EmployeeLayout />}>
          <Route
            path="/employee"
            element={<Navigate to="/employee/dashboard" replace />}
          />
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/employee/apply-leave" element={<ApplyLeave />} />
          <Route path="/employee/history" element={<LeaveHistory />} />
          <Route path="/employee/balance" element={<LeaveBalance />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="admin" />}>
        <Route element={<AdminLayout />}>
          <Route
            path="/admin"
            element={<Navigate to="/admin/dashboard" replace />}
          />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/requests" element={<LeaveRequests />} />
          <Route path="/admin/employees" element={<Employees />} />
          <Route path="/admin/policy" element={<LeavePolicy />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
