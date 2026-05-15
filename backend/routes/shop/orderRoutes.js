import express from "express";
import * as orderController from "../../controllers/shop/orderController.js";
import multer from "multer";
import { authMiddleware } from "../../middleware/authMiddleware.js"

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', authMiddleware, orderController.insertProductOrder);
router.get('/:order_code', authMiddleware, orderController.getProductOrder);

export default router;