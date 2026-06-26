import express from "express";
import * as ProductController from "../../controllers/shop/productController.js";
import { authMiddleware, optionalAuthMiddleware } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get("/category", ProductController.getCategories);
router.get("/category/:id", ProductController.getCategoryById);
router.get("/subCategory/:id", ProductController.getSubCategoryById);
router.get("/list/:id", ProductController.getProductsByCategoryCode);

router.post("/basket", authMiddleware, ProductController.createProductOrderBasket);
router.get("/basket", authMiddleware, ProductController.getProductOrderBasket);
router.get("/basket/count", authMiddleware, ProductController.getProductOrderBasketCount);
router.put("/basket", authMiddleware, ProductController.changeProductOrderBasketQuantity);
router.delete("/basket/:id", authMiddleware, ProductController.deleteProductOrderBasket);

router.post("/order/product", authMiddleware, ProductController.getOrderProduct);
router.post("/order/basket", authMiddleware, ProductController.getBasketProductInfo);

router.post("/action", optionalAuthMiddleware, ProductController.recordProductAction);
router.post("/recent/sync", authMiddleware, ProductController.syncRecentProducts);
router.get("/recent", authMiddleware, ProductController.getRecentProducts);

router.get("/:id", ProductController.getProductById);

export default router;