import express from "express";
import * as boardController from "../../controllers/shop/boardController.js";
import multer from "multer";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/product/review/:id", authMiddleware, upload.array('images', 10), boardController.insertProductReview);
router.get("/product/review/:id", boardController.getReviewsByProductId);
router.get("/product/review/edit/:id", authMiddleware, boardController.getReviewById);
router.put("/product/review/:id", authMiddleware, upload.array('images', 10), boardController.updateProductReview);
router.delete("/product/review/:id", authMiddleware, boardController.deleteProductReview);

router.post("/product/inquiry/:id", authMiddleware, upload.array('images', 10), boardController.insertProductInquiry);
router.get("/product/inquiry/:id", boardController.getProductInquiryByProductId);
router.get("/product/inquiry/edit/:id", authMiddleware, boardController.getProductInquiryById);
router.put("/product/inquiry/:id", authMiddleware, upload.array('images', 10), boardController.updateProductInquiry);
router.delete("/product/inquiry/:id", authMiddleware, boardController.deleteProductInquiry);

export default router;