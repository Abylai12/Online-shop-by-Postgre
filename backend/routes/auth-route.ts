import { Router } from "express";
import { login, logout, signup } from "../controllers/auth-controller";
import { protectRoute } from "../middleware/auth.middleware";

const router = Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);

export default router;
