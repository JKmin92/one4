import db from '../../../config/db.js';

export const getOrderList = async (status) => {
    let whereSql = '';
    if (status && status !== 'total') {
        whereSql = `WHERE status = ?`;
    }
    const orderSql = `SELECT * FROM product_order ${whereSql} ORDER BY created_at DESC`;
    const [orders] = await db.query(orderSql, status && status !== 'total' ? [status] : []);

    if (!orders || orders.length === 0) {
        return [];
    }

    const orderCodes = orders.map(order => order.order_code);
    const addressCodes = [...new Set(orders.map(order => order.address_code).filter(Boolean))];

    const itemSql = `
        SELECT 
            poi.*,
            poi.product_option_label AS option_name,
            poi.product_option_value AS option_value,
            pi.url AS product_image_url
        FROM product_order_item poi
        LEFT JOIN product_image pi ON poi.product_code = pi.product_code AND pi.is_main = 1
        WHERE poi.order_code IN (?)
    `;
    const [items] = await db.query(itemSql, [orderCodes]);

    let addresses = [];
    if (addressCodes.length > 0) {
        const addressSql = `SELECT * FROM user_address WHERE address_code IN (?)`;
        const [addressResult] = await db.query(addressSql, [addressCodes]);
        addresses = addressResult;
    }

    const paymentSql = `SELECT * FROM product_order_payment WHERE order_code IN (?)`;
    const [payments] = await db.query(paymentSql, [orderCodes]);

    let deliveries = [];
    if (status === 'processing' || status === 'shipping' || status === 'delivered' || status === 'completed') {
        const deliverySql = `SELECT * FROM product_order_delivery WHERE order_code IN (?)`;
        const [deliveryResult] = await db.query(deliverySql, [orderCodes]);
        deliveries = deliveryResult;
    }

    return orders.map(order => {
        const orderItems = items.filter(item => item.order_code === order.order_code);
        const orderDeliveries = deliveries.filter(d => d.order_code === order.order_code);

        const mappedOrderItems = orderItems.map(item => {
            const delivery = orderDeliveries.find(d => d.order_item_code === item.order_item_code);
            if (delivery) {
                return {
                    ...item,
                    post_company: delivery.post_company,
                    post_number: delivery.post_number
                };
            }
            return item;
        });

        let order_name = '';
        if (mappedOrderItems.length > 0) {
            if (mappedOrderItems.length === 1) {
                order_name = mappedOrderItems[0].product_name;
            } else {
                order_name = `${mappedOrderItems[0].product_name} 외 ${mappedOrderItems.length - 1}개`;
            }
        }

        const address = addresses.find(addr => addr.address_code === order.address_code) || null;
        const product_order_payment = payments.find(pay => pay.order_code === order.order_code) || null;

        return {
            ...order,
            order_name,
            product_order_items: mappedOrderItems,
            address,
            product_order_payment,
            ...(orderDeliveries.length > 0 && { product_order_deliveries: orderDeliveries })
        };
    });
}

export const insertProductOrderDelivery = async (product_order_delivery) => {
    const checkSql = `SELECT * FROM product_order_delivery WHERE order_item_code = ? AND order_code = ?`;
    const [existing] = await db.query(checkSql, [product_order_delivery.order_item_code, product_order_delivery.order_code]);

    if (existing && existing.length > 0) {
        const updateSql = `UPDATE product_order_delivery SET post_company = ?, post_number = ? WHERE order_item_code = ? AND order_code = ?`;
        return await db.query(updateSql, [product_order_delivery.post_company, product_order_delivery.post_number, product_order_delivery.order_item_code, product_order_delivery.order_code]);
    } else {
        const insertSql = `INSERT INTO product_order_delivery (delivery_code, order_code, order_item_code, post_company, post_number) VALUES (?, ?, ?, ?, ?)`;
        return await db.query(insertSql, [product_order_delivery.delivery_code, product_order_delivery.order_code, product_order_delivery.order_item_code, product_order_delivery.post_company, product_order_delivery.post_number]);
    }
}

export const getOrder = async (order_code) => {
    const orderSql = `SELECT * FROM product_order WHERE order_code = ?`;
    const [orders] = await db.query(orderSql, [order_code]);
    const order = orders[0];
    if (!order) return null;

    const itemSql = `
        SELECT 
            poi.*,
            poi.product_option_label AS option_name,
            poi.product_option_value AS option_value,
            pi.url AS product_image_url
        FROM product_order_item poi
        LEFT JOIN product_image pi ON poi.product_code = pi.product_code AND pi.is_main = 1
        WHERE poi.order_code = ?
    `;
    const [items] = await db.query(itemSql, [order_code]);

    const deliverySql = `SELECT * FROM product_order_delivery WHERE order_code = ?`;
    const [deliveries] = await db.query(deliverySql, [order_code]);

    const claimSql = `SELECT * FROM product_order_claim WHERE order_code = ?`;
    const [claims] = await db.query(claimSql, [order_code]);

    const paymentSql = `SELECT * FROM product_order_payment WHERE order_code = ?`;
    const [payments] = await db.query(paymentSql, [order_code]);
    const payment = payments[0] || null;

    let address = null;
    if (order.address_code) {
        const addressSql = `SELECT * FROM user_address WHERE address_code = ?`;
        const [addresses] = await db.query(addressSql, [order.address_code]);
        address = addresses[0] || null;
    }

    const mappedItems = items.map(item => {
        const delivery = deliveries.find(d => d.order_item_code === item.order_item_code);
        if (delivery) {
            return {
                ...item,
                post_company: delivery.post_company,
                post_number: delivery.post_number
            };
        }
        return item;
    });

    const userSql = `SELECT * FROM user WHERE user_code = ?`;
    const [users] = await db.query(userSql, [order.user_code]);
    const user = users[0] || null;

    return {
        product_order: order,
        product_order_items: mappedItems,
        product_order_payment: payment,
        product_order_claims: claims,
        product_order_deliveries: deliveries,
        address: address,
        orderUser: user
    };
}

export const getProductOrderItems = async (order_codes) => {
    const sql = `SELECT * FROM product_order_item WHERE order_code IN (?)`;
    const [items] = await db.query(sql, [order_codes]);
    return items;
}

export const updateOrderStatus = async (order_codes, status) => {
    const sql = `UPDATE product_order SET status = ? WHERE order_code IN (?)`;
    return await db.query(sql, [status, order_codes]);
}

export const updateOrderItemStatus = async (order_item_codes, status) => {
    const sql = `UPDATE product_order_item SET status = ? WHERE order_item_code IN (?)`;
    return await db.query(sql, [status, order_item_codes]);
}

export const updatePaidCheckTime = async (order_codes) => {
    const sql = `UPDATE product_order_payment SET paid_check_time = NOW() WHERE order_code IN (?)`;
    return await db.query(sql, [order_codes]);
}