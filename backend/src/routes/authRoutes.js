import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { createToken } from "../utils/jwt.js";
import { getLeavePolicy, syncEmployeeLeaveBalance } from "../utils/leavePolicy.js";

const router = Router();
const safe = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
  department: u.department,
  joiningDate: u.joiningDate,
  leaveBalance: u.leaveBalance,
});

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, department } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: "Name, email and password are required" });
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ success: false, message: "Email already registered" });
    const u = await User.create({ name, email: email.toLowerCase(), password: await bcrypt.hash(password, 10), department: department || "General" });
    res.status(201).json({ success: true, token: createToken(u), user: safe(u) });
  } catch (e) { next(e); }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const u = await User.findOne({ email: email?.toLowerCase() });
    if (!u || !(await bcrypt.compare(password || "", u.password))) return res.status(401).json({ success: false, message: "Invalid email or password" });

    if (u.role === "employee") {
      const policy = await getLeavePolicy();
      if (await syncEmployeeLeaveBalance(u, policy)) await u.save();
    }

    res.json({ success: true, token: createToken(u), user: safe(u) });
  } catch (e) { next(e); }
});

export default router;
