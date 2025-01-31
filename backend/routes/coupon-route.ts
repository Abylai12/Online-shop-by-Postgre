import { Router } from "express";

import { protectRoute } from "../middleware/auth.middleware";
import { getCoupon, validateCoupon } from "../controllers/coupon-controller";

const router = Router();

router.route("/").get(protectRoute, getCoupon);
router.route("/validate").post(protectRoute, validateCoupon);

export default router;
