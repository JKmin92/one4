import db from '../../../config/db.js';

export const getProductReviewList = async () => {
    const sql = `
        SELECT pr.*, pi.url as product_image, u.name as user_name
        FROM product_review pr
        LEFT JOIN product_image pi ON pr.product_code = pi.product_code
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
        LEFT JOIN product_image pi ON pi.product_code = pin.product_code
        LEFT JOIN user u ON pin.user_code = u.user_code
        WHERE pi.is_main = 1
        ORDER BY pin.id DESC
    `
    const [rows] = await db.query(sql);
    return rows;
}

export const getProductReview = async (review_code) => {
    const sql = `
        SELECT pr.*, pi.url as product_image, u.name as user_name, p.name as product_name
        FROM product_review pr
        LEFT JOIN product_image pi ON pr.product_code = pi.product_code
        LEFT JOIN user u ON pr.user_code = u.user_code
        LEFT JOIN product p ON pr.product_code = p.product_code
        WHERE pi.is_main = 1
        AND pr.review_code = ?
    `
    const [rows] = await db.query(sql, [review_code]);
    return rows[0];
}

export const getProductInquiry = async (product_inquiry_code) => {
    const sql = `
        SELECT pin.*, pi.url as product_image, u.name as user_name, p.name as product_name
        FROM product_inquiry pin
        LEFT JOIN product_image pi ON pi.product_code = pin.product_code
        LEFT JOIN user u ON pin.user_code = u.user_code
        LEFT JOIN product p ON pin.product_code = p.product_code
        WHERE pi.is_main = 1 AND pin.product_inquiry_code = ?
    `
    const [rows] = await db.query(sql, [product_inquiry_code]);
    return rows[0];
}
