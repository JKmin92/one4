import express from 'express';
import * as boardController from '../../../controllers/admin/shop/boardController.js';

const router = express.Router();

router.get('/product/review', boardController.getProductReviewList);

export default router;
