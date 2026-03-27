import * as reviewCampaignService from "../../services/review/reviewCampaignService.js";

export const getReviewCampaign = async (req, res, next) => {
    try {
        const { campaign_code } = req.params;
        const campaign = await reviewCampaignService.getReviewCampaign(campaign_code);
        res.status(200).json(campaign);
    } catch (error) {
        next(error);
    }
}