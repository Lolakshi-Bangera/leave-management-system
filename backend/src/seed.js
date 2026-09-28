import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import LeavePolicy from "./models/LeavePolicy.js";

await mongoose.connect(process.env.MONGODB_URI);

await LeavePolicy.findOneAndUpdate(
  { key: "default" },
  {
    $set: {
      casualAnnual: 12,
      sickAnnual: 8,
      earnedMonthly: 1,
      casualCarryForward: true,
      sickCarryForward: false,
      earnedCarryForward: true,
    },
    $setOnInsert: { key: "default" },
  },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);

await User.findOneAndUpdate(
  { email: "admin@leaveapp.com" },
  { name: "Admin User", email: "admin@leaveapp.com", password: await bcrypt.hash("Admin@123", 10), role: "admin", department: "HR" },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);

const johnJoiningDate = new Date("2026-01-01T00:00:00.000Z");
await User.findOneAndUpdate(
  { email: "john@leaveapp.com" },
  {
    name: "John Doe",
    email: "john@leaveapp.com",
    password: await bcrypt.hash("Employee@123", 10),
    role: "employee",
    department: "Engineering",
    joiningDate: johnJoiningDate,
    leaveYear: 2026,
    lastEarnedLeaveAccrualAt: johnJoiningDate,
    leaveBalance: { casual: 12, sick: 8, earned: 0 },
  },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);

console.log("Seed complete.");
console.log("Admin: admin@leaveapp.com / Admin@123");
console.log("Employee: john@leaveapp.com / Employee@123");
console.log("Policy: Casual 12/year, Sick 8/year, Earned 1/month; Casual + Earned carry forward.");
await mongoose.disconnect();
