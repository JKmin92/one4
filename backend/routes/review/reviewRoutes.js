import * as reviewCampaignController from "../../controllers/review/reviewCampaignController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import express from "express";

const router = express.Router();

router.get("/channel", reviewCampaignController.getReviewCampaignChannelView);
router.get("/category", reviewCampaignController.getReviewCategory);
router.get("/:campaign_code", reviewCampaignController.getReviewCampaign);
router.get("/list/:category_id", reviewCampaignController.getReviewCampaignList);

router.post("/application", authMiddleware, reviewCampaignController.insertReviewCampaignApplication);
router.get("/user/application", authMiddleware, reviewCampaignController.getUserReviewCampaignApplicationList);
router.get("/user/application/:campaign_application_code", authMiddleware, reviewCampaignController.getUserReviewCampaignApplication);

export default router;