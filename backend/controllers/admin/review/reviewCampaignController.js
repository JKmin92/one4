import * as reviewCampaignService from '../../../services/admin/review/reviewCampaignService.js';

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
                const reward_options = reward.reward_options;
                if (reward_options && reward_options.length > 0) {
                    reward_options.forEach(async reward_option => {
                        await reviewCampaignService.insertReviewCampaignRewardOption({ ...reward_option, reward_id: reward_id });
                    });
                }
            });

            res.status(200).json({ success: true });
        } else {
            res.status(400).json({ success: false, message: '리뷰 캠페인 등록 실패' });
        }
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
        const result = await reviewCampaignService.getReviewCampaignList();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}