import db from "../../config/db.js";
import { generateUniqueId } from "../../utils/customUtils.js";

export const applyAutomaticOrderTransitions = async () => {
    const cancelItemSql = `
        UPDATE product_order_item poi
        JOIN product_order po ON poi.order_code = po.order_code
        JOIN shop_order_setting sos ON sos.id = 1
        SET poi.status = 'CANCEL'
        WHERE po.status = 'PENDING'
          AND DATE_ADD(po.created_at, INTERVAL sos.bank_auto_cancel_days DAY) < NOW()
    `;
    await db.query(cancelItemSql);

    const cancelOrderSql = `
        UPDATE product_order po
        JOIN shop_order_setting sos ON sos.id = 1
        SET po.status = 'CANCEL', po.canceled_at = NOW()
        WHERE po.status = 'PENDING'
          AND DATE_ADD(po.created_at, INTERVAL sos.bank_auto_cancel_days DAY) < NOW()
    `;
    await db.query(cancelOrderSql);

    const completeItemSql = `
        UPDATE product_order_item poi
        JOIN product_order po ON poi.order_code = po.order_code
        SET poi.status = 'COMPLETED'
        WHERE po.status = 'DELIVERED'
          AND poi.status NOT IN ('CANCEL', 'CLAIM')
          AND DATE_ADD(po.delivered_at, INTERVAL 5 DAY) < NOW()
    `;
    await db.query(completeItemSql);

    const completeOrderSql = `
        UPDATE product_order po
        SET po.status = 'COMPLETED', po.completed_at = NOW()
        WHERE po.status = 'DELIVERED'
          AND DATE_ADD(po.delivered_at, INTERVAL 5 DAY) < NOW()
    `;
    await db.query(completeOrderSql);

    const deliverItemSql = `
        UPDATE product_order_item poi
        JOIN product_order po ON poi.order_code = po.order_code
        SET poi.status = 'DELIVERED'
        WHERE po.status = 'SHIPPING'
          AND poi.status NOT IN ('CANCEL', 'CLAIM')
          AND DATE_ADD(po.shipped_at, INTERVAL 5 DAY) < NOW()
    `;
    await db.query(deliverItemSql);

    const deliverOrderSql = `
        UPDATE product_order po
        SET po.status = 'DELIVERED', po.delivered_at = NOW()
        WHERE po.status = 'SHIPPING'
          AND DATE_ADD(po.shipped_at, INTERVAL 5 DAY) < NOW()
    `;
    await db.query(deliverOrderSql);
}

export const insertProductOrder = async (product_order) => {
    const sql = `INSERT INTO product_order (order_code, user_code, total_product_price, delivery_price, used_mileage, actual_payment_amount, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await db.query(sql, [product_order.order_code, product_order.user_code, product_order.total_product_price, product_order.delivery_price, product_order.used_mileage, product_order.actual_payment_amount, product_order.status]);

    const addressCode = generateUniqueId();
    const addressSql = `INSERT INTO product_order_address (order_address_code, order_code, name, postcode, address, detailAddress, phone) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    await db.query(addressSql, [
        addressCode, 
        product_order.order_code, 
        product_order.address.name, 
        product_order.address.postcode, 
        product_order.address.address, 
        product_order.address.detailAddress, 
        product_order.address.phone
    ]);
}

export const insertProductOrderItem = async (product_order_item) => {
    const sql = `INSERT INTO product_order_item (order_item_code, order_code, product_code, product_option_code, quantity, discount_type, discount_value, each_price, price, final_price, product_name, product_option_label, product_option_value) 
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.query(sql, [product_order_item.order_item_code, product_order_item.order_code, product_order_item.product_code, product_order_item.product_option_code, product_order_item.quantity, product_order_item.discount_type, product_order_item.discount_value, product_order_item.each_price, product_order_item.price, product_order_item.final_price, product_order_item.product_name, product_order_item.product_option_label, product_order_item.product_option_value]);
}

export const insertProductOrderPayment = async (product_order_payment) => {
    const sql = `INSERT INTO product_order_payment (payment_code, order_code, payment_type, deposit_name, payment_deadline) VALUES (?, ?, ?, ?, ?)`;
    await db.query(sql, [product_order_payment.payment_code, product_order_payment.order_code, product_order_payment.payment_type, product_order_payment.deposit_name, product_order_payment.payment_deadline]);
}

export const updateDepositName = async (order_code, deposit_name) => {
    const sql = `UPDATE product_order_payment SET deposit_name = ? WHERE order_code = ?`;
    await db.query(sql, [deposit_name, order_code]);
}

export const getProductOrder = async (order_code) => {
    await applyAutomaticOrderTransitions();
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

    const addressSql = `SELECT * FROM product_order_address WHERE order_code = ?`;
    const addressResult = await db.query(addressSql, [order_code]);

    const deliverySql = `SELECT * FROM product_order_delivery WHERE order_code = ?`;
    const deliveryResult = await db.query(deliverySql, [order_code]);

    const claimSql = `SELECT * FROM product_order_claim WHERE order_code = ?`;
    const claimResult = await db.query(claimSql, [order_code]);
    const claim = claimResult[0][0] || null;

    let claimItems = [];
    if (claim) {
        const claimItemSql = `SELECT * FROM product_order_claim_item WHERE order_claim_code = ?`;
        const claimItemResult = await db.query(claimItemSql, [claim.order_claim_code]);
        claimItems = claimItemResult[0];
    }

    return {
        product_order: orderResult[0][0],
        product_order_items: itemResult[0],
        product_order_payment: paymentResult[0][0],
        address: addressResult[0][0],
        product_order_deliveries: deliveryResult[0],
        product_order_claim: claim,
        product_order_claim_items: claimItems
    };
}

export const getUserProductOrder = async (user_code) => {
    await applyAutomaticOrderTransitions();
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
    const sql = `UPDATE product_order SET status = 'COMPLETED', completed_at = NOW() WHERE order_code = ? AND user_code = ?`;
    await db.query(sql, [order_code, user_code]);

    const itemSql = `UPDATE product_order_item SET status = 'COMPLETED' WHERE order_code = ?`;
    await db.query(itemSql, [order_code]);
}

export const insertProductOrderClaim = async (product_order_claim) => {
    const sql = `INSERT INTO product_order_claim (
        order_claim_code, order_code, user_code, claim_type, reason_category, reason_detail, total_product_amount, deducted_delivery_fee
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    await db.query(sql, [
        product_order_claim.order_claim_code,
        product_order_claim.order_code,
        product_order_claim.user_code,
        product_order_claim.claim_type,
        product_order_claim.reason_category,
        product_order_claim.reason_detail,
        product_order_claim.total_product_amount,
        product_order_claim.deducted_delivery_fee
    ]);

    const updateStatusSql = `UPDATE product_order SET status = 'CLAIM' WHERE order_code = ?`;
    await db.query(updateStatusSql, [product_order_claim.order_code]);
}

export const insertProductOrderClaimItem = async (product_order_claim_item, claim_type) => {
    const sql = `INSERT INTO product_order_claim_item (
        order_claim_item_code, order_claim_code, order_item_code, delivery_code, quantity, product_amount
    ) VALUES (?, ?, ?, ?, ?, ? )`;
    await db.query(sql, [
        product_order_claim_item.order_claim_item_code,
        product_order_claim_item.order_claim_code,
        product_order_claim_item.order_item_code,
        product_order_claim_item.delivery_code,
        product_order_claim_item.quantity,
        product_order_claim_item.product_amount
    ]);

    const updateStatusSql = `UPDATE product_order_item SET status = ? WHERE order_item_code = ?`;
    await db.query(updateStatusSql, [claim_type, product_order_claim_item.order_item_code]);
}

export const getProductOrderDeliveryCodeForItemCode = async (order_item_code, order_code) => {
    const sql = `SELECT delivery_code FROM product_order_delivery WHERE order_item_code = ? AND order_code = ?`;
    const [rows] = await db.query(sql, [order_item_code, order_code]);
    return rows[0]?.delivery_code || null;
}

export const getProductOrderDeliveryPriceForOrderCode = async (order_code, user_code) => {
    const sql = `SELECT delivery_price FROM product_order WHERE order_code = ? AND user_code = ?`;
    const [rows] = await db.query(sql, [order_code, user_code]);
    return rows[0]?.delivery_price ?? null;
}

export const getProductOrderItemForOrderItemCode = async (order_item_code) => {
    const sql = `SELECT * FROM product_order_item WHERE order_item_code = ?`;
    const [rows] = await db.query(sql, [order_item_code]);
    return rows[0] || null;
}

export const getShopAccountList = async () => {
    const sql = `SELECT * FROM shop_account WHERE is_active = 1 ORDER BY \`order\` ASC`;
    const [rows] = await db.query(sql);
    return rows;
}

export const getShopDeliverySetting = async () => {
    const sql = `SELECT * FROM shop_delivery_setting WHERE id=1`;
    const [rows] = await db.query(sql);
    return rows[0] || null;
}

export const updateProductOrderAddress = async (order_code, address_data) => {
    const sql = `UPDATE product_order_address SET name = ?, postcode = ?, address = ?, detailAddress = ?, phone = ? WHERE order_code = ?`;
    await db.query(sql, [address_data.name, address_data.postcode, address_data.address, address_data.detailAddress, address_data.phone, order_code]);
}