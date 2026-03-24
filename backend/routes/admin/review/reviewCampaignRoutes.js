import express from 'express';
import multer from 'multer';
import * as reviewCampaignController from '../../../controllers/admin/review/reviewCampaignController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.fields([{ name: 'mainImage', maxCount: 1 }]), reviewCampaignController.insertReviewCampaign);
router.get('/category', reviewCampaignController.getReviewCampaignCategory);
router.get('/channel', reviewCampaignController.getReviewCampaignChannelView);

export default router;
