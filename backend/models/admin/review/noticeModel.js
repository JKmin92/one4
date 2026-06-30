import db from '../../../config/db.js';

export const getNoticeList = async (limit, offset) => {
    let sql = `SELECT * FROM review_notice ORDER BY created_at DESC`;
    const params = [];

    if (limit) {
        sql += ` LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset || 0));
    }

    const [rows] = await db.query(sql, params);

    // Get total count
    const [countRows] = await db.query(`SELECT COUNT(*) as total FROM review_notice`);
    const total = countRows[0].total;

    return { notices: rows, total };
}

export const getNoticeById = async (notice_code) => {
    const [rows] = await db.query(`SELECT * FROM review_notice WHERE notice_code = ?`, [notice_code]);
    return rows[0];
}

export const insertNotice = async (data) => {
    const sql = `
        INSERT INTO review_notice (notice_code, title, content, is_active)
        VALUES (?, ?, ?, ?)
    `;
    await db.query(sql, [
        data.notice_code,
        data.title,
        data.content,
        data.is_active ? 1 : 0
    ]);
    return await getNoticeById(data.notice_code);
}

export const updateNotice = async (notice_code, data) => {
    const sql = `
        UPDATE review_notice 
        SET title = ?, content = ?, is_active = ?
        WHERE notice_code = ?
    `;
    await db.query(sql, [
        data.title,
        data.content,
        data.is_active ? 1 : 0,
        notice_code
    ]);
    return await getNoticeById(notice_code);
}

export const deleteNotice = async (notice_code) => {
    await db.query(`DELETE FROM review_notice WHERE notice_code = ?`, [notice_code]);
    return { success: true };
}

export const incrementViewCount = async (notice_code) => {
    await db.query(`UPDATE review_notice SET view_count = view_count + 1 WHERE notice_code = ?`, [notice_code]);
}

export const getActiveNotices = async (limit = 5) => {
    const sql = `
        SELECT notice_code, title, created_at, view_count 
        FROM review_notice 
        WHERE is_active = 1 
        ORDER BY created_at DESC 
        LIMIT ?
    `;
    const [rows] = await db.query(sql, [limit]);
    return rows;
}
