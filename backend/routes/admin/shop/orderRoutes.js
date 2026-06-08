import express from 'express';
import * as orderController from "../../../controllers/admin/shop/orderController.js";

const router = express.Router();

router.post('/delivery', orderController.insertProductOrderDelivery);
router.get('/list/:status', orderController.getOrderList);
router.get('/:order_code', orderController.getOrder);
router.put('/status', orderController.updateOrderStatus);
router.get('/claim/:type', orderController.getProductOrderClaimByType);
router.put('/claim/processing', orderController.updateProductOrderClaimProcessing);
router.put('/claims/processing', orderController.updateProductOrderClaimsProcessing);
router.put('/claim/detailStatus', orderController.updateProductOrderClaimDetailStatus);
router.put('/claims/rejected', orderController.updateProductOrderClaimsRejected);
router.put('/claim/refund', orderController.updateProductOrderClaimRefund);

export default router;