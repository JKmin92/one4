import * as reviewCampaignService from '../../../services/admin/review/reviewCampaignService.js';
import { uploadFile } from '../../../utils/fileUpload.js';
import moment from 'moment';

export const uploadEditorImage = async (req, res, next) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ success: false, message: '이미지가 없습니다.' });
        }

        const id = moment().format('YYYYMMDDHHmmss') + Math.floor(Math.random() * 1000).toString().padStart(3, '0');

        const imageUrl = await uploadFile(file, 'review/campaign_editor', id);
        res.status(200).json({ success: true, url: imageUrl });
    } catch (error) {
        next(error);
    }
}

export const insertReviewCampaign = async (req, res, next) => {
    try {
        const user = req.user;

        const result = await reviewCampaignService.insertReviewCampaign({ ...req.body, user_code: user?.user_code }, req.files);
        if (result) {

            const campaign_code = result;
            const mission = JSON.parse(req.body.mission);
            const channels = JSON.parse(req.body.channels);
            const rewards = JSON.parse(req.body.rewards);

            await reviewCampaignService.insertReviewCampaignMission({ ...mission, campaign_code: campaign_code });

            channels.forEach(async channel => {
                await reviewCampaignService.insertReviewCampaignChannel({ campaign_code: campaign_code, channel_code: channel });
            });

            rewards.forEach(async reward => {
                const reward_id = await reviewCampaignService.insertReviewCampaignReward({ ...reward, campaign_code: campaign_code });
                const reward_options = reward.options;
                if (reward_options && reward_options.length > 0) {
                    reward_options.forEach(async reward_option => {
                        await reviewCampaignService.insertReviewCampaignRewardOption({ ...reward_option, reward_id: reward_id });
                    });
                }
            });

            res.status(200).json({ success: true, campaign_code });
        } else {
            res.status(400).json({ success: false, message: '리뷰 캠페인 등록 실패' });
        }
    } catch (error) {
        next(error);
    }
}

export const updateReviewCampaign = async (req, res, next) => {
    try {
        const campaign_code = req.params.id;

        await reviewCampaignService.updateReviewCampaign(campaign_code, req.body, req.files);

        const mission = req.body.mission ? JSON.parse(req.body.mission) : null;
        const channels = req.body.channels ? JSON.parse(req.body.channels) : [];
        const rewards = req.body.rewards ? JSON.parse(req.body.rewards) : [];

        if (mission) {
            await reviewCampaignService.updateReviewCampaignMission({ ...mission, campaign_code });
        }

        await reviewCampaignService.deleteReviewCampaignRewardOptions(campaign_code);
        await reviewCampaignService.deleteReviewCampaignRewards(campaign_code);
        await reviewCampaignService.deleteReviewCampaignChannels(campaign_code);

        for (const channel of channels) {
            await reviewCampaignService.insertReviewCampaignChannel({ campaign_code, channel_code: channel });
        }

        for (const reward of rewards) {
            const reward_id = await reviewCampaignService.insertReviewCampaignReward({ ...reward, campaign_code });
            const reward_options = reward.options;
            if (reward_options && reward_options.length > 0) {
                for (const reward_option of reward_options) {
                    await reviewCampaignService.insertReviewCampaignRewardOption({
                        reward_id,
                        option_name: reward_option.name || reward_option.option_name,
                        option_value: reward_option.values || reward_option.option_value
                    });
                }
            }
        }

        res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
}

export const getReviewCampaignCategory = async (req, res, next) => {
    try {
        const result = await reviewCampaignService.getReviewCampaignCategory();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export const getReviewCampaignChannelView = async (req, res, next) => {
    try {
        const result = await reviewCampaignService.getReviewCampaignChannelView();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export const getReviewCampaignList = async (req, res, next) => {
    try {
        const campaigns = await reviewCampaignService.getReviewCampaignList();
        res.status(200).json(campaigns);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
}

export const getDraftReviewCampaigns = async (req, res, next) => {
    try {
        const campaigns = await reviewCampaignService.getDraftReviewCampaigns();
        res.status(200).json(campaigns);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
}

export const getReviewCampaign = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await reviewCampaignService.getReviewCampaign(id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}