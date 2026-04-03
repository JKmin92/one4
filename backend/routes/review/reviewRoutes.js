import * as reviewCampaignController from "../../controllers/review/reviewCampaignController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import express from "express";

const router = express.Router();

router.get("/channel", reviewCampaignController.getReviewCampaignChannelView);
router.get("/category", reviewCampaignController.getReviewCategory);
router.get("/:campaign_code", reviewCampaignController.getReviewCampaign);
router.get("/list/:category_id", reviewCampaignController.getReviewCampaignList);

export default router;