import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getLeavePolicy, syncEmployeeLeaveBalance } from "../utils/leavePolicy.js";

const router = Router();

router.get("/me", protect, async (req, res, next) => {
  try {
    const user = req.user;
    const policy = await getLeavePolicy();
    const changed = await syncEmployeeLeaveBalance(user, policy);
    if (changed) await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        joiningDate: user.joiningDate,
        leaveBalance: user.leaveBalance,
      },
      policy: {
        casualAnnual: policy.casualAnnual,
        sickAnnual: policy.sickAnnual,
        earnedMonthly: policy.earnedMonthly,
        casualCarryForward: policy.casualCarryForward,
        sickCarryForward: policy.sickCarryForward,
        earnedCarryForward: policy.earnedCarryForward,
      },
    });
  } catch (e) { next(e); }
});

export default router;
