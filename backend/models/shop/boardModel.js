import db from "../../config/db.js";

export const insertProductReview = async ({ product_id, user_code, order_id, rating, content, images }) => {
    const sql = `
        INSERT INTO product_review (product_id, user_code, order_id, rating, content, images)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [rows] = await db.query(sql, [product_id, user_code, order_id, rating, content, images]);
    return rows;
}

export const getReviewsByProductId = async (product_id) => {
    const sql = `
        SELECT r.*, u.name as user_name
        FROM product_review r
        LEFT JOIN user u ON r.user_code = u.user_code
        WHERE r.product_id = ?
        ORDER BY r.created_at DESC
    `;
    const [rows] = await db.query(sql, [product_id]);
    return rows;
}

export const getReviewById = async (id) => {
    const sql = `SELECT * FROM product_review WHERE id = ?`;
    const [rows] = await db.query(sql, [id]);
    return rows[0];
}

export const updateProductReview = async ({ id, rating, content, images }) => {
    const sql = `UPDATE product_review SET rating = ?, content = ?, images = ? WHERE id = ?`;
    const [rows] = await db.query(sql, [rating, content, images, id]);
    return rows;
}

export const deleteProductReview = async (id) => {
    const sql = `DELETE FROM product_review WHERE id = ?`;
    const [rows] = await db.query(sql, [id]);
    return rows;
}