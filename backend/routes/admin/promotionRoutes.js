import express from 'express';
import * as promotionController from '../../controllers/admin/promotionController.js';

const router = express.Router();

router.post('/', promotionController.createPromotion);
router.get('/', promotionController.getPromotions);
router.get('/:id', promotionController.getPromotionById);

export default router;
