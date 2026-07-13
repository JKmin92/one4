import db from '../config/db.js';

export const create = async (user_code, token, expiresAt, device_code = null) => {
    await db.query(`INSERT INTO refresh_tokens (user_code, token, expiresAT, device_code) VALUES (?, ?, ?, ?)`, [user_code, token, expiresAt, device_code]);
}

export const selectToken = async (token) => {
    const [rows] = await db.query(`SELECT * FROM refresh_tokens WHERE token = ?`, [token]);
    return rows[0];
}

export const deleteToken = async (tokenRecordOrString) => {
    const tokenValue = typeof tokenRecordOrString === 'string' ? tokenRecordOrString : tokenRecordOrString.token;
    
    const [rows] = await db.query(`SELECT device_code FROM refresh_tokens WHERE token = ?`, [tokenValue]);
    if (rows.length > 0 && rows[0].device_code) {
        await db.query(`DELETE FROM device_info WHERE device_code = ?`, [rows[0].device_code]);
    }
    await db.query(`DELETE FROM refresh_tokens WHERE token = ?`, [tokenValue]);
}

export const getUserSessions = async (user_code) => {
    const [rows] = await db.query(`
        SELECT r.token, r.expiresAt, r.createdAt, r.device_code,
               d.device_type, d.device_name, d.browser_info, d.ip_address
        FROM refresh_tokens r
        LEFT JOIN device_info d ON r.device_code = d.device_code
        WHERE r.user_code = ? AND r.expiresAt > NOW()
        ORDER BY r.createdAt DESC
    `, [user_code]);
    return rows;
}