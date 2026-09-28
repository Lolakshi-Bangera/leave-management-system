import mongoose from "mongoose";

const schema = new mongoose.Schema({
  key: { type: String, unique: true, default: "default" },
  casualAnnual: { type: Number, default: 12, min: 0 },
  sickAnnual: { type: Number, default: 8, min: 0 },
  earnedMonthly: { type: Number, default: 1, min: 0 },
  casualCarryForward: { type: Boolean, default: true },
  sickCarryForward: { type: Boolean, default: false },
  earnedCarryForward: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("LeavePolicy", schema);
