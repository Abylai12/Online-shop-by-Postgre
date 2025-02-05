import { Router } from "express";

import { protectRoute } from "../middleware/auth.middleware";
import {
  getCoupon,
  unValidateCoupon,
  validateCoupon,
} from "../controllers/coupon-controller";

const router = Router();

router.route("/").get(protectRoute, getCoupon);
router.route("/validate").post(protectRoute, validateCoupon);
router.route("/unvalidate").post(protectRoute, unValidateCoupon);

export default router;
