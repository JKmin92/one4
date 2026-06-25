import db from "../../config/db.js";

export const getCategories = async () => {
    const [rows] = await db.query('SELECT * FROM product_category');
    return rows;
};

export const getCategoryByCode = async (category_code) => {
    const [rows] = await db.query('SELECT * FROM product_category WHERE category_code = ?', [category_code]);
    return rows[0];
};

export const getSubCategoriesByCode = async (parent_code) => {
    const [rows] = await db.query('SELECT * FROM product_category WHERE parent_code = ?', [parent_code]);
    return rows;
};

export const getProductsByCategoryCode = async (category_code) => {
    const sql = `
        SELECT p.*, 
               (
                   SELECT JSON_ARRAYAGG(
                              JSON_OBJECT(
                                  'i_num', pi.i_num, 
                                  'url', pi.url, 
                                  'is_main', pi.is_main, 
                                  'sort_order', pi.sort_order
                              )
                          )
                   FROM product_image pi
                   WHERE pi.product_code = p.product_code
               ) as images
        FROM product p
        JOIN product_category_connect pcc ON p.product_code = pcc.product_code
        WHERE pcc.category_code = ? AND p.is_display = 1
        ORDER BY p.created_at DESC
    `;
    const [rows] = await db.query(sql, [category_code]);
    return rows;
};

export const getActivePromotions = async (product_codes) => {
    if (product_codes.length === 0) return [];

    const sql = `
        SELECT pp.*, ppt.target_type, ppt.target_code,
               CASE 
                   WHEN ppt.target_type = 'product' THEN ppt.target_code
                   WHEN ppt.target_type = 'category' THEN pcc.product_code
               END as related_product_code
        FROM product_promotion pp
        JOIN product_promotion_target ppt ON pp.product_promotion_code = ppt.product_promotion_code
        LEFT JOIN product_category_connect pcc ON ppt.target_type = 'category' AND ppt.target_code = pcc.category_code
        WHERE pp.is_active = 1 
          AND NOW() BETWEEN pp.start_date AND pp.end_date
          AND (
              (ppt.target_type = 'product' AND ppt.target_code IN (?))
              OR 
              (ppt.target_type = 'category' AND pcc.product_code IN (?))
          )
        ORDER BY pp.created_at DESC
    `;

    const [rows] = await db.query(sql, [product_codes, product_codes]);
    return rows;
};

export const getProduct = async (product_code) => {
    const sql = `
        SELECT p.*, 
               (
                   SELECT JSON_ARRAYAGG(
                              JSON_OBJECT(
                                  'i_num', pi.i_num, 
                                  'url', pi.url, 
                                  'is_main', pi.is_main, 
                                  'sort_order', pi.sort_order
                              )
                          )
                   FROM product_image pi
                   WHERE pi.product_code = p.product_code
               ) as images,
               (
                   SELECT JSON_ARRAYAGG(
                              JSON_OBJECT(
                                  'option_num', po.option_num,
                                  'product_option_code', po.product_option_code,
                                  'name', po.name,
                                  'value', po.value,
                                  'stock', po.stock
                              )
                          )
                   FROM product_option po
                   WHERE po.product_code = p.product_code
               ) as options,
               (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'category_code', pcc.category_code
                        )
                    )
                    FROM product_category_connect pcc
                    WHERE pcc.product_code = p.product_code
               ) as categories
        FROM product p
        WHERE p.product_code = ?
    `;
    const [rows] = await db.query(sql, [product_code]);
    return rows[0];
};

export const createProductOrderBasket = async (data) => {
    const sql = `INSERT INTO product_order_basket (order_basket_code, user_code, product_code, product_option_code, quantity) 
    VALUES (?, ?, ?, ?, ?)
    `;
    await db.query(sql, [data.order_basket_code, data.user_code, data.product_code, data.product_option_code, data.quantity]);
};

export const getProductOrderBasket = async (user_code) => {
    const sql = `
        SELECT 
            pob.*,
            p.name as product_name,
            p.price as product_price,
            p.stock as product_stock,
            p.is_unlimited_stock,
            p.is_sale,
            p.is_display,
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'i_num', pi.i_num, 
                        'url', pi.url, 
                        'is_main', pi.is_main, 
                        'sort_order', pi.sort_order
                    )
                )
                FROM product_image pi
                WHERE pi.product_code = pob.product_code
            ) as images,
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'product_promotion_code', pp.product_promotion_code,
                        'name', pp.name,
                        'discount_type', pp.discount_type,
                        'discount_value', pp.discount_value,
                        'start_date', pp.start_date,
                        'end_date', pp.end_date
                    )
                )
                FROM product_promotion_target ppt
                JOIN product_promotion pp ON ppt.product_promotion_code = pp.product_promotion_code
                WHERE (
                    (ppt.target_type = 'product' AND ppt.target_code = pob.product_code)
                    OR ppt.target_type = 'all'
                )
                AND pp.is_active = 1
                AND NOW() BETWEEN pp.start_date AND pp.end_date
            ) as promotions,
            (
                SELECT JSON_OBJECT(
                    'option_num', po.option_num,
                    'product_option_code', po.product_option_code,
                    'name', po.name,
                    'value', po.value,
                    'stock', po.stock
                )
                FROM product_option po
                WHERE po.product_option_code = pob.product_option_code
            ) as options
        FROM product_order_basket pob
        JOIN product p ON pob.product_code = p.product_code
        WHERE pob.user_code = ?
    `;
    const [rows] = await db.query(sql, [user_code]);
    return rows;
};

export const changeProductOrderBasketQuantity = async (data) => {
    const sql = `UPDATE product_order_basket SET quantity = ? WHERE order_basket_code = ? AND user_code = ?`;
    await db.query(sql, [data.quantity, data.order_basket_code, data.user_code]);
}

export const deleteProductOrderBasket = async (order_basket_code, user_code) => {
    const sql = `DELETE FROM product_order_basket WHERE order_basket_code = ? AND user_code = ?`;
    await db.query(sql, [order_basket_code, user_code]);
}

export const checkProductOrderBasket = async (data) => {
    let sql;
    let params;
    if (data.product_option_code) {
        sql = `SELECT COUNT(*) AS count FROM product_order_basket WHERE product_code = ? AND product_option_code = ? AND user_code = ?`;
        params = [data.product_code, data.product_option_code, data.user_code];
    } else {
        sql = `SELECT COUNT(*) AS count FROM product_order_basket WHERE product_code = ? AND product_option_code IS NULL AND user_code = ?`;
        params = [data.product_code, data.user_code];
    }
    const [rows] = await db.query(sql, params);
    return rows[0].count;
}

export const addQuantityToBasket = async (data) => {
    let sql;
    let params;
    if (data.product_option_code) {
        sql = `UPDATE product_order_basket SET quantity = quantity + ? WHERE product_code = ? AND product_option_code = ? AND user_code = ?`;
        params = [data.quantity, data.product_code, data.product_option_code, data.user_code];
    } else {
        sql = `UPDATE product_order_basket SET quantity = quantity + ? WHERE product_code = ? AND product_option_code IS NULL AND user_code = ?`;
        params = [data.quantity, data.product_code, data.user_code];
    }
    await db.query(sql, params);
}

export const getProductOrderBasketCount = async (user_code) => {
    const sql = `SELECT COUNT(*) AS count FROM product_order_basket WHERE user_code = ?`;
    const [rows] = await db.query(sql, [user_code]);
    return rows[0].count;
}

export const getBasketProductInfo = async (basketCodes) => {
    if (!basketCodes || basketCodes.length === 0) return [];

    const results = await Promise.all(basketCodes.map(async (basketCode) => {
        const sql = `SELECT * FROM product_order_basket WHERE order_basket_code = ?`;
        const [rows] = await db.query(sql, [basketCode.order_basket_code]);
        if (rows.length > 0) {
            return {
                ...basketCode,
                ...rows[0]
            };
        }
        return null;
    }));

    return results.filter(r => r !== null);
}

export const getOrderProductInfo = async (orderItems) => {
    if (!orderItems || orderItems.length === 0) return [];

    const results = await Promise.all(orderItems.map(async (item) => {
        const optionCode = item.product_option_code === 'unique' ? null : item.product_option_code;
        const sql = `
            SELECT 
                p.product_code,
                p.name as product_name,
                p.price as product_price,
                p.stock as product_stock,
                p.is_unlimited_stock,
                p.is_sale,
                p.is_display,
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'i_num', pi.i_num, 
                            'url', pi.url, 
                            'is_main', pi.is_main, 
                            'sort_order', pi.sort_order
                        )
                    )
                    FROM product_image pi
                    WHERE pi.product_code = p.product_code
                ) as images,
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'product_promotion_code', pp.product_promotion_code,
                            'name', pp.name,
                            'discount_type', pp.discount_type,
                            'discount_value', pp.discount_value,
                            'start_date', pp.start_date,
                            'end_date', pp.end_date
                        )
                    )
                    FROM product_promotion_target ppt
                    JOIN product_promotion pp ON ppt.product_promotion_code = pp.product_promotion_code
                    LEFT JOIN product_category_connect pcc ON ppt.target_type = 'category' AND ppt.target_code = pcc.category_code
                    WHERE (
                        ppt.target_type = 'all'
                        OR (ppt.target_type = 'product' AND ppt.target_code = p.product_code)
                        OR (ppt.target_type = 'category' AND pcc.product_code = p.product_code)
                    )
                    AND pp.is_active = 1
                    AND NOW() >= pp.start_date AND NOW() <= pp.end_date
                ) as promotions,
                (
                    SELECT JSON_OBJECT(
                        'option_num', po.option_num,
                        'product_option_code', po.product_option_code,
                        'name', po.name,
                        'value', po.value,
                        'stock', po.stock
                    )
                    FROM product_option po
                    WHERE po.product_option_code = ?
                ) as options
            FROM product p
            WHERE p.product_code = ?
        `;
        const [rows] = await db.query(sql, [optionCode, item.product_code]);
        if (rows.length > 0) {
            return {
                ...item,
                ...rows[0]
            };
        }
        return null;
    }));

    return results.filter(r => r !== null);
};

export const getDeliverySetting = async () => {
    const [rows] = await db.query('SELECT * FROM shop_delivery_setting WHERE id = 1');
    return rows[0];
};