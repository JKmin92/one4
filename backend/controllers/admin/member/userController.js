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

export const getReviewCampaignApplicationChannelList = async (req, res, next) => {
    try {
        const reviewCampaignApplicationChannelList = await userService.getReviewCampaignApplicationChannelList(req.params.campaign_application_code);
        return res.status(200).json(reviewCampaignApplicationChannelList);
    } catch (e) {
        next(e);
    }
}

export const getUserAddress = async (req, res, next) => {
    try {
        const userAddress = await userService.getUserAddress(req.params.address_code);
        return res.status(200).json(userAddress);
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

export const getUserPoint = async (req, res, next) => {
    try {
        const userPoint = await userService.getUserPoint(req.params.user_code);
        return res.status(200).json(userPoint);
    } catch (e) {
        next(e);
    }
}

export const getUserPointHistory = async (req, res, next) => {
    try {
        const userPointHistoryList = await userService.getUserPointHistory(req.params.user_code);
        return res.status(200).json(userPointHistoryList);
    } catch (e) {
        next(e);
    }
}

export const getUserPointPayout = async (req, res, next) => {
    try {
        const userPointPayoutList = await userService.getUserPointPayout(req.params.user_code);
        return res.status(200).json(userPointPayoutList);
    } catch (e) {
        next(e);
    }
}

export const updateUserPoint = async (req, res, next) => {
    try {
        await userService.updateUserPoint(req.params.user_code, req.body);
        return res.status(200).json({ message: '포인트 지급/차감이 완료되었습니다.' });
    } catch (e) {
        next(e);
    }
}

export const updateUserPointPayout = async (req, res, next) => {
    try {
        await userService.updateUserPointPayout(req.body);
        return res.status(200).json({ message: '출금 신청이 처리되었습니다.' });
    } catch (e) {
        next(e);
    }
}