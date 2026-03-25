import express from 'express';
import multer from 'multer';
import * as reviewCampaignController from '../../../controllers/admin/review/reviewCampaignController.js';
import { authMiddleware } from "../../../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', authMiddleware, upload.fields([{ name: 'mainImage', maxCount: 1 }]), reviewCampaignController.insertReviewCampaign);
router.get('/category', reviewCampaignController.getReviewCampaignCategory);
router.get('/channel', reviewCampaignController.getReviewCampaignChannelView);
router.get('', reviewCampaignController.getReviewCampaignList);

export default router;
