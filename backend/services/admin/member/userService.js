import * as model from '../../../models/admin/member/userModel.js'

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

export const getUserProductReviewList = async (userCode) => {
    return await model.getUserProductReviewList(userCode);
}

export const getUserProductInquiryList = async (userCode) => {
    return await model.getUserProductInquiryList(userCode);
}