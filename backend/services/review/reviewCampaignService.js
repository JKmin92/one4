import * as reviewCampaignModel from "../../models/review/reviewCampaignModel.js";

export const getReviewCampaign = async (campaign_code) => {
    return await reviewCampaignModel.getReviewCampaign(campaign_code);
}

export const getReviewCampaignChannelView = async () => {
    return await reviewCampaignModel.getReviewCampaignChannelView();
}

export const getReviewCategory = async () => {
    return await reviewCampaignModel.getReviewCategory();
}

export const getReviewCampaignList = async (category_id) => {
    return await reviewCampaignModel.getReviewCampaignList(category_id);
}