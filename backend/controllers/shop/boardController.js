import * as boardService from "../../services/shop/boardService.js";
import * as fileUpload from "../../utils/fileUpload.js";
import moment from "moment";

export const insertProductReview = async (req, res, next) => {
    try {
        const user = req.user;
        const { order_id, rating, content } = req.body;
        const product_id = req.params.id;

        if (user === null || product_id === null) {
            return res.status(400).json({ result: '권한 없음' });
        }

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
        const { rating, content, existingImages } = req.body;
        const files = req.files;
        let imagesArray = [];

        if (existingImages) {
            if (Array.isArray(existingImages)) {
                imagesArray.push(...existingImages);
            } else {
                imagesArray.push(existingImages);
            }
        }

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
        const user = req.user;
        const id = req.params.id;
        const review = await boardService.getReviewById(id);
        if (user === null || review === null || review.user_code !== user.user_code) {
            return res.status(403).json({ result: 'error', message: '권한이 없습니다.' });
        }

        await boardService.deleteProductReview(id);
        return res.status(200).json({ result: 'success' });
    } catch (error) {
        next(error);
    }
}

export const insertProductInquiry = async (req, res, next) => {
    try {
        const user = req.user;
        const { type, content, is_secret } = req.body;
        const product_id = req.params.id;

        if (user === null || product_id === null) {
            return res.status(400).json({ result: '권한 없음' });
        }

        const files = req.files;
        let imagesArray = [];

        const uploadId = `${product_id}_${moment().format('YYMMDDHHmmss')}`;

        if (files && files.length > 0) {
            for (const file of files) {
                const url = await fileUpload.uploadFile(file, 'inquiry', uploadId);
                imagesArray.push(url);
            }
        }

        const imagesString = imagesArray.length > 0 ? JSON.stringify(imagesArray) : null;
        await boardService.insertProductInquiry({
            product_id,
            user_code: user?.user_code || null,
            type,
            content,
            images: imagesString,
            is_secret
        });
        return res.status(200).json({ result: 'success' });
    } catch (error) {
        next(error);
    }
}

export const getProductInquiryByProductId = async (req, res, next) => {
    try {
        const product_id = req.params.id;
        const inquiries = await boardService.getProductInquiryByProductId(product_id);
        return res.status(200).json(inquiries);
    } catch (error) {
        next(error);
    }
}

export const getProductInquiryById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const inquiry = await boardService.getProductInquiryById(id);
        return res.status(200).json(inquiry);
    } catch (error) {
        next(error);
    }
}

export const updateProductInquiry = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { type, content, is_secret } = req.body;
        const files = req.files;
        let imagesArray = [];

        if (existingImages) {
            if (Array.isArray(existingImages)) {
                imagesArray.push(...existingImages);
            } else {
                imagesArray.push(existingImages);
            }
        }

        const uploadId = `${id}_${moment().format('YYMMDDHHmmss')}`;

        if (files && files.length > 0) {
            for (const file of files) {
                const url = await fileUpload.uploadFile(file, 'inquiry', uploadId);
                imagesArray.push(url);
            }
        }

        const imagesString = imagesArray.length > 0 ? JSON.stringify(imagesArray) : null;
        await boardService.updateProductInquiry({ id, type, content, images: imagesString, is_secret });
        return res.status(200).json({ result: 'success' });
    } catch (error) {
        next(error);
    }
}

export const deleteProductInquiry = async (req, res, next) => {
    try {
        const user = req.user;
        const id = req.params.id;
        const inquiry = await boardService.getProductInquiryById(id);
        if (user === null || inquiry === null || inquiry.user_code !== user.user_code) {
            return res.status(403).json({ result: 'error', message: '권한이 없습니다.' });
        }

        await boardService.deleteProductInquiry(id);
        return res.status(200).json({ result: 'success' });
    } catch (error) {
        next(error);
    }
}