import db from "../../config/db.js";

export const insertProductOrder = async (product_order) => {
    const sql = `INSERT INTO product_order (order_code, user_code, address_code, total_product_price, delivery_price, used_mileage, actual_payment_amount, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.query(sql, [product_order.order_code, product_order.user_code, product_order.address_code, product_order.total_product_price, product_order.delivery_price, product_order.used_mileage, product_order.actual_payment_amount, product_order.status]);
}

export const insertProductOrderItem = async (product_order_item) => {
    const sql = `INSERT INTO product_order_item (order_item_code, order_code, product_code, product_option_code, quantity, discount_type, discount_value, price) 
        VALUES(?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.query(sql, [product_order_item.order_item_code, product_order_item.order_code, product_order_item.product_code, product_order_item.product_option_code, product_order_item.quantity, product_order_item.discount_type, product_order_item.discount_value, product_order_item.price]);
}

export const insertProductOrderPayment = async (product_order_payment) => {
    const sql = `INSERT INTO product_order_payment (payment_code, order_code, payment_type, deposit_name) VALUES (?, ?, ?, ?)`;
    await db.query(sql, [product_order_payment.payment_code, product_order_payment.order_code, product_order_payment.payment_type, product_order_payment.deposit_name]);
}

export const getProductOrder = async (order_code) => {
    const orderSql = `SELECT * FROM product_order WHERE order_code = ?`;
    const orderResult = await db.query(orderSql, [order_code]);

    const itemSql = `
        SELECT 
            poi.*, 
            p.name AS product_name, 
            p.price AS product_price, 
            po.name AS option_name, 
            po.value AS option_value
        FROM product_order_item poi
        LEFT JOIN product p ON poi.product_code = p.product_code
        LEFT JOIN product_option po ON poi.product_option_code = po.product_option_code
        WHERE poi.order_code = ?
    `;
    const itemResult = await db.query(itemSql, [order_code]);

    const paymentSql = `SELECT * FROM product_order_payment WHERE order_code = ?`;
    const paymentResult = await db.query(paymentSql, [order_code]);

    return {
        product_order: orderResult[0][0],
        product_order_items: itemResult[0],
        product_order_payment: paymentResult[0][0]
    };
}