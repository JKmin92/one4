import * as userService from "../../../services/admin/member/userService.js";

export const getUserList = async (req, res, next) => {
    try {
        const users = await userService.getUserList();
        return res.status(200).json(users);
    } catch (e) {
        next(e);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await userService.getUser(req.params.user_code);
        return res.status(200).json(user);
    } catch (e) {
        next(e);
    }
}

export const getUserAddressList = async (req, res, next) => {
    try {
        const userAddressList = await userService.getUserAddressList(req.params.user_code);
        return res.status(200).json(userAddressList);
    } catch (e) {
        next(e);
    }
}

export const getUserProductOrderTotalPrice = async (req, res, next) => {
    try {
        const userProductOrderTotalPrice = await userService.getUserProductOrderTotalPrice(req.params.user_code);
        return res.status(200).json(userProductOrderTotalPrice);
    } catch (e) {
        next(e);
    }
}

export const getUserProductOrderList = async (req, res, next) => {
    try {
        const userProductOrderList = await userService.getUserProductOrderList(req.params.user_code);
        return res.status(200).json(userProductOrderList);
    } catch (e) {
        next(e);
    }
}

export const getUserReviewChannelList = async (req, res, next) => {
    try {
        const userReviewChannelList = await userService.getUserReviewChannelList(req.params.user_code);
        return res.status(200).json(userReviewChannelList);
    } catch (e) {
        next(e);
    }
}

export const getUserProductOrderBasketList = async (req, res, next) => {
    try {
        const userProductOrderBasketList = await userService.getUserProductOrderBasketList(req.params.user_code);
        return res.status(200).json(userProductOrderBasketList);
    } catch (e) {
        next(e);
    }
}

export const getUserReviewCampaignList = async (req, res, next) => {
    try {
        const userReviewCampaignList = await userService.getUserReviewCampaignList(req.params.user_code);
        return res.status(200).json(userReviewCampaignList);
    } catch (e) {
        next(e);
    }
}

export const getUserProductReviewList = async (req, res, next) => {
    try {
        const userProductReviewList = await userService.getUserProductReviewList(req.params.user_code);
        return res.status(200).json(userProductReviewList);
    } catch (e) {
        next(e);
    }
}

export const getUserProductInquiryList = async (req, res, next) => {
    try {
        const userProductInqueryList = await userService.getUserProductInquiryList(req.params.user_code);
        return res.status(200).json(userProductInqueryList);
    } catch (e) {
        next(e);
    }
}