import express from 'express';
import * as orderController from "../../../controllers/admin/shop/orderController.js";

const router = express.Router();

router.post('/delivery', orderController.insertProductOrderDelivery);
router.get('/list/:status', orderController.getOrderList);
router.get('/:order_code', orderController.getOrder);

export default router;