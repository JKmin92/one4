import * as model from '../../../models/admin/shop/promotionModel.js';
import { generateUniqueId } from '../../../utils/customUtils.js';

export const createPromotion = async (promotionData) => {
    const product_promotion_code = generateUniqueId();
    await model.insertPromotion({ ...promotionData, product_promotion_code });

    if (promotionData.targetType !== 'all') {
        const targets = promotionData.targets || [];
        for (const target_code of targets) {
            await model.insertPromotionTarget({
                product_promotion_code,
                target_type: promotionData.targetType,
                target_code
            });
        }
    }

    return { success: true, id: product_promotion_code };
};

export const getPromotions = async () => {
    return await model.selectPromotions();
};

export const getPromotion = async (product_promotion_code) => {
    const promotion = await model.selectPromotion(product_promotion_code);
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

    await model.deletePromotionTarget(promotionData.product_promotion_code);
    if (promotionData.targetType !== 'all') {
        const targets = promotionData.targets || [];
        for (const target_code of targets) {
            await model.insertPromotionTarget({
                product_promotion_code: promotionData.product_promotion_code,
                target_type: promotionData.targetType,
                target_code
            });
        }
    }
    return { success: true };
};
