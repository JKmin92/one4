import db from "../../../config/db.js";

export const getUserList = async () => {
    const sql = `SELECT * FROM user WHERE role = 'USER' ORDER BY created_at DESC`;
    const [users] = await db.query(sql);

    if (users.length === 0) return [];

    const userCodes = users.map(user => user.user_code);
    const [channels] = await db.query(
        `SELECT * FROM user_review_channel WHERE user_code IN (?) AND deleted = 0`,
        [userCodes]
    );

    const channelMap = {};
    channels.forEach(channel => {
        if (!channelMap[channel.user_code]) {
            channelMap[channel.user_code] = [];
        }
        channelMap[channel.user_code].push(channel);
    });

    return users.map(user => ({
        ...user,
        review_channels: channelMap[user.user_code] || []
    }));
}

export const getUser = async (user_code) => {
    const sql = `SELECT * FROM user WHERE user_code = ?`;
    const [rows] = await db.query(sql, [user_code]);
    return rows[0] || null;
}

export const getUserAddressList = async (user_code) => {
    const sql = `SELECT * FROM user_address WHERE user_code = ? AND deleted = 0`;
    const [rows] = await db.query(sql, [user_code]);
    return rows;
}

export const getUserProductOrderTotalPrice = async (user_code) => {
    const orderSql = `SELECT * FROM product_order WHERE user_code = ? AND status = 'COMPLETED'`;
    const [orders] = await db.query(orderSql, [user_code]);

    if (!orders || orders.length === 0) {
        return 0;
    }

    const orderCodes = orders.map(order => order.order_code);

    const claimSql = `SELECT * FROM product_order_claim WHERE order_code IN (?)`;
    const [claims] = await db.query(claimSql, [orderCodes]);

    const claimMap = {};
    claims.forEach(claim => {
        claimMap[claim.order_code] = claim;
    });

    let totalPrice = 0;
    orders.forEach(order => {
        let price = order.total_product_price || 0;
        const claim = claimMap[order.order_code];

        if (claim && claim.claim_type === 'REFUND' && claim.claim_status === 'COMPLETED') {
            price = price - (claim.total_product_amount || 0);
        }

        totalPrice += price;
    });

    return totalPrice;
}

export const getUserProductOrderList = async (user_code) => {
    const sql = `SELECT * FROM product_order WHERE user_code = ? ORDER BY created_at DESC`;
    const [orders] = await db.query(sql, [user_code]);

    if (!orders || orders.length === 0) {
        return [];
    }

    const orderCodes = orders.map(order => order.order_code);

    const itemSql = `
        SELECT 
            poi.*,
            pi.url AS product_image_url
        FROM product_order_item poi
        LEFT JOIN product_image pi ON poi.product_code = pi.product_code AND pi.is_main = 1
        WHERE poi.order_code IN (?)
    `;
    const [items] = await db.query(itemSql, [orderCodes]);

    const claimSql = `SELECT * FROM product_order_claim WHERE order_code IN (?)`;
    const [claims] = await db.query(claimSql, [orderCodes]);

    const paymentSql = `SELECT * FROM product_order_payment WHERE order_code IN (?)`;
    const [payments] = await db.query(paymentSql, [orderCodes]);

    return orders.map(order => {
        const orderItems = items.filter(item => item.order_code === order.order_code);
        const orderClaims = claims.filter(claim => claim.order_code === order.order_code);
        const orderPayments = payments.filter(payment => payment.order_code === order.order_code);

        return {
            ...order,
            product_order_items: orderItems,
            product_order_claims: orderClaims,
            product_order_payment: orderPayments[0]
        };
    });
}

export const getUserReviewChannelList = async (user_code) => {
    const sql = `SELECT * FROM user_review_channel WHERE user_code = ? AND deleted = 0`;
    const [rows] = await db.query(sql, [user_code]);
    return rows;
}

export const getUserProductOrderBasketList = async (user_code) => {
    const sql = `
        SELECT 
            pb.*,
            pi.url AS product_image_url,
            p.name AS product_name,
            p.price AS product_price,
            p.stock AS product_stock,
            p.is_unlimited_stock,
            p.is_sale,
            po.name AS option_name,
            po.value AS option_value,
            po.stock AS option_stock
        FROM product_order_basket pb
        LEFT JOIN product_image pi ON pb.product_code = pi.product_code AND pi.is_main = 1
        LEFT JOIN product p ON pb.product_code = p.product_code
        LEFT JOIN product_option po ON pb.product_option_code = po.product_option_code
        WHERE pb.user_code = ?
        ORDER BY pb.created_at DESC`;
    const [rows] = await db.query(sql, [user_code]);
    return rows;
}

export const getUserReviewCampaignList = async (user_code) => {
    const sql = `SELECT 
        rca.*,
        rc.title AS campaign_title
    FROM review_campaign_application rca
    LEFT JOIN review_campaign rc ON rca.campaign_code = rc.campaign_code
    WHERE rca.user_code = ?
    ORDER BY rca.created_at DESC`;
    const [rows] = await db.query(sql, [user_code]);
    return rows;
}

export const getUserProductReviewList = async (user_code) => {
    const sql = `SELECT * FROM product_review WHERE user_code = ? ORDER BY created_at DESC`;
    const [rows] = await db.query(sql, [user_code]);
    return rows;
}

export const getUserProductInquiryList = async (user_code) => {
    const sql = `SELECT * FROM product_inquiry WHERE user_code = ? ORDER BY created_at DESC`;
    const [rows] = await db.query(sql, [user_code]);
    return rows;
}