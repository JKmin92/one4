import * as reviewCampaignService from '../../../services/admin/review/reviewCampaignService.js';

export const insertReviewCampaign = async (req, res, next) => {
    try {
        console.log(req.body);
        res.status(200).json({ success: true });
        /*const result = await reviewCampaignService.insertReviewCampaign(req.body, req.files);
        if (result) {
            const campaign_code = result;
            await reviewCampaignService.insertReviewCampaignChannel({ campaign_code: campaign_code, channel_code: req.body.channel_code });
            await reviewCampaignService.insertReviewCampaignMission({ ...req.body, campaign_code: campaign_code });
            await reviewCampaignService.insertReviewCampaignReward({ ...req.body, campaign_code: campaign_code });
            res.status(200).json({ success: true });
        } else {
            res.status(400).json({ success: false, message: '리뷰 캠페인 등록 실패' });
        }*/
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