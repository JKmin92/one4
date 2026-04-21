import * as reviewCampaignModel from "../../models/review/reviewCampaignModel.js";
import { generateUniqueId } from "../../utils/customUtils.js";
import { fetchMetadataFromUrl } from "../../utils/metadataUtils.js";

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

export const updateUserReviewChannel = async (review_channel_code) => {
    const user_review_channel = await reviewCampaignModel.getUserReviewChannel(review_channel_code);

    try {
        const metaData = await fetchMetadataFromUrl(user_review_channel.channel_url);
        user_review_channel.meta_title = metaData.title;
        user_review_channel.meta_description = metaData.description;
        user_review_channel.meta_image = metaData.image;
        if (metaData.url) {
            user_review_channel.channel_url = metaData.url;
        }
    } catch (error) {
        console.error('Failed to update metadata for review channel:', error.message);
    }

    return await reviewCampaignModel.updateUserReviewChannel(user_review_channel);
}

export const isReviewCampaignApplication = async (campaign_code, user_code) => {
    return await reviewCampaignModel.isReviewCampaignApplication(campaign_code, user_code);
}

export const getUserAddress = async (address_code, user_code) => {
    return await reviewCampaignModel.getUserAddress(address_code, user_code);
}

export const getReviewCampaignApplicationDelivery = async (campaign_application_code, user_code) => {
    return await reviewCampaignModel.getReviewCampaignApplicationDelivery(campaign_application_code, user_code);
}

export const insertReviewCampaignPost = async (data) => {
    const campaign_post_code = generateUniqueId();
    const result = await reviewCampaignModel.insertReviewCampaignPost({ ...data, campaign_post_code: campaign_post_code });
    await reviewCampaignModel.submitReviewCampaignApplicationStatus(data.campaign_application_code, data.user_code);
    return result;
}

export const updateReviewCampaignPost = async (data) => {
    return await reviewCampaignModel.updateReviewCampaignPost(data);
}

export const getReviewCampaignPost = async (campaign_application_code, user_code) => {
    return await reviewCampaignModel.getReviewCampaignPost(campaign_application_code, user_code);
}

export const getReviewCampaignPostByCampaignPostCode = async (campaign_post_code) => {
    return await reviewCampaignModel.getReviewCampaignPostByCampaignPostCode(campaign_post_code);
}

export const getReviewCampaignFeedbackList = async (campaign_application_code, user_code) => {
    return await reviewCampaignModel.getReviewCampaignFeedbackList(campaign_application_code, user_code);
}