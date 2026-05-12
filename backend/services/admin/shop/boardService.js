import * as model from '../../../models/admin/shop/boardModel.js';

export const getProductReviewList = async () => {
    return await model.getProductReviewList();
}

export const getProductInquiryList = async () => {
    return await model.getProductInquiryList();
}

export const getProductReview = async (review_code) => {
    return await model.getProductReview(review_code);
}

export const getProductInquiry = async (product_inquiry_code) => {
    return await model.getProductInquiry(product_inquiry_code);
}