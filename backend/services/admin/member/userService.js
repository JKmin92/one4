import * as model from '../../../models/admin/member/userModel.js'
import { generateUniqueId } from '../../../utils/customUtils.js';

export const getUserList = async () => {
    return await model.getUserList();
}

export const getUser = async (userCode) => {
    return await model.getUser(userCode);
}

export const getUserAddressList = async (userCode) => {
    return await model.getUserAddressList(userCode);
}

export const getUserProductOrderTotalPrice = async (userCode) => {
    return await model.getUserProductOrderTotalPrice(userCode);
}

export const getUserProductOrderList = async (userCode) => {
    return await model.getUserProductOrderList(userCode);
}

export const getUserReviewChannelList = async (userCode) => {
    return await model.getUserReviewChannelList(userCode);
}

export const getUserProductOrderBasketList = async (userCode) => {
    return await model.getUserProductOrderBasketList(userCode);
}

export const getUserReviewCampaignList = async (userCode) => {
    return await model.getUserReviewCampaignList(userCode);
}

export const getReviewCampaignApplicationChannelList = async (campaignApplicationCode) => {
    return await model.getReviewCampaignApplicationChannelList(campaignApplicationCode);
}

export const getUserAddress = async (addressCode) => {
    return await model.getUserAddress(addressCode);
}

export const getUserProductReviewList = async (userCode) => {
    return await model.getUserProductReviewList(userCode);
}

export const getUserProductInquiryList = async (userCode) => {
    return await model.getUserProductInquiryList(userCode);
}

export const getUserPoint = async (userCode) => {
    return await model.getUserPoint(userCode);
}

export const getUserPointHistory = async (userCode) => {
    return await model.getUserPointHistory(userCode);
}

export const getUserPointPayout = async (userCode) => {
    return await model.getUserPointPayout(userCode);
}

export const updateUserPoint = async (userCode, data) => {
    const history_code = generateUniqueId();

    await model.updateUserPoint(userCode, data.amount, data.type);
    return await model.insertUserPointHistory(history_code, userCode, data.amount, data.reason, data.type);
}

export const updateUserPointPayout = async (data) => {
    await model.updateUserPointPayout(data);
    if (data.status === 'REJECTED') {
        const userPointPayout = await model.getUserPointPayoutOne(data.payout_code);
        const history_code = generateUniqueId();
        await model.insertUserPointHistory(history_code, data.user_code, userPointPayout.amount, data.reject_description, 'PAYOUT_CANCEL');
        await model.updateUserPoint(data.user_code, userPointPayout.amount, 'CANCEL');
    }
}