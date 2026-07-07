import db from "../../../config/db.js";

export const getManagerList = async () => {
    const sql = `SELECT * FROM user WHERE role IN ('ADMIN', 'SUPER_ADMIN') ORDER BY created_at DESC`;
    const [users] = await db.query(sql);
    return users;
};

export const getManagerByCode = async (user_code) => {
    const sql = `SELECT * FROM user WHERE user_code = ? AND role IN ('ADMIN', 'SUPER_ADMIN')`;
    const [rows] = await db.query(sql, [user_code]);
    return rows[0] || null;
};

export const existsEmail = async (email) => {
    const sql = `SELECT email FROM user WHERE email = ?`;
    const [rows] = await db.query(sql, [email]);
    return rows.length > 0;
};

export const existsUserCode = async (user_code) => {
    const sql = `SELECT user_code FROM user WHERE user_code = ?`;
    const [rows] = await db.query(sql, [user_code]);
    return rows.length > 0;
};

export const insertManager = async (data) => {
    const sql = `
        INSERT INTO user (user_code, email, password, name, phone, role, status)
        VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE')
    `;
    await db.query(sql, [data.user_code, data.email, data.password, data.name, data.phone, data.role]);
    return true;
};

export const updateManager = async (user_code, data) => {
    if (data.password) {
        const sql = `UPDATE user SET name = ?, phone = ?, role = ?, password = ? WHERE user_code = ?`;
        await db.query(sql, [data.name, data.phone, data.role, data.password, user_code]);
    } else {
        const sql = `UPDATE user SET name = ?, phone = ?, role = ? WHERE user_code = ?`;
        await db.query(sql, [data.name, data.phone, data.role, user_code]);
    }
    return true;
};
