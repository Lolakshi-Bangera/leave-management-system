import { Router } from "express";
import bcrypt from "bcryptjs";
import Leave from "../models/Leave.js";
import User from "../models/User.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { getLeavePolicy, syncEmployeeLeaveBalance, completedMonthsBetween } from "../utils/leavePolicy.js";

const router = Router();

router.get("/dashboard", protect, authorize("admin"), async (req, res, next) => {
  try {
    const [totalEmployees, pending, approved, rejected] = await Promise.all([
      User.countDocuments({ role: "employee" }),
      Leave.countDocuments({ status: "pending" }),
      Leave.countDocuments({ status: "approved" }),
      Leave.countDocuments({ status: "rejected" }),
    ]);
    res.json({ success: true, stats: { totalEmployees, pending, approved, rejected } });
  } catch (e) { next(e); }
});

router.get("/leaves", protect, authorize("admin"), async (req, res, next) => {
  try {
    const leaves = await Leave.find()
      .populate("employee", "name email department joiningDate")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, leaves });
  } catch (e) { next(e); }
});

router.patch("/leaves/:id/approve", protect, authorize("admin"), async (req, res, next) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ success: false, message: "Leave request not found" });
    if (leave.status !== "pending") return res.status(400).json({ success: false, message: "Only pending requests can be approved" });

    const employee = await User.findById(leave.employee);
    if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });

    const policy = await getLeavePolicy();
    await syncEmployeeLeaveBalance(employee, policy);
    const balance = employee.leaveBalance?.[leave.leaveType] ?? 0;
    if (balance < leave.days) return res.status(400).json({ success: false, message: "Employee has insufficient leave balance" });

    employee.leaveBalance[leave.leaveType] = balance - leave.days;
    await employee.save();

    leave.status = "approved";
    leave.reviewedBy = req.user._id;
    leave.reviewedOn = new Date();
    await leave.save();

    res.json({ success: true, message: "Leave approved successfully", leave });
  } catch (e) { next(e); }
});

router.patch("/leaves/:id/reject", protect, authorize("admin"), async (req, res, next) => {
  try {
    const { rejectionReason = "" } = req.body;
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ success: false, message: "Leave request not found" });
    if (leave.status !== "pending") return res.status(400).json({ success: false, message: "Only pending requests can be rejected" });
    leave.status = "rejected";
    leave.rejectionReason = rejectionReason;
    leave.reviewedBy = req.user._id;
    leave.reviewedOn = new Date();
    await leave.save();
    res.json({ success: true, message: "Leave rejected successfully", leave });
  } catch (e) { next(e); }
});

router.get("/policy", protect, authorize("admin"), async (req, res, next) => {
  try {
    const policy = await getLeavePolicy();
    res.json({ success: true, policy });
  } catch (e) { next(e); }
});

router.put("/policy", protect, authorize("admin"), async (req, res, next) => {
  try {
    const { casualAnnual, sickAnnual, earnedMonthly, casualCarryForward, sickCarryForward, earnedCarryForward } = req.body;
    const values = [casualAnnual, sickAnnual, earnedMonthly];
    if (values.some((value) => value === undefined || Number.isNaN(Number(value)) || Number(value) < 0)) {
      return res.status(400).json({ success: false, message: "Leave allowances must be valid non-negative numbers" });
    }

    const policy = await getLeavePolicy();
    policy.casualAnnual = Number(casualAnnual);
    policy.sickAnnual = Number(sickAnnual);
    policy.earnedMonthly = Number(earnedMonthly);
    policy.casualCarryForward = Boolean(casualCarryForward);
    policy.sickCarryForward = Boolean(sickCarryForward);
    policy.earnedCarryForward = Boolean(earnedCarryForward);
    await policy.save();

    res.json({ success: true, message: "Leave policy updated successfully", policy });
  } catch (e) { next(e); }
});

router.post("/employees", protect, authorize("admin"), async (req, res, next) => {
  try {
    const { name, email, password, department = "General", joiningDate } = req.body;
    if (!name?.trim() || !email?.trim() || !password || !joiningDate) {
      return res.status(400).json({ success: false, message: "Name, email, password and joining date are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const parsedJoiningDate = new Date(joiningDate);
    if (Number.isNaN(parsedJoiningDate.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid joining date" });
    }
    if (parsedJoiningDate > new Date()) {
      return res.status(400).json({ success: false, message: "Joining date cannot be in the future" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(409).json({ success: false, message: "An account with this email already exists" });

    const policy = await getLeavePolicy();
    const hashedPassword = await bcrypt.hash(password, 10);
    const employee = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "employee",
      department: department?.trim() || "General",
      joiningDate: parsedJoiningDate,
      leaveYear: parsedJoiningDate.getFullYear(),
      lastEarnedLeaveAccrualAt: parsedJoiningDate,
      leaveBalance: {
        casual: policy.casualAnnual,
        sick: policy.sickAnnual,
        earned: completedMonthsBetween(parsedJoiningDate, new Date()) * policy.earnedMonthly,
      },
    });
    await employee.save();

    const safeEmployee = employee.toObject();
    delete safeEmployee.password;
    res.status(201).json({ success: true, message: "Employee added successfully", employee: safeEmployee });
  } catch (e) { next(e); }
});

router.get("/employees", protect, authorize("admin"), async (req, res, next) => {
  try {
    const policy = await getLeavePolicy();
    const employees = await User.find({ role: "employee" }).sort({ name: 1 });
    for (const employee of employees) {
      if (await syncEmployeeLeaveBalance(employee, policy)) await employee.save();
    }
    const safeEmployees = employees.map((employee) => {
      const data = employee.toObject();
      delete data.password;
      return data;
    });
    res.json({ success: true, employees: safeEmployees });
  } catch (e) { next(e); }
});

export default router;
