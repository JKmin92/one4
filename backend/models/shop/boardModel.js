import db from "../../config/db.js";

export const insertProductReview = async ({ review_code, product_id, user_code, order_id, rating, content, images }) => {
    const sql = `
        INSERT INTO product_review (review_code, product_id, user_code, order_id, rating, content, images)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [rows] = await db.query(sql, [review_code, product_id, user_code, order_id, rating, content, images]);
    return rows;
}

export const getReviewsByProductCode = async (product_code) => {
    const sql = `
        SELECT r.*, u.name as user_name
        FROM product_review r
        LEFT JOIN user u ON r.user_code = u.user_code
        WHERE r.product_code = ?
        ORDER BY r.created_at DESC
    `;
    const [rows] = await db.query(sql, [product_code]);
    return rows;
}

export const getReviewById = async (id) => {
    const sql = `SELECT * FROM product_review WHERE review_code = ?`;
    const [rows] = await db.query(sql, [id]);
    return rows[0];
}

export const updateProductReview = async ({ id, rating, content, images }) => {
    const sql = `UPDATE product_review SET rating = ?, content = ?, images = ? WHERE review_code = ?`;
    const [rows] = await db.query(sql, [rating, content, images, id]);
    return rows;
}

export const deleteProductReview = async (id) => {
    const sql = `DELETE FROM product_review WHERE review_code = ?`;
    const [rows] = await db.query(sql, [id]);
    return rows;
}

export const createProductInquiry = async ({ inquiry_code, product_id, user_code, type, content, images, is_secret }) => {
    const sql = `INSERT INTO product_inquiry (inquiry_code, product_id, user_code, type, content, images, is_secret) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const [rows] = await db.query(sql, [inquiry_code, product_id, user_code, type, content, images, is_secret]);
    return rows;
}

export const getProductInquiriesByProductCode = async (product_code) => {
    const sql = `
        SELECT i.*, u.name as user_name
        FROM product_inquiry i
        LEFT JOIN user u ON i.user_code = u.user_code
        WHERE i.product_code = ?
        ORDER BY i.created_at DESC
    `;
    const [rows] = await db.query(sql, [product_code]);
    return rows;
}

export const getProductInquiryById = async (id) => {
    const sql = `SELECT * FROM product_inquiry WHERE inquiry_code = ?`;
    const [rows] = await db.query(sql, [id]);
    return rows[0];
}

export const updateProductInquiry = async ({ id, type, content, images, is_secret }) => {
    const sql = `UPDATE product_inquiry SET type = ?, content = ?, images = ?, is_secret = ? WHERE inquiry_code = ?`;
    const [rows] = await db.query(sql, [type, content, images, is_secret, id]);
    return rows;
}

export const deleteProductInquiry = async (id) => {
    const sql = `DELETE FROM product_inquiry WHERE inquiry_code = ?`;
    const [rows] = await db.query(sql, [id]);
    return rows;
}