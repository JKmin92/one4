import * as boardModel from "../../models/shop/boardModel.js";
import { generateUniqueId } from "../../utils/customUtils.js";

export const insertProductReview = async ({ product_id, user_code, order_id, rating, content, images }) => {
    const review_code = generateUniqueId();
    return await boardModel.insertProductReview({ review_code, product_id, user_code, order_id, rating, content, images });
}

export const getReviewsByProductId = async (product_id) => {
    const reviews = await boardModel.getReviewsByProductId(product_id);
    return reviews.map(review => {
        if (review.user_name && review.user_name.length > 1) {
            return {
                ...review,
                user_name: review.user_name.charAt(0) + '*'.repeat(review.user_name.length - 1)
            };
        }
        return review;
    });
}

export const getReviewById = async (id) => {
    return await boardModel.getReviewById(id);
}

export const updateProductReview = async ({ id, rating, content, images }) => {
    return await boardModel.updateProductReview({ id, rating, content, images });
}

export const deleteProductReview = async (id) => {
    return await boardModel.deleteProductReview(id);
}

export const insertProductInquiry = async (product_inquiry) => {
    const inquiry_code = generateUniqueId();
    return await boardModel.createProductInquiry({
        inquiry_code,
        product_id: product_inquiry.product_id,
        user_code: product_inquiry.user_code,
        type: product_inquiry.type,
        content: product_inquiry.content,
        images: product_inquiry.images,
        is_secret: product_inquiry.is_secret
    });
}

export const getProductInquiryByProductId = async (product_id) => {
    const inquiries = await boardModel.getProductInquiriesByProductId(product_id);
    return inquiries.map(inquiry => {
        if (inquiry.user_name && inquiry.user_name.length > 1) {
            return {
                ...inquiry,
                user_name: inquiry.user_name.charAt(0) + '*'.repeat(inquiry.user_name.length - 1)
            };
        }
        return inquiry;
    });
}

export const getProductInquiryById = async (id) => {
    return await boardModel.getProductInquiryById(id);
}

export const updateProductInquiry = async ({ id, type, content, images, is_secret }) => {
    return await boardModel.updateProductInquiry({ id, type, content, images, is_secret });
}

export const deleteProductInquiry = async (id) => {
    return await boardModel.deleteProductInquiry(id);
}