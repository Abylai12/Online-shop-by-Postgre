import { Router } from "express";

import { protectRoute } from "../middleware/auth.middleware";
import {
  createCategory,
  getCategories,
} from "../controllers/category-controller";

const router = Router();

router.route("/").post(protectRoute, createCategory);
router.route("/").get(protectRoute, getCategories);

export default router;
