import db from '../../../config/db.js';

export const insertProductCategory = async (category) => {
    const sql = `INSERT INTO product_category (name, is_visible, sort_order, category_code, parent_code, image_pc, image_tablet, image_mobile) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    return await db.query(sql, [category.name, category.isVisible, category.sort_order, category.category_code, category.parent_code, category.imagePc, category.imageTablet, category.imageMobile]);
}

export const selectProductCategory = async () => {
    const [rows] = await db.query(`SELECT * FROM product_category`);
    return rows;
}

export const updateProductCategory = async (category) => {
    const sql = `UPDATE product_category SET name = ?, is_visible = ?, sort_order = ?, parent_code = ?, image_pc = ?, image_tablet = ?, image_mobile = ? WHERE category_code = ?`;
    return await db.query(sql, [category.name, category.is_visible, category.sort_order, category.parent_code, category.imagePc, category.imageTablet, category.imageMobile, category.category_code]);
}

export const deleteProductCategory = async (category_code) => {
    const sql = `DELETE FROM product_category WHERE category_code = ?`;
    return await db.query(sql, [category_code]);
}

export const updateProductCategorySortOrder = async (category) => {
    const sql = `UPDATE product_category SET sort_order = ? WHERE category_code = ?`;
    return await db.query(sql, [category.sort_order, category.category_code]);
}

export const insertProduct = async (product) => {
    const sql = `
        INSERT INTO product 
        (product_code, name, description, is_display, is_sale, has_options, is_unlimited_stock, stock, price) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    return await db.query(sql, [
        product.product_code,
        product.name,
        product.description,
        product.is_display === 'on' ? 1 : 0,
        product.is_sale === 'on' ? 1 : 0,
        product.has_options === 'on' ? 1 : 0,
        product.is_unlimited_stock ? 1 : 0,
        product.stock,
        product.price
    ]);
};

export const insertProductOption = async (option) => {
    const sql = `INSERT INTO product_option (product_code, product_option_code, name, value, stock) VALUES (?, ?, ?, ?, ?)`;
    return await db.query(sql, [option.product_code, option.product_option_code, option.name, option.value, option.stock]);
};

export const insertProductImage = async (image) => {
    const sql = `INSERT INTO product_image (product_code, url, is_main, sort_order) VALUES (?, ?, ?, ?)`;
    return await db.query(sql, [image.product_code, image.image_url, image.is_main, image.order]);
};

export const insertProductCategoryConnect = async (membership) => {
    const sql = `INSERT INTO product_category_connect (product_code, category_code) VALUES (?, ?)`;
    return await db.query(sql, [membership.product_code, membership.category_code]);
};

export const selectProduct = async (product_code) => {

    const sql = `SELECT * FROM product WHERE product_code = ?`;
    const [rows] = await db.query(sql, [product_code]);
    return rows[0];
};

export const selectProductList = async (keyword) => {
    let sql = `
        SELECT p.*, 
               (
                   SELECT JSON_ARRAYAGG(
                              JSON_OBJECT(
                                  'i_num', i_num, 
                                  'url', url, 
                                  'is_main', is_main, 
                                  'sort_order', sort_order
                              )
                          )
                   FROM product_image
                   WHERE product_code = p.product_code
               ) as images
        FROM product p
    `;

    if (keyword) {
        sql += ` WHERE p.name LIKE ?`;
    }

    sql += ` ORDER BY p.product_code DESC`;

    const params = keyword ? [`%${keyword}%`] : [];
    const [rows] = await db.query(sql, params);
    return rows;
};

export const selectProductOptions = async (product_code) => {
    const sql = `SELECT * FROM product_option WHERE product_code = ? ORDER BY option_num ASC`;
    const [rows] = await db.query(sql, [product_code]);
    return rows;
};

export const selectProductImages = async (product_code) => {
    const sql = `SELECT * FROM product_image WHERE product_code = ? ORDER BY sort_order ASC`;
    const [rows] = await db.query(sql, [product_code]);
    return rows;
};

export const selectProductCategories = async (product_code) => {
    const sql = `
        SELECT c.* 
        FROM product_category c
        JOIN product_category_connect pcc ON c.category_code = pcc.category_code
        WHERE pcc.product_code = ?
    `;
    const [rows] = await db.query(sql, [product_code]);
    return rows;
};

export const updateProduct = async (product) => {
    const sql = `UPDATE product SET name = ?, description = ?, is_display = ?, is_sale = ?, has_options = ?, is_unlimited_stock = ?, stock = ?, price = ? WHERE product_code = ?`;

    return await db.query(sql, [
        product.name,
        product.description,
        product.is_display === 'on' ? 1 : 0,
        product.is_sale === 'on' ? 1 : 0,
        product.has_options === 'on' ? 1 : 0,
        String(product.is_unlimited_stock) === 'true' ? 1 : 0,
        product.stock,
        product.price,
        product.product_code
    ]);
};

export const deleteProductOptions = async (product_code) => {
    const sql = `DELETE FROM product_option WHERE product_code = ?`;
    return await db.query(sql, [product_code]);
};

export const deleteProductCategoryConnect = async (product_code) => {
    const sql = `DELETE FROM product_category_connect WHERE product_code = ?`;
    return await db.query(sql, [product_code]);
};

export const deleteProductMainImage = async (product_code) => {
    const sql = `DELETE FROM product_image WHERE product_code = ? AND is_main = 1`;
    return await db.query(sql, [product_code]);
};

export const deleteProductImages = async (product_code, excludeIds = []) => {
    let sql = `DELETE FROM product_image WHERE product_code = ? AND is_main = 0`;
    const params = [product_code];

    if (excludeIds.length > 0) {
        sql += ` AND i_num NOT IN (?)`;
        params.push(excludeIds);
    }

    return await db.query(sql, params);
};

export const updateProductImageSortOrder = async (id, sortOrder) => {
    const sql = `UPDATE product_image SET sort_order = ? WHERE i_num = ?`;
    return await db.query(sql, [sortOrder, id]);
};