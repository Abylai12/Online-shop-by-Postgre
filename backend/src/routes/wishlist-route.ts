import { Router } from "express";

import { protectRoute } from "../middleware/auth.middleware";
import { addToWishlist, getWishlist } from "../controllers/wishlist-controller";

const router = Router();

router.route("/").post(protectRoute, addToWishlist);
router.route("/").get(protectRoute, getWishlist);

export default router;
