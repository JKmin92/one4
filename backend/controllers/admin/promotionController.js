import * as promotionService from '../../services/admin/promotionService.js';

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

export const getPromotionById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await promotionService.getPromotionById(id);
        if (!result) {
            return res.status(404).json({ message: "Promotion not found" });
        }
        res.status(200).json(result);
    } catch (e) {
        next(e);
    }
};
