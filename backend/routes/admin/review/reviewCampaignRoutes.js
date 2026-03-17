import express from 'express';
import * as reviewCampaignController from '../../../controllers/admin/review/reviewCampaignController.js';

const router = express.Router();

router.get('/category', reviewCampaignController.getReviewCampaignCategory);

export default router;
