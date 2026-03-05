import * as model from '../../../models/admin/shop/promotionModel.js';

export const createPromotion = async (promotionData) => {
    const promotionId = await model.insertPromotion(promotionData);

    if (promotionData.targetType !== 'all') {
        const targets = promotionData.targets || [];
        for (const targetId of targets) {
            await model.insertPromotionTarget({
                promotionId,
                targetType: promotionData.targetType,
                targetId
            });
        }
    }

    return { success: true, id: promotionId };
};

export const getPromotions = async () => {
    return await model.selectPromotions();
};

export const getPromotionById = async (id) => {
    const promotion = await model.selectPromotionById(id);
    if (!promotion) return null;

    if (promotion.targets) {
        promotion.targets = promotion.targets.map(target => {
            if (target.product_images && typeof target.product_images === 'string') {
                try {
                    target.product_images = JSON.parse(target.product_images);
                } catch (e) {
                    console.error("Failed to parse product_images JSON for target", target.id, e);
                    target.product_images = [];
                }
            }
            return target;
        });
    }

    return promotion;
};

export const updatePromotion = async (promotionData) => {
    await model.updatePromotion(promotionData);

    await model.deletePromotionTarget(promotionData.id);
    if (promotionData.targetType !== 'all') {
        const targets = promotionData.targets || [];
        for (const targetId of targets) {
            await model.insertPromotionTarget({
                promotionId: promotionData.id,
                targetType: promotionData.targetType,
                targetId
            });
        }
    }
    return { success: true };
};
