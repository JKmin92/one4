import db from '../../../config/db.js';

export const getDeliverySetting = async () => {
    const [rows] = await db.query(`SELECT * FROM shop_delivery_setting WHERE id=1`);
    return rows[0];
}

export const updateDeliverySetting = async (setting) => {
    const sql = `UPDATE shop_delivery_setting SET day_delivery_time = ?, day_delivery_impassable = ?, delivery_method = ?, basic_delivery_price = ?, order_standard = ?, island_price = ? WHERE id = 1`;
    const [rows] = await db.query(sql, [setting.day_delivery_time, JSON.stringify(setting.day_delivery_impassable), setting.delivery_method, setting.basic_delivery_price, setting.order_standard, setting.island_price]);
    return rows;
}

export const getAccountList = async () => {
    const [rows] = await db.query(`SELECT * FROM shop_account ORDER BY \`order\` ASC`);
    return rows;
}

export const getAccount = async (account_code) => {
    const [rows] = await db.query(`SELECT * FROM shop_account WHERE account_code = ?`, [account_code]);
    return rows[0];
}

export const updateAccount = async (account) => {
    const sql = `UPDATE shop_account SET bank = ?, account_number = ?, account_holder = ?, is_active = ? WHERE account_code = ?`;
    const [rows] = await db.query(sql, [account.bank, account.account_number, account.account_holder, account.is_active, account.account_code]);
    return rows;
}

export const insertAccount = async (account) => {
    const [countRows] = await db.query(`SELECT COUNT(*) AS count FROM shop_account`);
    const nextOrder = (countRows[0]?.count || 0) + 1;
    const sql = `INSERT INTO shop_account (account_code, bank, account_number, account_holder, is_active, \`order\`) VALUES (?, ?, ?, ?, ?, ?)`;
    const [rows] = await db.query(sql, [account.account_code, account.bank, account.account_number, account.account_holder, account.is_active, nextOrder]);
    return rows;
}

export const deleteAccount = async (account_code) => {
    const [rows] = await db.query(`DELETE FROM shop_account WHERE account_code = ?`, [account_code]);
    return rows;
}

export const updateAccountOrder = async (orders) => {

    const sql = `UPDATE shop_account SET \`order\` = ? WHERE account_code = ?`;
    for (const item of orders) {
        const [rows] = await db.query(sql, [item.order, item.account_code]);
    }
    return { success: true };
}

export const getShopOrderSetting = async () => {
    const [rows] = await db.query(`SELECT * FROM shop_order_setting WHERE id=1`);
    return rows[0];
}

export const updateShopOrderSetting = async (setting) => {
    const sql = `UPDATE shop_order_setting SET bank_auto_cancel_days = ?, order_auto_complete_days = ? WHERE id = 1`;
    const [rows] = await db.query(sql, [setting.bank_auto_cancel_days, setting.order_auto_complete_days]);
    return rows;
}