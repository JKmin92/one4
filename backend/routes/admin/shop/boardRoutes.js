import express from 'express';
import * as boardController from '../../../controllers/admin/shop/boardController.js';

const router = express.Router();

router.get('/product/review', boardController.getProductReviewList);
router.get('/product/inquiry', boardController.getProductInquiryList);
router.get('/product/review/:id', boardController.getProductReview);
router.get('/product/inquiry/:id', boardController.getProductInquiry);

export default router;
