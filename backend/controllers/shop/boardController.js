import * as boardService from "../../services/shop/boardService.js";
import * as fileUpload from "../../utils/fileUpload.js";
import moment from "moment";

export const insertProductReview = async (req, res, next) => {
    try {
        const user = req.user;
        const { order_id, rating, content } = req.body;
        const product_id = req.params.id;

        const files = req.files;
        let imagesArray = [];

        const uploadId = `${product_id}_${moment().format('YYMMDDHHmmss')}`;

        if (files && files.length > 0) {
            for (const file of files) {
                const url = await fileUpload.uploadFile(file, 'review', uploadId);
                imagesArray.push(url);
            }
        }

        const imagesString = imagesArray.length > 0 ? JSON.stringify(imagesArray) : null;

        await boardService.insertProductReview({
            product_id,
            user_code: user?.user_code || null,
            order_id: order_id || null,
            rating,
            content,
            images: imagesString
        });

        return res.status(200).json({ result: 'success' });
    } catch (error) {
        next(error)
    }
}

export const getReviewsByProductId = async (req, res, next) => {
    try {
        const product_id = req.params.id;
        const reviews = await boardService.getReviewsByProductId(product_id);
        return res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
}

export const getReviewById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const review = await boardService.getReviewById(id);
        return res.status(200).json(review);
    } catch (error) {
        next(error);
    }
}

export const updateProductReview = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { rating, content } = req.body;
        const files = req.files;
        let imagesArray = [];

        const uploadId = `${id}_${moment().format('YYMMDDHHmmss')}`;

        if (files && files.length > 0) {
            for (const file of files) {
                const url = await fileUpload.uploadFile(file, 'review', uploadId);
                imagesArray.push(url);
            }
        }

        const imagesString = imagesArray.length > 0 ? JSON.stringify(imagesArray) : null;
        await boardService.updateProductReview({ id, rating, content, images: imagesString });
        return res.status(200).json({ result: 'success' });
    } catch (error) {
        next(error);
    }
}

export const deleteProductReview = async (req, res, next) => {
    try {
        const id = req.params.id;
        await boardService.deleteProductReview(id);
        return res.status(200).json({ result: 'success' });
    } catch (error) {
        next(error);
    }
}