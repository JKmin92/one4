import pool from "../config/db.js";
import { v4 as uuidv4 } from 'uuid';

export const getNotificationList = async (user_code) => {
    const sql = `
        SELECT * FROM user_notification 
        WHERE user_code = ? 
        ORDER BY created_at DESC
    `;
    const [rows] = await pool.query(sql, [user_code]);
    return rows;
}

export const readNotification = async (notification_code, user_code) => {
    const sql = `
        UPDATE user_notification 
        SET is_read = TRUE 
        WHERE notification_code = ? AND user_code = ?
    `;
    const [result] = await pool.query(sql, [notification_code, user_code]);
    return result.affectedRows > 0;
}

export const readAllNotifications = async (user_code) => {
    const sql = `
        UPDATE user_notification 
        SET is_read = TRUE 
        WHERE user_code = ?
    `;
    const [result] = await pool.query(sql, [user_code]);
    return result.affectedRows > 0;
}

export const insertNotification = async (user_code, type, message, link = null) => {
    const notification_code = uuidv4();
    const sql = `
        INSERT INTO user_notification (notification_code, user_code, type, message, link)
        VALUES (?, ?, ?, ?, ?)
    `;
    await pool.query(sql, [notification_code, user_code, type, message, link]);
}
