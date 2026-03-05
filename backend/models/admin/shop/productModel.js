import db from '../../../config/db.js';

export const insertProductCategory = async (category) => {
    const sql = `INSERT INTO product_category (name, is_visible, sort_order, id, parent_id, image_pc, image_tablet, image_mobile) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    return await db.query(sql, [category.name, category.isVisible, category.sort_order, category.id, category.parentId, category.imagePc, category.imageTablet, category.imageMobile]);
}

export const selectProductCategory = async () => {
    const [rows] = await db.query(`SELECT * FROM product_category`);
    return rows;
}

export const updateProductCategory = async (category) => {
    const sql = `UPDATE product_category SET name = ?, is_visible = ?, sort_order = ?, parent_id = ?, image_pc = ?, image_tablet = ?, image_mobile = ? WHERE id = ?`;
    return await db.query(sql, [category.name, category.is_visible, category.sort_order, category.parentId, category.imagePc, category.imageTablet, category.imageMobile, category.id]);
}

export const deleteProductCategory = async (id) => {
    const sql = `DELETE FROM product_category WHERE id = ?`;
    return await db.query(sql, [id]);
}

export const updateProductCategorySortOrder = async (categories) => {
    const sql = `UPDATE product_category SET sort_order = ? WHERE id = ?`;
    return await db.query(sql, [categories.sort_order, categories.id]);
}

export const insertProduct = async (product) => {
    const sql = `
        INSERT INTO product 
        (id, name, description, is_display, is_sale, has_options, is_unlimited_stock, stock, price) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    return await db.query(sql, [
        product.id,
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
    const sql = `INSERT INTO product_option (product_id, name, value, stock) VALUES (?, ?, ?, ?)`;
    return await db.query(sql, [option.product_id, option.name, option.value, option.stock]);
};

export const insertProductImage = async (image) => {
    const sql = `INSERT INTO product_image (product_id, url, is_main, sort_order) VALUES (?, ?, ?, ?)`;
    return await db.query(sql, [image.product_id, image.image_url, image.is_main, image.order]);
};

export const insertProductCategoryConnect = async (membership) => {
    const sql = `INSERT INTO product_category_connect (product_id, category_id) VALUES (?, ?)`;
    return await db.query(sql, [membership.product_id, membership.category_id]);
};

export const selectProduct = async (id) => {

    const sql = `SELECT * FROM product WHERE id = ?`;
    const [rows] = await db.query(sql, [id]);
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
                   WHERE product_id = p.id
               ) as images
        FROM product p
    `;

    if (keyword) {
        sql += ` WHERE p.name LIKE ?`;
    }

    sql += ` ORDER BY p.id DESC`;

    const params = keyword ? [`%${keyword}%`] : [];
    const [rows] = await db.query(sql, params);
    return rows;
};

export const selectProductOptions = async (productId) => {
    const sql = `SELECT * FROM product_option WHERE product_id = ? ORDER BY option_num ASC`;
    const [rows] = await db.query(sql, [productId]);
    return rows;
};

export const selectProductImages = async (productId) => {
    const sql = `SELECT * FROM product_image WHERE product_id = ? ORDER BY sort_order ASC`;
    const [rows] = await db.query(sql, [productId]);
    return rows;
};

export const selectProductCategories = async (productId) => {
    const sql = `
        SELECT c.* 
        FROM product_category c
        JOIN product_category_connect pcc ON c.id = pcc.category_id
        WHERE pcc.product_id = ?
    `;
    const [rows] = await db.query(sql, [productId]);
    return rows;
};

export const updateProduct = async (product) => {
    const sql = `UPDATE product SET name = ?, description = ?, is_display = ?, is_sale = ?, has_options = ?, is_unlimited_stock = ?, stock = ?, price = ? WHERE id = ?`;

    return await db.query(sql, [
        product.name,
        product.description,
        product.is_display === 'on' ? 1 : 0,
        product.is_sale === 'on' ? 1 : 0,
        product.has_options === 'on' ? 1 : 0,
        String(product.is_unlimited_stock) === 'true' ? 1 : 0,
        product.stock,
        product.price,
        product.id
    ]);
};

export const deleteProductOptions = async (productId) => {
    const sql = `DELETE FROM product_option WHERE product_id = ?`;
    return await db.query(sql, [productId]);
};

export const deleteProductCategoryConnect = async (productId) => {
    const sql = `DELETE FROM product_category_connect WHERE product_id = ?`;
    return await db.query(sql, [productId]);
};

export const deleteProductMainImage = async (productId) => {
    const sql = `DELETE FROM product_image WHERE product_id = ? AND is_main = 1`;
    return await db.query(sql, [productId]);
};

export const deleteProductImages = async (productId, excludeIds = []) => {
    let sql = `DELETE FROM product_image WHERE product_id = ? AND is_main = 0`;
    const params = [productId];

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
