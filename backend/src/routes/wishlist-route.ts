import { Router } from "express";

import { protectRoute } from "../middleware/auth.middleware";
import { addToWishlist } from "../controllers/wishlist-controller";

const router = Router();

router.route("/").post(protectRoute, addToWishlist);

export default router;
