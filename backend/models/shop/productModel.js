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

export const getProductById = async (product_code) => {
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