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