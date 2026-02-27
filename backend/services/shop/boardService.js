import * as boardModel from "../../models/shop/boardModel.js";

export const insertProductReview = async ({ product_id, user_code, order_id, rating, content, images }) => {
    return await boardModel.insertProductReview({ product_id, user_code, order_id, rating, content, images });
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