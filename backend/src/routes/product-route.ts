import { Router } from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getCurrentProduct,
  getFeaturedProducts,
  getProductsByCategory,
  getRecommendedProducts,
  toggleFeaturedProduct,
} from "../controllers/product-controller";

const router = Router();

router.route("/").get(protectRoute, getAllProducts);
router.route("/featured").get(getFeaturedProducts);
router.route("/featured/user").get(protectRoute, getFeaturedProducts);

router.route("/category/:category").get(getProductsByCategory);
router.route("/recommendations").get(getRecommendedProducts);
router.route("/").post(protectRoute, createProduct);
router.route("/:id").patch(protectRoute, toggleFeaturedProduct);
router.route("/:id").delete(protectRoute, deleteProduct);
router.route("/:id").get(getCurrentProduct);

export default router;
