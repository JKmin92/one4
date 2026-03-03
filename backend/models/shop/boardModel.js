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

export const createProductInquiry = async ({ product_id, user_id, type, content, images, is_secret }) => {
    const sql = `INSERT INTO product_inquiry (product_id, user_id, type, content, images, is_secret) VALUES (?, ?, ?, ?, ?, ?)`;
    const [rows] = await db.query(sql, [product_id, user_id, type, content, images, is_secret]);
    return rows;
}

export const getProductInquiriesByProductId = async (product_id) => {
    const sql = `
        SELECT i.*, u.name as user_name
        FROM product_inquiry i
        LEFT JOIN user u ON i.user_id = u.user_code
        WHERE i.product_id = ?
        ORDER BY i.created_at DESC
    `;
    const [rows] = await db.query(sql, [product_id]);
    return rows;
}

export const getProductInquiryById = async (id) => {
    const sql = `SELECT * FROM product_inquiry WHERE id = ?`;
    const [rows] = await db.query(sql, [id]);
    return rows[0];
}

export const updateProductInquiry = async ({ id, type, content, images, is_secret }) => {
    const sql = `UPDATE product_inquiry SET type = ?, content = ?, images = ?, is_secret = ? WHERE id = ?`;
    const [rows] = await db.query(sql, [type, content, images, is_secret, id]);
    return rows;
}

export const deleteProductInquiry = async (id) => {
    const sql = `DELETE FROM product_inquiry WHERE id = ?`;
    const [rows] = await db.query(sql, [id]);
    return rows;
}