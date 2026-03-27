import * as reviewCampaignController from "../../controllers/review/reviewCampaignController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import express from "express";

const router = express.Router();

router.get("/:campaign_code", reviewCampaignController.getReviewCampaign);

export default router;