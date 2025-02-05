import { Router } from "express";

import { protectRoute } from "../middleware/auth.middleware";
import {
  addToCart,
  getCartProducts,
  removeAllFromCart,
  removeFromCart,
  updateQuantity,
} from "../controllers/cart-controller";

const router = Router();

router.route("/").get(protectRoute, getCartProducts);
router.route("/").post(protectRoute, addToCart);
router.route("/").delete(protectRoute, removeFromCart);
router.route("/remove-all").delete(protectRoute, removeAllFromCart);
router.route("/").put(protectRoute, updateQuantity);

export default router;
