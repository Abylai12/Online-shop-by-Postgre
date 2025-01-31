import { Router } from "express";

import { protectRoute } from "../middleware/auth.middleware";
import {
  addToCart,
  getCartProducts,
  removeFromCart,
  updateQuantity,
} from "../controllers/cart-controller";

const router = Router();

router.route("/").get(protectRoute, getCartProducts);
router.route("/").post(protectRoute, addToCart);
router.route("/").delete(protectRoute, removeFromCart);
router.route("/").put(protectRoute, updateQuantity);

export default router;
