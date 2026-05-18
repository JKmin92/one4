import express from 'express';
import * as orderController from "../../../controllers/admin/shop/orderController.js";

const router = express.Router();

router.get('/:status', orderController.getOrderList);

export default router;