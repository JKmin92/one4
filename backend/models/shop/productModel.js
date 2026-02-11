import db from "../../config/db.js";

export const getCategories = async () => {
    const [rows] = await db.query('SELECT * FROM product_category');
    return rows;
};

export const getCategoryById = async (id) => {
    const [rows] = await db.query('SELECT * FROM product_category WHERE id = ?', [id]);
    return rows[0];
};

export const getSubCategoryById = async (id) => {
    const [rows] = await db.query('SELECT * FROM product_category WHERE parent_id = ?', [id]);
    return rows;
};

export const getProductsByCategoryId = async (categoryId) => {
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
                   WHERE pi.product_id = p.id
               ) as images
        FROM product p
        JOIN product_category_connect pcc ON p.id = pcc.product_id
        WHERE pcc.category_id = ? AND p.is_display = 1
        ORDER BY p.created_at DESC
    `;
    const [rows] = await db.query(sql, [categoryId]);
    return rows;
};

export const getProductById = async (id) => {
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
                   WHERE pi.product_id = p.id
               ) as images,
               (
                   SELECT JSON_ARRAYAGG(
                              JSON_OBJECT(
                                  'option_num', po.option_num,
                                  'name', po.name,
                                  'value', po.value,
                                  'stock', po.stock
                              )
                          )
                   FROM product_option po
                   WHERE po.product_id = p.id
               ) as options,
               (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'category_id', pcc.category_id
                        )
                    )
                    FROM product_category_connect pcc
                    WHERE pcc.product_id = p.id
               ) as categories
        FROM product p
        WHERE p.id = ? AND p.is_display = 1
    `;
    const [rows] = await db.query(sql, [id]);
    return rows[0];
};