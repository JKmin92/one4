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

    const insertData = { ...data, campaign_code: campaign_code, main_image: mainImageUrl };
    return await model.insertReviewCampaign(insertData);
}

export const insertReviewCampaignChannel = async (data) => {
    return await model.insertReviewCampaignChannel(data);
}

export const insertReviewCampaignMission = async (data) => {
    return await model.insertReviewCampaignMission(data);
}

export const insertReviewCampaignReward = async (data) => {
    return await model.insertReviewCampaignReward(data);
}

export const getReviewCampaignList = async () => {
    return await model.getReviewCampaignList();
}