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
            p.name AS product_name
        FROM product_order_item poi
        LEFT JOIN product p ON poi.product_code = p.product_code
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

    return orders.map(order => {
        const orderItems = items.filter(item => item.order_code === order.order_code);

        let order_name = '';
        if (orderItems.length > 0) {
            if (orderItems.length === 1) {
                order_name = orderItems[0].product_name;
            } else {
                order_name = `${orderItems[0].product_name} 외 ${orderItems.length - 1}개`;
            }
        }

        const address = addresses.find(addr => addr.address_code === order.address_code) || null;
        const product_order_payment = payments.find(pay => pay.order_code === order.order_code) || null;

        return {
            ...order,
            order_name,
            product_order_items: orderItems,
            address,
            product_order_payment
        };
    });
}
