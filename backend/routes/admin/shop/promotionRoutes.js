import express from 'express';
import * as promotionController from '../../../controllers/admin/shop/promotionController.js';

const router = express.Router();

router.post('/', promotionController.createPromotion);
router.get('/', promotionController.getPromotions);
router.get('/:id', promotionController.getPromotionById);
router.put('/:id', promotionController.updatePromotion);

export default router;
