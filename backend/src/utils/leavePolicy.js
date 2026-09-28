import Leave from "../models/Leave.js";
import LeavePolicy from "../models/LeavePolicy.js";

export function completedMonthsBetween(start, end = new Date()) {
  const from = new Date(start);
  const to = new Date(end);

  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || to < from) {
    return 0;
  }

  let months =
    (to.getFullYear() - from.getFullYear()) * 12 +
    (to.getMonth() - from.getMonth());

  // Only count a month after the employee reaches
  // the same day of the month as the joining date.
  if (to.getDate() < from.getDate()) {
    months -= 1;
  }

  return Math.max(0, months);
}

export async function getLeavePolicy() {
  return LeavePolicy.findOneAndUpdate(
    { key: "default" },
    { $setOnInsert: { key: "default" } },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    },
  );
}

export async function syncEmployeeLeaveBalance(user, policy = null) {
  const currentPolicy = policy || (await getLeavePolicy());

  const now = new Date();
  const currentYear = now.getFullYear();

  let changed = false;

  // Make sure joining date exists
  if (!user.joiningDate) {
    user.joiningDate = user.createdAt || now;
    changed = true;
  }

  // Make sure leave year exists
  if (!user.leaveYear) {
    user.leaveYear = new Date(user.joiningDate).getFullYear();

    changed = true;
  }

  if (!user.leaveBalance) {
    user.leaveBalance = {};
    changed = true;
  }

  user.leaveBalance.casual = Number(
    user.leaveBalance.casual ?? currentPolicy.casualAnnual,
  );

  user.leaveBalance.sick = Number(
    user.leaveBalance.sick ?? currentPolicy.sickAnnual,
  );

  user.leaveBalance.earned = Number(user.leaveBalance.earned ?? 0);

  // ---------------------------------------
  // CASUAL & SICK YEARLY RESET
  // ---------------------------------------

  if (user.leaveYear < currentYear) {
    const yearsPassed = currentYear - user.leaveYear;

    // Casual Leave
    if (currentPolicy.casualCarryForward) {
      user.leaveBalance.casual += currentPolicy.casualAnnual * yearsPassed;
    } else {
      user.leaveBalance.casual = currentPolicy.casualAnnual;
    }

    // Sick Leave
    if (currentPolicy.sickCarryForward) {
      user.leaveBalance.sick += currentPolicy.sickAnnual * yearsPassed;
    } else {
      user.leaveBalance.sick = currentPolicy.sickAnnual;
    }

    user.leaveYear = currentYear;

    changed = true;
  }

  // ---------------------------------------
  // EARNED LEAVE
  // ---------------------------------------
  //
  // IMPORTANT:
  // Earned leave is calculated from the
  // employee's joining date.
  //
  // It is NOT incremented every time an API
  // is called.
  //
  // Example:
  //
  // Joining Date: 01 June
  // Today:        28 September
  //
  // Completed months = 3
  // Earned = 3 × monthly accrual
  //
  // ---------------------------------------

  const completedMonths = completedMonthsBetween(user.joiningDate, now);

  const earnedEntitlement =
    completedMonths * Number(currentPolicy.earnedMonthly || 0);

  // Find earned leave already consumed
  const approvedEarnedLeave = await Leave.aggregate([
    {
      $match: {
        employee: user._id,
        leaveType: "earned",
        status: "approved",
      },
    },
    {
      $group: {
        _id: null,
        totalDays: {
          $sum: "$days",
        },
      },
    },
  ]);

  const earnedLeaveUsed = Number(approvedEarnedLeave[0]?.totalDays || 0);

  // Current available earned leave
  const calculatedEarnedBalance = Math.max(
    0,
    earnedEntitlement - earnedLeaveUsed,
  );

  if (Number(user.leaveBalance.earned) !== calculatedEarnedBalance) {
    user.leaveBalance.earned = calculatedEarnedBalance;

    changed = true;
  }

  return changed;
}
