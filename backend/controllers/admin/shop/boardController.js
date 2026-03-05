import * as boardService from '../../../services/admin/shop/boardService.js';

export const getProductReviewList = async (req, res, next) => {
    try {
        const productReviewList = await boardService.getProductReviewList();
        res.status(200).json(productReviewList);
    } catch (error) {
        next(error);
    }
}