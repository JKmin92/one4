import * as model from '../../../models/admin/shop/boardModel.js';

export const getProductReviewList = async () => {
    return await model.getProductReviewList();
}