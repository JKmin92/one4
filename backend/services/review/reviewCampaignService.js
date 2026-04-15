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

export const insertReviewCampaignApplication = async (data) => {
    return await reviewCampaignModel.insertReviewCampaignApplication(data);
}

export const insertReviewCampaignApplicationRewardOption = async (data) => {
    return await reviewCampaignModel.insertReviewCampaignApplicationRewardOption(data);
}

export const insertReviewCampaignApplicationChannel = async (data) => {
    return await reviewCampaignModel.insertReviewCampaignApplicationChannel(data);
}

export const insertUserAddress = async (user_address) => {
    const address_code = generateUniqueId();
    return await reviewCampaignModel.insertUserAddress({ ...user_address, address_code: address_code });
}

export const getUserReviewCampaignApplicationList = async (user_code) => {
    return await reviewCampaignModel.getUserReviewCampaignApplicationList(user_code);
}

export const getUserReviewCampaignApplication = async (campaign_application_code, user_code) => {
    return await reviewCampaignModel.getUserReviewCampaignApplication(campaign_application_code, user_code);
}