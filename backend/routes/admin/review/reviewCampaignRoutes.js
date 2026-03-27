import express from 'express';
import multer from 'multer';
import * as reviewCampaignController from '../../../controllers/admin/review/reviewCampaignController.js';
import { authMiddleware } from "../../../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', authMiddleware, upload.fields([{ name: 'mainImage', maxCount: 1 }, { name: 'detailImages', maxCount: 10 }]), reviewCampaignController.insertReviewCampaign);
router.post('/upload-image', upload.single('image'), reviewCampaignController.uploadEditorImage);
router.get('/category', reviewCampaignController.getReviewCampaignCategory);
router.get('/channel', reviewCampaignController.getReviewCampaignChannelView);
router.get('', reviewCampaignController.getReviewCampaignList);
router.get('/drafts', reviewCampaignController.getDraftReviewCampaigns);
router.get('/:id', reviewCampaignController.getReviewCampaign);
router.post('/:id', authMiddleware, upload.fields([{ name: 'mainImage', maxCount: 1 }, { name: 'detailImages', maxCount: 10 }]), reviewCampaignController.updateReviewCampaign);

export default router;
