import db from '../../../config/db.js';

export const getBannerList = async () => {
    const [rows] = await db.query(`SELECT * FROM review_banner ORDER BY sort_order ASC, created_at DESC`);
    return rows;
}

export const getBannerById = async (id) => {
    const [rows] = await db.query(`SELECT * FROM review_banner WHERE id = ?`, [id]);
    return rows[0];
}

export const insertBanner = async (data) => {
    const sql = `
        INSERT INTO review_banner (title, image_pc, image_mobile, image_tablet, link_url, is_always, start_date, end_date, is_active, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [
        data.title,
        data.image_pc,
        data.image_mobile || null,
        data.image_tablet || null,
        data.link_url || null,
        data.is_always ? 1 : 0,
        data.start_date || null,
        data.end_date || null,
        data.is_active ? 1 : 0,
        data.sort_order || 0
    ]);
    return await getBannerById(result.insertId);
}

export const updateBanner = async (id, data) => {
    let sql = `UPDATE review_banner SET title=?, link_url=?, is_always=?, start_date=?, end_date=?, is_active=?`;
    const params = [
        data.title,
        data.link_url || null,
        data.is_always ? 1 : 0,
        data.start_date || null,
        data.end_date || null,
        data.is_active ? 1 : 0
    ];

    if (data.image_pc) {
        sql += `, image_pc=?`;
        params.push(data.image_pc);
    }
    if (data.image_mobile !== undefined) {
        sql += `, image_mobile=?`;
        params.push(data.image_mobile || null);
    }
    if (data.image_tablet !== undefined) {
        sql += `, image_tablet=?`;
        params.push(data.image_tablet || null);
    }

    sql += ` WHERE id=?`;
    params.push(id);

    await db.query(sql, params);
    return await getBannerById(id);
}

export const deleteBanner = async (id) => {
    await db.query(`DELETE FROM review_banner WHERE id = ?`, [id]);
    return { success: true };
}

export const updateBannerOrder = async (orderList) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        for (const item of orderList) {
            await connection.query(`UPDATE review_banner SET sort_order = ? WHERE id = ?`, [item.sort_order, item.id]);
        }
        await connection.commit();
        return { success: true };
    } catch (e) {
        await connection.rollback();
        throw e;
    } finally {
        connection.release();
    }
}

export const getActiveBanners = async () => {
    const sql = `
        SELECT * FROM review_banner 
        WHERE is_active = 1 
        AND (is_always = 1 OR (NOW() BETWEEN start_date AND end_date))
        ORDER BY sort_order ASC, created_at DESC
    `;
    const [rows] = await db.query(sql);
    return rows;
}
