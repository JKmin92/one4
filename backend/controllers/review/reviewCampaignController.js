import * as reviewCampaignService from "../../services/review/reviewCampaignService.js";
import { generateUniqueId } from "../../utils/customUtils.js";

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

export const insertReviewCampaignApplication = async (req, res, next) => {
    try {
        const { campaign_code, user_code } = req.body;
        let { address_code } = req.body; // const 대신 let을 사용하여 재할당 가능하게 선언
        const campaign_application_code = generateUniqueId();
        const user = req.user;

        if (!address_code && req.body.postcode) {
            const name = user.name;
            const phone = user.phone; // user.name에서 user.phone으로 오타 수정
            const address = req.body.address; // 프론트엔드에서 보낸 address 사용
            const detailAddress = req.body.detailAddress; // 프론트엔드에서 보낸 detailAddress 사용
            const postcode = req.body.postcode; // 프론트엔드에서 보낸 postcode 사용
            const isDefault = 0;

            address_code = await reviewCampaignService.insertUserAddress({ user_code, name, phone, address, detailAddress, postcode, isDefault });
        }

        await reviewCampaignService.insertReviewCampaignApplication({ campaign_code, user_code, address_code, campaign_application_code });

        const reward_options = req.body.options || []; // 프론트엔드에서 options로 보냄
        for (let i = 0; i < reward_options.length; i++) {
            await reviewCampaignService.insertReviewCampaignApplicationRewardOption({ campaign_application_code: campaign_application_code, ...reward_options[i] });
        }

        const channels = req.body.channels || []; // 프론트엔드에서 channel_code 문자열 배열로 보냄
        for (let i = 0; i < channels.length; i++) {
            if (channels[i].review_channel_code) {
                await reviewCampaignService.updateUserReviewChannel(channels[i].review_channel_code);
            }
            await reviewCampaignService.insertReviewCampaignApplicationChannel({ campaign_application_code: campaign_application_code, ...channels[i] });
        }

        res.status(200).json(true);
    } catch (error) {
        next(error);
    }
}

export const getUserReviewCampaignApplicationList = async (req, res, next) => {
    try {
        const user_code = req.user.user_code;
        const campaigns = await reviewCampaignService.getUserReviewCampaignApplicationList(user_code);
        res.status(200).json(campaigns);
    } catch (error) {
        next(error);
    }
}

export const getUserReviewCampaignApplication = async (req, res, next) => {
    try {
        const { campaign_application_code } = req.params;
        const user = req.user;

        if (!user) return res.status(401).json({ message: "로그인이 필요합니다." });

        const campaign = await reviewCampaignService.getUserReviewCampaignApplication(campaign_application_code, user.user_code);
        res.status(200).json(campaign);
    } catch (error) {
        next(error);
    }
}

export const isReviewCampaignApplication = async (req, res, next) => {
    try {
        const { campaign_code } = req.params;
        const user = req.user;

        if (!user) return res.status(401).json({ message: "로그인이 필요합니다." });
        const campaign = await reviewCampaignService.isReviewCampaignApplication(campaign_code, user.user_code);
        res.status(200).json(campaign);
    } catch (error) {
        next(error);
    }
}

export const getUserAddress = async (req, res, next) => {
    try {
        const { address_code } = req.params;
        const user = req.user;

        if (!user) return res.status(401).json({ message: "로그인이 필요합니다." });
        const address = await reviewCampaignService.getUserAddress(address_code, user.user_code);
        res.status(200).json(address);
    } catch (error) {
        next(error);
    }
}

export const getReviewCampaignApplicationDelivery = async (req, res, next) => {
    try {
        const { campaign_application_code } = req.params;
        const user = req.user;

        if (!user) return res.status(401).json({ message: "로그인이 필요합니다." });
        const delivery = await reviewCampaignService.getReviewCampaignApplicationDelivery(campaign_application_code, user.user_code);
        res.status(200).json(delivery);
    } catch (error) {
        next(error);
    }
}