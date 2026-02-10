import express from "express";
import * as ProductController from "../../controllers/shop/productController.js";

const router = express.Router();

router.get("/category", ProductController.getCategories);
router.get("/category/:id", ProductController.getCategoryById);
router.get("/subCategory/:id", ProductController.getSubCategoryById);
router.get("/list/:id", ProductController.getProductsByCategoryId);

export default router;