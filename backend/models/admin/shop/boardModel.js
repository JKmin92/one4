import db from '../../../config/db.js';

export const getProductReviewList = async () => {
    const sql = `
        SELECT pr.*, pi.url as product_image, u.name as user_name
        FROM product_review pr
        LEFT JOIN product_image pi ON pr.product_id = pi.product_id
        LEFT JOIN user u ON pr.user_code = u.user_code
        WHERE pi.is_main = 1
        ORDER BY pr.id DESC
    `
    const [rows] = await db.query(sql);
    return rows;
}

export const getProductInquiryList = async () => {
    const sql = `
        SELECT pin.*, pi.url as product_image, u.name as user_name
        FROM product_inquiry pin
        LEFT JOIN product_image pi ON pi.product_id = pin.product_id
        LEFT JOIN user u ON pin.user_code = u.user_code
        WHERE pi.is_main = 1
        ORDER BY pin.id DESC
    `
    const [rows] = await db.query(sql);
    return rows;
}

export const getProductReview = async (id) => {
    const sql = `
        SELECT pr.*, pi.url as product_image, u.name as user_name, p.name as product_name
        FROM product_review pr
        LEFT JOIN product_image pi ON pr.product_id = pi.product_id
        LEFT JOIN user u ON pr.user_code = u.user_code
        LEFT JOIN product p ON pr.product_id = p.id
        WHERE pi.is_main = 1
        AND pr.id = ?
    `
    const [rows] = await db.query(sql, [id]);
    return rows[0];
}

export const getProductInquiry = async (id) => {
    const sql = `
        SELECT pin.*, pi.url as product_image, u.name as user_name, p.name as product_name
        FROM product_inquiry pin
        LEFT JOIN product_image pi ON pi.product_id = pin.product_id
        LEFT JOIN user u ON pin.user_code = u.user_code
        LEFT JOIN product p ON pin.product_id = p.id
        WHERE pi.is_main = 1 AND pin.id = ?
    `
    const [rows] = await db.query(sql, [id]);
    return rows[0];
}
