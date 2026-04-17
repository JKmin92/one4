import moment from 'moment';
import * as model from '../../../models/admin/review/reviewCampaignModel.js';
import { generateUniqueId } from '../../../utils/customUtils.js';
import * as fileUpload from '../../../utils/fileUpload.js';

export const insertReviewCampaign = async (data, files) => {
    const campaign_code = generateUniqueId();
    const id = moment().format('YYYYMMDDHHmmss') + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    let mainImageUrl = '';
    if (files.mainImage && files.mainImage[0]) {
        mainImageUrl = await fileUpload.uploadFile(files.mainImage[0], 'review', id);
    }

    let detailImageUrls = [];
    if (files && files.detailImages && files.detailImages.length > 0) {
        for (let i = 0; i < files.detailImages.length; i++) {
            const detailId = id + '_d' + i;
            const url = await fileUpload.uploadFile(files.detailImages[i], 'review', detailId);
            detailImageUrls.push(url);
        }
    }

    const insertData = {
        ...data,
        campaign_code: campaign_code,
        main_image: mainImageUrl,
        detail_images: detailImageUrls.length > 0 ? JSON.stringify(detailImageUrls) : null
    };
    return await model.insertReviewCampaign(insertData);
}

export const insertReviewCampaignChannel = async (data) => {
    return await model.insertReviewCampaignChannel(data);
}

export const insertReviewCampaignMission = async (data) => {
    return await model.insertReviewCampaignMission({ ...data, campaign_code: data.campaign_code });
}

export const insertReviewCampaignReward = async (data) => {
    const reward_code = generateUniqueId();
    return await model.insertReviewCampaignReward({ ...data, reward_code });
}

export const updateReviewCampaign = async (campaign_code, data, files) => {
    let mainImageUrl = '';
    if (files && files.mainImage && files.mainImage[0]) {
        const id = moment().format('YYYYMMDDHHmmss') + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        mainImageUrl = await fileUpload.uploadFile(files.mainImage[0], 'review', id);
    }

    let detailImageUrls = [];
    if (data.existingDetailImages) {
        try {
            detailImageUrls = JSON.parse(data.existingDetailImages);
            if (!Array.isArray(detailImageUrls)) detailImageUrls = [detailImageUrls];
        } catch (e) {
            detailImageUrls = typeof data.existingDetailImages === 'string' && data.existingDetailImages.startsWith('[') ? [] : [data.existingDetailImages];
        }
    }

    if (files && files.detailImages && files.detailImages.length > 0) {
        const id = moment().format('YYYYMMDDHHmmss') + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        for (let i = 0; i < files.detailImages.length; i++) {
            const detailId = id + '_d' + i;
            const url = await fileUpload.uploadFile(files.detailImages[i], 'review', detailId);
            detailImageUrls.push(url);
        }
    }

    const updateData = {
        ...data,
        campaign_code,
        ...(mainImageUrl && { main_image: mainImageUrl }),
        detail_images: detailImageUrls.length > 0 ? JSON.stringify(detailImageUrls) : null
    };
    return await model.updateReviewCampaign(updateData);
}

export const updateReviewCampaignMission = async (data) => {
    return await model.updateReviewCampaignMission({ ...data, campaign_code: data.campaign_code });
}

export const deleteReviewCampaignRewardOptions = async (campaign_code) => {
    return await model.deleteReviewCampaignRewardOptions(campaign_code);
}

export const deleteReviewCampaignRewards = async (campaign_code) => {
    return await model.deleteReviewCampaignRewards(campaign_code);
}

export const deleteReviewCampaignChannels = async (campaign_code) => {
    return await model.deleteReviewCampaignChannels(campaign_code);
}

export const getReviewCampaignList = async () => {
    return await model.getReviewCampaignList();
}

export const getDraftReviewCampaigns = async () => {
    return await model.getDraftReviewCampaigns();
}

export const getReviewCampaignCategory = async () => {
    return await model.getReviewCampaignCategory();
}

export const insertReviewCampaignRewardOption = async (data) => {
    const reward_option_code = generateUniqueId();
    return await model.insertReviewCampaignRewardOption({ ...data, reward_option_code });
}

export const getReviewCampaignChannelView = async () => {
    return await model.getReviewCampaignChannelView();
}

export const getReviewCampaign = async (campaign_code) => {
    return await model.getReviewCampaign(campaign_code);
}

export const getReviewCampaignApplicationList = async (campaign_code) => {
    return await model.getReviewCampaignApplicationList(campaign_code);
}

export const selectReviewCampaignApplication = async (campaign_application_code) => {
    return await model.selectReviewCampaignApplication(campaign_application_code);
}

export const getUserAddress = async (address_code) => {
    return await model.getUserAddress(address_code);
}

export const insertReviewCampaignApplicationDelivery = async (campaign_application_code, data) => {
    const campaign_application_delivery_code = generateUniqueId();
    return await model.insertReviewCampaignApplicationDelivery({ ...data, campaign_application_delivery_code, campaign_application_code });
}

export const updateReviewCampaignApplicationDelivery = async (campaign_application_delivery_code, data) => {
    return await model.updateReviewCampaignApplicationDelivery({ ...data, campaign_application_delivery_code });
}

export const getReviewCampaignApplicationDelivery = async (campaign_application_code) => {
    return await model.getReviewCampaignApplicationDelivery(campaign_application_code);
}