import { Router } from "express";

import { protectRoute } from "../middleware/auth.middleware";
import {
  checkoutSuccess,
  createCheckoutSession,
} from "../controllers/payment-controller";

const router = Router();

router
  .route("/create-checkout-session")
  .post(protectRoute, createCheckoutSession);
router.route("/checkout-session").post(protectRoute, checkoutSuccess);

export default router;
