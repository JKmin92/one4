import db from "../../config/db.js";

export const insertProductOrder = async (product_order) => {
    const sql = `INSERT INTO product_order (order_code, user_code, address_code, total_product_price, delivery_price, used_mileage, actual_payment_amount, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.query(sql, [product_order.order_code, product_order.user_code, product_order.address_code, product_order.total_product_price, product_order.delivery_price, product_order.used_mileage, product_order.actual_payment_amount, product_order.status]);
}

export const insertProductOrderItem = async (product_order_item) => {
    const sql = `INSERT INTO product_order_item (order_item_code, order_code, product_code, product_option_code, quantity, discount_type, discount_value, price, final_price, product_name, product_option_label, product_option_value) 
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.query(sql, [product_order_item.order_item_code, product_order_item.order_code, product_order_item.product_code, product_order_item.product_option_code, product_order_item.quantity, product_order_item.discount_type, product_order_item.discount_value, product_order_item.price, product_order_item.final_price, product_order_item.product_name, product_order_item.product_option_label, product_order_item.product_option_value]);
}

export const insertProductOrderPayment = async (product_order_payment) => {
    const sql = `INSERT INTO product_order_payment (payment_code, order_code, payment_type, deposit_name, payment_deadline) VALUES (?, ?, ?, ?, ?)`;
    await db.query(sql, [product_order_payment.payment_code, product_order_payment.order_code, product_order_payment.payment_type, product_order_payment.deposit_name, product_order_payment.payment_deadline]);
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
            po.value AS option_value,
            pi.url as image_url
        FROM product_order_item poi
        LEFT JOIN product p ON poi.product_code = p.product_code
        LEFT JOIN product_option po ON poi.product_option_code = po.product_option_code
        LEFT JOIN product_image pi ON p.product_code = pi.product_code AND pi.is_main = 1
        WHERE poi.order_code = ?
    `;
    const itemResult = await db.query(itemSql, [order_code]);

    const paymentSql = `SELECT * FROM product_order_payment WHERE order_code = ?`;
    const paymentResult = await db.query(paymentSql, [order_code]);

    const addressSql = `SELECT * FROM user_address WHERE address_code = ?`;
    const addressResult = await db.query(addressSql, [orderResult[0][0]?.address_code]);

    const deliverySql = `SELECT * FROM product_order_delivery WHERE order_code = ?`;
    const deliveryResult = await db.query(deliverySql, [order_code]);

    return {
        product_order: orderResult[0][0],
        product_order_items: itemResult[0],
        product_order_payment: paymentResult[0][0],
        address: addressResult[0][0],
        product_order_deliveries: deliveryResult[0]
    };
}

export const getUserProductOrder = async (user_code) => {
    const orderSql = `SELECT * FROM product_order WHERE user_code = ? ORDER BY created_at DESC`;
    const orderResult = await db.query(orderSql, [user_code]);
    const orders = orderResult[0];

    if (!orders || orders.length === 0) {
        return [];
    }

    const orderCodes = orders.map(order => order.order_code);

    const itemSql = `
        SELECT 
            poi.*, 
            p.name AS product_name, 
            p.price AS product_price, 
            po.name AS option_name, 
            po.value AS option_value,
            pi.url as image_url
        FROM product_order_item poi
        LEFT JOIN product p ON poi.product_code = p.product_code
        LEFT JOIN product_option po ON poi.product_option_code = po.product_option_code
        LEFT JOIN product_image pi ON poi.product_code = pi.product_code AND pi.is_main = 1
        WHERE poi.order_code IN (?)
    `;
    const itemResult = await db.query(itemSql, [orderCodes]);
    const items = itemResult[0];

    const claimSql = `SELECT * FROM product_order_claim WHERE user_code = ?`;
    const claimResult = await db.query(claimSql, [user_code]);
    const claims = claimResult[0];

    return orders.map(order => {
        return {
            ...order,
            product_order_items: items.filter(item => item.order_code === order.order_code),
            product_order_claims: claims.filter(claim => claim.order_code === order.order_code)
        };
    });
}

export const getProductNameByCode = async (product_code) => {
    const [rows] = await db.query('SELECT name FROM product WHERE product_code = ?', [product_code]);
    return rows[0]?.name || null;
}

export const getProductOptionByCode = async (product_option_code) => {
    const [rows] = await db.query('SELECT name, value FROM product_option WHERE product_option_code = ?', [product_option_code]);
    return rows[0] || null;
}

export const updateOrderCompleted = async (order_code, user_code) => {
    const sql = `UPDATE product_order SET status = 'COMPLETED' WHERE order_code = ? AND user_code = ?`;
    await db.query(sql, [order_code, user_code]);

    const itemSql = `UPDATE product_order_item SET status = 'COMPLETED' WHERE order_code = ?`;
    await db.query(itemSql, [order_code]);
}