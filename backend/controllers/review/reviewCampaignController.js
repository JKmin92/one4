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

export const getReviewCampaignChannelView = async (req, res, next) => {
    try {
        const channels = await reviewCampaignService.getReviewCampaignChannelView();
        res.status(200).json(channels);
    } catch (error) {
        next(error);
    }
}

export const getReviewCategory = async (req, res, next) => {
    try {
        const categories = await reviewCampaignService.getReviewCategory();
        res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
}

export const getReviewCampaignList = async (req, res, next) => {
    try {
        const { category_id } = req.params;
        const campaigns = await reviewCampaignService.getReviewCampaignList(category_id);
        res.status(200).json(campaigns);
    } catch (error) {
        next(error);
    }
}