import db from "../../../config/db.js";

export const insertPopup = async (data) => {
    const sql = `
        INSERT INTO popup (
            popup_code, title, image_url, link_url, is_new_tab, 
            is_visible, is_always_visible, start_time, end_time, target_service
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.query(sql, [
        data.popup_code, data.title, data.image_url, data.link_url, data.is_new_tab,
        data.is_visible, data.is_always_visible, data.start_time, data.end_time, data.target_service
    ]);
};

export const updatePopup = async (popup_code, data) => {
    let sql = `UPDATE popup SET title=?, link_url=?, is_new_tab=?, is_visible=?, is_always_visible=?, start_time=?, end_time=?, target_service=?`;
    const params = [
        data.title, data.link_url, data.is_new_tab, data.is_visible, 
        data.is_always_visible, data.start_time, data.end_time, data.target_service
    ];

    if (data.image_url) {
        sql += `, image_url=?`;
        params.push(data.image_url);
    }

    sql += ` WHERE popup_code=?`;
    params.push(popup_code);

    await db.query(sql, params);
};

export const deletePopup = async (popup_code) => {
    await db.query(`DELETE FROM popup WHERE popup_code = ?`, [popup_code]);
};

export const getPopupList = async () => {
    const [rows] = await db.query(`SELECT * FROM popup ORDER BY created_at DESC`);
    return rows;
};

export const getPopup = async (popup_code) => {
    const [rows] = await db.query(`SELECT * FROM popup WHERE popup_code = ?`, [popup_code]);
    return rows[0] || null;
};

// 퍼블릭(고객용) 팝업 조회 쿼리 (현재 시간 기준으로 유효한 팝업만)
export const getActivePopups = async (target) => {
    let sql = `
        SELECT * FROM popup 
        WHERE is_visible = 1 
        AND (
            is_always_visible = 1 
            OR (start_time <= NOW() AND end_time >= NOW())
        )
    `;
    const params = [];
    
    // 대상 서비스 필터링 (ALL은 항상 포함)
    if (target === 'shop') {
        sql += ` AND target_service IN ('ALL', 'SHOP')`;
    } else if (target === 'review') {
        sql += ` AND target_service IN ('ALL', 'REVIEW')`;
    }
    
    sql += ` ORDER BY created_at DESC`;
    
    const [rows] = await db.query(sql, params);
    return rows;
};
