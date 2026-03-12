import * as model from '../../../models/admin/shop/boardModel.js';

export const getProductReviewList = async () => {
    return await model.getProductReviewList();
}

export const getProductInquiryList = async () => {
    return await model.getProductInquiryList();
}

export const getProductReview = async (id) => {
    return await model.getProductReview(id);
}

export const getProductInquiry = async (id) => {
    return await model.getProductInquiry(id);
}