import db from '../../../config/db.js';

export const insertPromotion = async (promotion) => {
    const sql = `
        INSERT INTO product_promotion 
        (name, code, discount_type, discount_value, start_date, end_date, description, is_active) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [
        promotion.name,
        promotion.code,
        promotion.discountType,
        promotion.discountValue,
        promotion.startDate,
        promotion.endDate,
        promotion.description,
        promotion.isActive ? 1 : 0
    ]);
    return result.insertId;
};

export const insertPromotionTarget = async (target) => {
    const sql = `INSERT INTO product_promotion_target (promotion_id, target_type, target_id) VALUES (?, ?, ?)`;
    return await db.query(sql, [target.promotionId, target.targetType, target.targetId]);
};

export const selectPromotions = async () => {
    const sql = `SELECT * FROM product_promotion ORDER BY created_at DESC`;
    const [rows] = await db.query(sql);
    return rows;
};

export const selectPromotionById = async (id) => {
    const promotionSql = `SELECT * FROM product_promotion WHERE id = ?`;
    const [promotionRows] = await db.query(promotionSql, [id]);

    if (promotionRows.length === 0) return null;

    const promotion = promotionRows[0];

    const targetSql = `
        SELECT t.*, 
               c.name as category_name, 
               p.name as product_name, p.price as product_price,
               (SELECT JSON_ARRAYAGG(JSON_OBJECT('url', pi.url, 'is_main', pi.is_main)) FROM product_image pi WHERE pi.product_id = p.id) as product_images
        FROM product_promotion_target t
        LEFT JOIN product_category c ON t.target_type = 'category' AND t.target_id = c.id
        LEFT JOIN product p ON t.target_type = 'product' AND t.target_id = p.id
        WHERE t.promotion_id = ?
    `;
    const [targetRows] = await db.query(targetSql, [id]);

    return { ...promotion, targets: targetRows };
};

export const updatePromotion = async (promotion) => {
    const sql = `
        UPDATE product_promotion 
        SET name = ?, code = ?, discount_type = ?, discount_value = ?, start_date = ?, end_date = ?, description = ?, is_active = ?
        WHERE id = ?
    `;
    return await db.query(sql, [
        promotion.name,
        promotion.code,
        promotion.discountType,
        promotion.discountValue,
        promotion.startDate,
        promotion.endDate,
        promotion.description,
        promotion.isActive ? 1 : 0,
        promotion.id
    ]);
};

export const deletePromotionTarget = async (target) => {
    const sql = `DELETE FROM product_promotion_target WHERE promotion_id = ?`;
    return await db.query(sql, [target]);
};