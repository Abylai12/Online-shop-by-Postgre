import { Router } from "express";
import {
  getProfile,
  login,
  logout,
  refreshToken,
  signup,
} from "../controllers/auth-controller";
import { protectRoute } from "../middleware/auth.middleware";

const router = Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/refresh-token").post(refreshToken);
router.route("/profile").get(protectRoute, getProfile);

export default router;
