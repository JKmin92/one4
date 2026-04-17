import db from '../config/db.js';

export const insertUser = async (data) => {
    await db.query(
        `INSERT INTO user (user_code, email, name, phone, password, marketingAgree) VALUES (?,?,?,?,?,?)`,
        [data.user_code, data.email, data.name, data.phone, data.password, data.marketingAgree]
    );

    const [rows] = await db.query(`SELECT user_code, email, name, phone, marketingAgree FROM user WHERE user_code=?`, [data.user_code]);
    return rows[0];
}

export const login = async ({ email }) => {
    const [rows] = await db.query(`SELECT user_code, email, name, password, marketingAgree, profile, role, status FROM user WHERE email = ? AND status != 'WITHDRAW'`, [email]);
    if (rows[0]) await db.query(`UPDATE user SET last_login_at = NOW() WHERE user_code = ?`, [rows[0].user_code]);
    return rows[0];
}

export const existsUserCode = async (user_code) => {
    const [rows] = await db.query(`SELECT 1 FROM user WHERE user_code = ? AND status != 'WITHDRAW' LIMIT 1`, [user_code]);
    return rows.length > 0;
}

export const existsEmail = async (email) => {
    const [rows] = await db.query(`SELECT 1 FROM user WHERE email = ? AND status != 'WITHDRAW' LIMIT 1`, [email]);
    return rows.length > 0;
}

export const getUserProfile = async (user_code) => {
    const [rows] = await db.query(`SELECT user_code, email, name, phone, marketingAgree, profile, role, status FROM user WHERE user_code = ? AND status != 'WITHDRAW'`, [user_code]);
    return rows[0];
}

export const getUserAddress = async (user_code) => {
    const [rows] = await db.query(`SELECT * FROM user_address WHERE user_code = ? AND deleted != 1`, [user_code]);
    return rows;
}

export const insertUserAddress = async (user_address) => {
    await db.query(
        `INSERT INTO user_address (user_code, address_code, name, postcode, address, detailAddress, phone, isDefault) VALUES (?,?,?,?,?,?,?,?)`,
        [user_address.user_code, user_address.address_code, user_address.name, user_address.postcode, user_address.address, user_address.detailAddress, user_address.phone, user_address.isDefault]
    );
}

export const updateUserAddress = async (user_address) => {
    if (user_address.isDefault) {
        await db.query(`UPDATE user_address SET isDefault = 0 WHERE user_code = ?`, [user_address.user_code]);
    }

    const sql = `
    UPDATE user_address 
    SET name = ?, postcode = ?, address = ?, detailAddress = ?, phone = ?, isDefault = ? 
    WHERE address_code = ? and user_code = ?`;
    await db.query(sql,
        [
            user_address.name,
            user_address.postcode,
            user_address.address,
            user_address.detailAddress,
            user_address.phone,
            user_address.isDefault,
            user_address.address_code,
            user_address.user_code
        ]);
}

export const deleteUserAddress = async (address_code, user_code) => {
    await db.query(`UPDATE user_address SET deleted = 1 WHERE address_code = ? and user_code = ?`, [address_code, user_code]);
}

export const getUserReviewChannelList = async (user_code) => {
    const [rows] = await db.query(`SELECT * FROM user_review_channel WHERE user_code = ? AND deleted != 1`, [user_code]);
    return rows;
}

export const getUserReviewChannel = async (user_code, review_channel_code) => {
    const [rows] = await db.query(`SELECT * FROM user_review_channel WHERE user_code = ? AND review_channel_code = ? AND deleted != 1`, [user_code, review_channel_code]);
    return rows[0];
}

export const insertUserReviewChannel = async (user_review_channel) => {
    const sql = `
        INSERT INTO user_review_channel (review_channel_code, channel_code, user_code, channel_url, meta_title, meta_description, meta_image) VALUE (?, ?, ?, ?, ?, ?, ?)
    `
    await db.query(sql, [user_review_channel.review_channel_code, user_review_channel.channel_code, user_review_channel.user_code, user_review_channel.channel_url, user_review_channel.meta_title, user_review_channel.meta_description, user_review_channel.meta_image]);

    const [rows] = await db.query(`SELECT * FROM user_review_channel WHERE review_channel_code = ?`, [user_review_channel.review_channel_code]);
    return rows[0];
}

export const deleteUserReviewChannel = async (review_channel_code, user_code) => {
    await db.query(`UPDATE user_review_channel SET deleted = 1 WHERE review_channel_code = ? AND user_code = ?`, [review_channel_code, user_code]);
}

export const updateUserReviewChannel = async (user_review_channel) => {
    const sql = `
        UPDATE user_review_channel SET channel_code = ?, channel_url = ?, meta_title = ?, meta_description = ?, meta_image = ? WHERE review_channel_code = ? AND user_code = ?
    `
    await db.query(sql, [user_review_channel.channel_code, user_review_channel.channel_url, user_review_channel.meta_title, user_review_channel.meta_description, user_review_channel.meta_image, user_review_channel.review_channel_code, user_review_channel.user_code]);

    const [rows] = await db.query(`SELECT * FROM user_review_channel WHERE review_channel_code = ?`, [user_review_channel.review_channel_code]);
    return rows[0];
}

