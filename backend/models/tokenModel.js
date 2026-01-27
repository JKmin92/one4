import db from '../config/db.js';

export const create = async (user_code, token, expiresAt) => {
    await db.query(`INSERT INTO refresh_tokens (user_code, token, expiresAT) VALUES (?, ?, ?)`, [user_code, token, expiresAt]);
}

export const selectToken = async (token) => {
    const [rows] = await db.query(`SELECT * FROM refresh_tokens WHERE token = ?`, [token]);
    return rows[0];
}

export const deleteToken = async (token) => {
    db.query(`DELETE FROM refresh_tokens WHERE token = ?`, [token]);
}