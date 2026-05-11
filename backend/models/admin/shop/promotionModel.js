import db from '../../../config/db.js';

export const insertPromotion = async (promotion) => {
    const sql = `
        INSERT INTO product_promotion 
        (name, product_promotion_code, discount_type, discount_value, start_date, end_date, description, is_active) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.query(sql, [
        promotion.name,
        promotion.product_promotion_code,
        promotion.discountType,
        promotion.discountValue,
        promotion.startDate,
        promotion.endDate,
        promotion.description,
        promotion.isActive ? 1 : 0
    ]);
};

export const insertPromotionTarget = async (target) => {
    const sql = `INSERT INTO product_promotion_target (product_promotion_code, target_type, target_code) VALUES (?, ?, ?)`;
    await db.query(sql, [target.product_promotion_code, target.target_type, target.target_code]);
};

export const selectPromotions = async () => {
    const sql = `SELECT * FROM product_promotion ORDER BY created_at DESC`;
    const [rows] = await db.query(sql);
    return rows;
};

export const selectPromotion = async (product_promotion_code) => {
    const promotionSql = `SELECT * FROM product_promotion WHERE product_promotion_code = ?`;
    const [promotionRows] = await db.query(promotionSql, [product_promotion_code]);

    if (promotionRows.length === 0) return null;

    const promotion = promotionRows[0];

    const targetSql = `
        SELECT t.*, 
               c.name as category_name, 
               p.name as product_name, p.price as product_price, p.product_code as product_code,
               (SELECT JSON_ARRAYAGG(JSON_OBJECT('url', pi.url, 'is_main', pi.is_main)) FROM product_image pi WHERE pi.product_code = p.product_code) as product_images
        FROM product_promotion_target t
        LEFT JOIN product_category c ON t.target_type = 'category' AND t.target_code = c.category_code
        LEFT JOIN product p ON t.target_type = 'product' AND t.target_code = p.product_code
        WHERE t.product_promotion_code = ?
    `;
    const [targetRows] = await db.query(targetSql, [product_promotion_code]);

    return { ...promotion, targets: targetRows };
};

export const updatePromotion = async (promotion) => {
    const sql = `
        UPDATE product_promotion 
        SET name = ?, discount_type = ?, discount_value = ?, start_date = ?, end_date = ?, description = ?, is_active = ?
        WHERE product_promotion_code = ?
    `;
    return await db.query(sql, [
        promotion.name,
        promotion.discountType,
        promotion.discountValue,
        promotion.startDate,
        promotion.endDate,
        promotion.description,
        promotion.isActive ? 1 : 0,
        promotion.product_promotion_code
    ]);
};

export const deletePromotionTarget = async (product_promotion_code) => {
    const sql = `DELETE FROM product_promotion_target WHERE product_promotion_code = ?`;
    return await db.query(sql, [product_promotion_code]);
};