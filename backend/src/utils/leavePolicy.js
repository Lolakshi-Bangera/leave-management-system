import LeavePolicy from "../models/LeavePolicy.js";

export function completedMonthsBetween(start, end = new Date()) {
  const from = new Date(start);
  const to = new Date(end);
  let months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
  if (to.getDate() < from.getDate()) months -= 1;
  return Math.max(0, months);
}

function addMonths(date, months) {
  const d = new Date(date);
  const originalDay = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + months);
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(originalDay, lastDay));
  return d;
}

export async function getLeavePolicy() {
  return LeavePolicy.findOneAndUpdate(
    { key: "default" },
    { $setOnInsert: { key: "default" } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

export async function syncEmployeeLeaveBalance(user, policy = null) {
  const currentPolicy = policy || await getLeavePolicy();
  const now = new Date();
  const currentYear = now.getFullYear();
  let changed = false;

  if (!user.joiningDate) {
    user.joiningDate = user.createdAt || now;
    changed = true;
  }

  if (!user.lastEarnedLeaveAccrualAt) {
    user.lastEarnedLeaveAccrualAt = user.joiningDate;
    changed = true;
  }

  if (!user.leaveYear) {
    user.leaveYear = new Date(user.joiningDate).getFullYear();
    changed = true;
  }

  if (!user.leaveBalance) {
    user.leaveBalance = {};
    changed = true;
  }

  user.leaveBalance.casual = Number(user.leaveBalance.casual ?? currentPolicy.casualAnnual);
  user.leaveBalance.sick = Number(user.leaveBalance.sick ?? currentPolicy.sickAnnual);
  user.leaveBalance.earned = Number(user.leaveBalance.earned ?? 0);

  // Annual policy refresh. Casual carries forward; sick does not by default.
  if (user.leaveYear < currentYear) {
    const yearsPassed = currentYear - user.leaveYear;
    if (currentPolicy.casualCarryForward) {
      user.leaveBalance.casual += currentPolicy.casualAnnual * yearsPassed;
    } else {
      user.leaveBalance.casual = currentPolicy.casualAnnual;
    }

    // Sick leave expires at year-end when carry forward is disabled.
    user.leaveBalance.sick = currentPolicy.sickCarryForward
      ? user.leaveBalance.sick + currentPolicy.sickAnnual * yearsPassed
      : currentPolicy.sickAnnual;

    user.leaveYear = currentYear;
    changed = true;
  }

  // Earned leave accrues once for every completed month since the last accrual.
  const months = completedMonthsBetween(user.lastEarnedLeaveAccrualAt, now);
  if (months > 0) {
    user.leaveBalance.earned += months * currentPolicy.earnedMonthly;
    user.lastEarnedLeaveAccrualAt = addMonths(user.lastEarnedLeaveAccrualAt, months);
    changed = true;
  }

  return changed;
}
