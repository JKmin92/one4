import * as reviewCampaignModel from "../../models/review/reviewCampaignModel.js";

export const getReviewCampaign = async (campaign_code) => {
    return await reviewCampaignModel.getReviewCampaign(campaign_code);
}