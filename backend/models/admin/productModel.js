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