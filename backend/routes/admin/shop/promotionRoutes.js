import express from 'express';
import * as promotionController from '../../../controllers/admin/shop/promotionController.js';

const router = express.Router();

router.post('/', promotionController.createPromotion);
router.get('/', promotionController.getPromotions);
router.get('/:product_promotion_code', promotionController.getPromotion);
router.put('/:product_promotion_code', promotionController.updatePromotion);

export default router;
