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
router.get("/application/:campaign_code", authMiddleware, reviewCampaignController.isReviewCampaignApplication);
router.get("/user/address/:address_code", authMiddleware, reviewCampaignController.getUserAddress);

router.get("/user/application/delivery/:campaign_application_code", authMiddleware, reviewCampaignController.getReviewCampaignApplicationDelivery);

router.post("/application/post", authMiddleware, reviewCampaignController.insertReviewCampaignPost);
router.put("/application/post", authMiddleware, reviewCampaignController.updateReviewCampaignPost);
router.get("/application/post/:campaign_application_code", authMiddleware, reviewCampaignController.getReviewCampaignPost);

export default router;