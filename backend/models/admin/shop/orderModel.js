import db from '../../../config/db.js';
import { applyAutomaticOrderTransitions } from '../../shop/orderModel.js';

export const getOrderList = async (status) => {
    await applyAutomaticOrderTransitions();
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
    if (orderCodes.length > 0) {
        const addressSql = `SELECT * FROM product_order_address WHERE order_code IN (?)`;
        const [addressResult] = await db.query(addressSql, [orderCodes]);
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

        const address = addresses.find(addr => addr.order_code === order.order_code) || null;
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
    await applyAutomaticOrderTransitions();
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
    if (order.order_code) {
        const addressSql = `SELECT * FROM product_order_address WHERE order_code = ?`;
        const [addresses] = await db.query(addressSql, [order.order_code]);
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
        product_order_claim: claims[0],
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
    let timestampField = '';
    if (status === 'PAID') timestampField = ', paided_at = NOW()';
    else if (status === 'PROCESSING') timestampField = ', processed_at = NOW()';
    else if (status === 'SHIPPING') timestampField = ', shipped_at = NOW()';
    else if (status === 'DELIVERED') timestampField = ', delivered_at = NOW()';
    else if (status === 'COMPLETED') timestampField = ', completed_at = NOW()';
    else if (status === 'CANCEL') timestampField = ', canceled_at = NOW()';

    const sql = `UPDATE product_order SET status = ?${timestampField} WHERE order_code IN (?)`;
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

export const getProductOrderClaimByType = async (type) => {
    const sql = `
        SELECT 
            poc.*,
            po.created_at AS order_created_at,
            po.delivery_price,
            pop.payment_type
        FROM product_order_claim poc
        LEFT JOIN product_order po ON poc.order_code = po.order_code
        LEFT JOIN product_order_payment pop ON poc.order_code = pop.order_code
        WHERE poc.claim_type = ?
    `;
    const [claims] = await db.query(sql, [type]);

    if (!claims || claims.length === 0) { return []; }

    const claimCodes = claims.map(c => c.order_claim_code);
    const userCodes = [...new Set(claims.map(c => c.user_code).filter(Boolean))];
    const orderCodesForAddress = [...new Set(claims.map(c => c.order_code).filter(Boolean))];

    let users = [];
    if (userCodes.length > 0) {
        const userSql = `SELECT user_code, name, email, phone FROM user WHERE user_code IN (?)`;
        const [userRows] = await db.query(userSql, [userCodes]);
        users = userRows;
    }

    let addresses = [];
    if (orderCodesForAddress.length > 0) {
        const addressSql = `SELECT * FROM product_order_address WHERE order_code IN (?)`;
        const [addressRows] = await db.query(addressSql, [orderCodesForAddress]);
        addresses = addressRows;
    }

    let claimItems = [];
    if (claimCodes.length > 0) {
        const claimItemSql = `
            SELECT 
                poci.*,
                poi.product_code,
                pi.url AS product_image_url,
                poi.product_name,
                poi.product_option_label,
                poi.product_option_value,
                poi.each_price
            FROM product_order_claim_item poci
            LEFT JOIN product_order_item poi ON poci.order_item_code = poi.order_item_code
            LEFT JOIN product_image pi ON poi.product_code = pi.product_code AND pi.is_main = 1
            WHERE poci.order_claim_code IN (?)
        `;
        const [claimItemResult] = await db.query(claimItemSql, [claimCodes]);
        claimItems = claimItemResult;
    }

    return claims.map(claim => {
        const user = users.find(u => u.user_code === claim.user_code);
        const items = claimItems.filter(item => item.order_claim_code === claim.order_claim_code);
        const address = addresses.find(a => a.order_code === claim.order_code) || null;

        return {
            ...claim,
            user_name: user?.name || null,
            user_email: user?.email || null,
            user: user ? { name: user.name, email: user.email, phone: user.phone } : null,
            claim_items: items,
            address: address
        };
    });
}

export const updateProductOrderClaimProcessing = async (order_claim_code) => {
    const sql = `UPDATE product_order_claim SET claim_status = 'processing', processed_at = NOW() WHERE order_claim_code = ?`;
    await db.query(sql, [order_claim_code]);
    return { success: true };
}

export const updateProductOrderClaimDetailStatus = async (order_claim_codes, status) => {
    const sql = `UPDATE product_order_claim SET detail_status = ? WHERE order_claim_code IN (?)`;
    await db.query(sql, [status, order_claim_codes]);
    return { success: true };
}

export const updateProductOrderClaimRefoundActive = async (order_claim_item_codes) => {
    const sql = `UPDATE product_order_claim SET claim_type = 'REFUND', claim_status = 'PROCESSING', detail_status = 'REFUND' WHERE order_claim_code IN (?)`;
    await db.query(sql, [order_claim_item_codes]);
    return { success: true };
}

export const getProductOrderClaim = async (order_claim_code) => {
    const sql = `SELECT * FROM product_order_claim WHERE order_claim_code = ?`;
    const [rows] = await db.query(sql, [order_claim_code]);
    return rows[0] || null;
}

export const getProductOrderClaims = async (order_claim_codes) => {
    const codesArray = Array.isArray(order_claim_codes) ? order_claim_codes : [order_claim_codes];
    if (codesArray.length === 0) return [];
    const sql = `SELECT * FROM product_order_claim WHERE order_claim_code IN (?)`;
    const [rows] = await db.query(sql, [codesArray]);
    return rows;
}

export const updateProductOrderClaimsStatus = async (order_claim_codes, claim_status) => {
    const codesArray = Array.isArray(order_claim_codes) ? order_claim_codes : [order_claim_codes];
    if (codesArray.length === 0) return { success: true };
    const sql = `UPDATE product_order_claim SET claim_status = ?, processed_at = NOW() WHERE order_claim_code IN (?)`;
    await db.query(sql, [claim_status, codesArray]);
    return { success: true };
}

export const updateProductOrderClaimsCompleted = async (order_claim_codes) => {
    const codesArray = Array.isArray(order_claim_codes) ? order_claim_codes : [order_claim_codes];
    if (codesArray.length === 0) return { success: true };
    const sql = `UPDATE product_order_claim SET claim_status = 'COMPLETED', completed_at = NOW() WHERE order_claim_code IN (?)`;
    await db.query(sql, [codesArray]);
    return { success: true };
}

export const updateProductOrderClaimsRejected = async (order_claim_codes) => {
    const codesArray = Array.isArray(order_claim_codes) ? order_claim_codes : [order_claim_codes];
    if (codesArray.length === 0) return { success: true };
    const sql = `UPDATE product_order_claim SET claim_status = 'REJECTED', rejected_at = NOW() WHERE order_claim_code IN (?)`;
    await db.query(sql, [codesArray]);
    return { success: true };
}

export const updateProductOrderClaimRefund = async ({ total_product_amount, deducted_delivery_fee, refund_charge_amount, total_refund_amount, refund_method, order_claim_code }) => {
    const sql = `UPDATE product_order_claim SET total_product_amount = ?, deducted_delivery_fee = ?, refund_charge_amount = ?, total_refund_amount = ?, refund_method = ?, claim_status = 'COMPLETED', detail_status = 'REFUND', completed_at = NOW() WHERE order_claim_code = ?`;
    await db.query(sql, [total_product_amount, deducted_delivery_fee, refund_charge_amount, total_refund_amount, refund_method, order_claim_code]);
    return { success: true };
}