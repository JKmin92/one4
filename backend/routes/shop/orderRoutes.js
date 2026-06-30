import express from "express";
import * as orderController from "../../controllers/shop/orderController.js";
import multer from "multer";
import { authMiddleware } from "../../middleware/authMiddleware.js"

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', authMiddleware, orderController.insertProductOrder);
router.get('/list', authMiddleware, orderController.getUserProductOrder);
router.get('/account', authMiddleware, orderController.getShopAccountList);
router.get('/delivery/setting', authMiddleware, orderController.getShopDeliverySetting);
router.get('/:order_code', authMiddleware, orderController.getProductOrder);
router.patch('/:order_code/completed', authMiddleware, orderController.updateOrderCompleted);
router.put('/:order_code/address', authMiddleware, orderController.updateOrderAddress);
router.put('/:order_code/deposit-name', authMiddleware, orderController.updateDepositName);
router.post('/claim', authMiddleware, orderController.insertProductOrderClaim);

export default router;