import * as boardService from '../../../services/admin/shop/boardService.js';

export const getProductReviewList = async (req, res, next) => {
    try {
        const productReviewList = await boardService.getProductReviewList();
        res.status(200).json(productReviewList);
    } catch (error) {
        next(error);
    }
}

export const getProductInquiryList = async (req, res, next) => {
    try {
        const productInquiryList = await boardService.getProductInquiryList();
        res.status(200).json(productInquiryList);
    } catch (error) {
        next(error);
    }
}

export const getProductReview = async (req, res, next) => {
    try {
        const productReview = await boardService.getProductReview(req.params.id);
        res.status(200).json(productReview);
    } catch (error) {
        next(error);
    }
}

export const getProductInquiry = async (req, res, next) => {
    try {
        const productInquiry = await boardService.getProductInquiry(req.params.id);
        res.status(200).json(productInquiry);
    } catch (error) {
        next(error);
    }
}