import db from '../config/db.js';

export const insertUser = async ({data}) => {
    await db.query(
        `INSERT INTO user (user_code, email, name, phone, password, marketing) VALUES (?,?,?,?,?,?)`,
        [data.user_code, data.email, data.name, data.phone, data.password, data.marketing]
    );

    const [rows] = await db.query(`SELECT user_code, email, name, phone, marketing WHERE user_code`,[data.user_code]);
    return rows[0];
}

export const login = async({email, password}) => {
    const [rows] = await db.query(`SELECT user_code, email, nickName, marketingAgree, profile, role, status FROM user WHERE email = ? AND password = ? AND status != 'WITHDRAW'`, [email, password]);
    if(rows[0]) await db.query(`UPDATE user SET last_login_at = NOW() WHERE user_code = ?`, [rows[0].user_code]);
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