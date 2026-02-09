import db from '../../config/db.js';

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
        (id, name, description, is_display, is_sale, has_options, is_unlimited_stock, stock) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    return await db.query(sql, [
        product.id,
        product.name,
        product.description,
        product.is_display === 'on' ? 1 : 0,
        product.is_sale === 'on' ? 1 : 0,
        product.has_options === 'on' ? 1 : 0,
        product.is_unlimited_stock ? 1 : 0,
        product.stock
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
