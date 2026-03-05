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