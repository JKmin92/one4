import * as promotionService from '../../../services/admin/shop/promotionService.js';

export const createPromotion = async (req, res, next) => {
    try {
        const promotionData = req.body;
        const result = await promotionService.createPromotion(promotionData);
        res.status(201).json(result);
    } catch (e) {
        next(e);
    }
};

export const getPromotions = async (req, res, next) => {
    try {
        const result = await promotionService.getPromotions();
        res.status(200).json(result);
    } catch (e) {
        next(e);
    }
};

export const getPromotion = async (req, res, next) => {
    try {
        const { product_promotion_code } = req.params;
        const result = await promotionService.getPromotion(product_promotion_code);
        if (!result) {
            return res.status(404).json({ message: "Promotion not found" });
        }
        res.status(200).json(result);
    } catch (e) {
        next(e);
    }
};

export const updatePromotion = async (req, res, next) => {
    try {
        const { id } = req.params;
        const promotion = req.body;
        const promotionData = { id: id, ...promotion };
        const result = await promotionService.updatePromotion(promotionData);
        res.status(200).json(result);
    } catch (e) {
        next(e);
    }
};