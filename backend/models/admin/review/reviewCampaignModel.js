import db from '../../../config/db.js';

export const insertReviewCampaign = async (data) => {
    const sql = `
    INSERT INTO review_campaign (campaign_code, title, short_description, product_name, user_code, campaign_category_id, campaign_type, max_applicants, 
    main_image, detail_images, content, start_application_date, end_application_date, reviewer_selection_date, start_write_date, end_write_date, is_display, state) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    const [rows] = await db.query(sql,
        [data.campaign_code, data.title, data.short_description, data.product_name, data.user_code, data.campaign_category_id, data.campaign_type, data.max_applicants,
        data.main_image, data.detail_images, data.content, data.start_application_date, data.end_application_date, data.reviewer_selection_date, data.start_write_date,
        data.end_write_date, data.is_display, data.state || 'PENDING']
    );

    if (rows.affectedRows > 0) return data.campaign_code;
    return null;
}

export const insertReviewCampaignChannel = async (data) => {
    const sql = `INSERT INTO review_campaign_channel (campaign_code, channel_code) VALUES (?, ?)`
    const [rows] = await db.query(sql, [data.campaign_code, data.channel_code]);
    return rows;
}

export const insertReviewCampaignMission = async (data) => {
    const sql = `INSERT INTO review_campaign_mission (campaign_code, title_guide, content_guide, hashtags, mandatory_keyword, optional_keyword, 
    min_photo_count, min_text_length) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const [rows] = await db.query(sql,
        [data.campaign_code, data.title_guide, data.content_guide, data.hashtags, data.mandatory_keyword,
        data.optional_keyword, data.min_photo_count, data.min_text_length]
    );
    return rows;
}

export const insertReviewCampaignReward = async (data) => {
    const sql = `INSERT INTO review_campaign_reward (campaign_code, reward_code, reward_type, name, description, value, quantity) VALUES (?, ?, ?, ?, ?, ?, ?)`
    const [rows] = await db.query(sql, [data.campaign_code, data.reward_code, data.reward_type, data.name, data.description, data.value, data.quantity]);

    if (rows.affectedRows > 0) return rows.insertId;
    return null;
}

export const insertReviewCampaignRewardOption = async (data) => {
    const sql = `INSERT INTO review_campaign_reward_option (reward_code, reward_option_code, option_name, option_value) VALUES (?, ?, ?, ?)`
    const [rows] = await db.query(sql, [data.reward_code, data.reward_option_code, data.option_name, data.option_value]);
    return rows;
}

export const updateReviewCampaign = async (data) => {
    let sql;
    let params;

    // Check if main_image is defined in data
    if (data.main_image) {
        sql = `
        UPDATE review_campaign SET 
            title = ?, short_description = ?, product_name = ?, campaign_category_id = ?, campaign_type = ?, max_applicants = ?, 
            main_image = ?, detail_images = ?, content = ?, start_application_date = ?, end_application_date = ?, reviewer_selection_date = ?, start_write_date = ?, end_write_date = ?, is_display = ?, state = ?
        WHERE campaign_code = ?`;
        params = [data.title, data.short_description, data.product_name, data.campaign_category_id, data.campaign_type, data.max_applicants, data.main_image, data.detail_images, data.content, data.start_application_date, data.end_application_date, data.reviewer_selection_date, data.start_write_date, data.end_write_date, data.is_display, data.state || 'PENDING', data.campaign_code];
    } else {
        sql = `
        UPDATE review_campaign SET 
            title = ?, short_description = ?, product_name = ?, campaign_category_id = ?, campaign_type = ?, max_applicants = ?, 
            detail_images = ?, content = ?, start_application_date = ?, end_application_date = ?, reviewer_selection_date = ?, start_write_date = ?, end_write_date = ?, is_display = ?, state = ?
        WHERE campaign_code = ?`;
        params = [data.title, data.short_description, data.product_name, data.campaign_category_id, data.campaign_type, data.max_applicants, data.detail_images, data.content, data.start_application_date, data.end_application_date, data.reviewer_selection_date, data.start_write_date, data.end_write_date, data.is_display, data.state || 'PENDING', data.campaign_code];
    }
    const [rows] = await db.query(sql, params);
    return rows;
}

export const updateReviewCampaignMission = async (data) => {
    const sql = `
    UPDATE review_campaign_mission SET 
        title_guide = ?, content_guide = ?, hashtags = ?, mandatory_keyword = ?, optional_keyword = ?, 
        min_photo_count = ?, min_text_length = ?
    WHERE campaign_code = ?`;
    const [rows] = await db.query(sql, [data.title_guide, data.content_guide, data.hashtags, data.mandatory_keyword, data.optional_keyword, data.min_photo_count, data.min_text_length, data.campaign_code]);
    return rows;
}

export const deleteReviewCampaignChannels = async (campaign_code) => {
    const sql = `DELETE FROM review_campaign_channel WHERE campaign_code = ?`;
    const [rows] = await db.query(sql, [campaign_code]);
    return rows;
}

export const deleteReviewCampaignRewardOptions = async (campaign_code) => {
    const sql = `DELETE FROM review_campaign_reward_option WHERE reward_code IN (SELECT reward_code FROM review_campaign_reward WHERE campaign_code = ?)`;
    const [rows] = await db.query(sql, [campaign_code]);
    return rows;
}

export const deleteReviewCampaignRewards = async (campaign_code) => {
    const sql = `DELETE FROM review_campaign_reward WHERE campaign_code = ?`;
    const [rows] = await db.query(sql, [campaign_code]);
    return rows;
}

export const getReviewCampaignList = async () => {
    const updateSql = `
        UPDATE review_campaign
        SET state = CASE
            WHEN NOW() >= start_write_date THEN 'REVIEWING'
            WHEN CURDATE() < DATE(start_application_date) THEN 'SCHEDULED'
            WHEN CURDATE() >= DATE(start_application_date) AND CURDATE() <= DATE(end_application_date) THEN 'RECRUITING'
            WHEN CURDATE() > DATE(end_application_date) THEN 'SELECTING'
            ELSE state
        END
        WHERE is_display = 1 
          AND state IN ('PENDING', 'SCHEDULED', 'RECRUITING', 'SELECTING')
    `;
    await db.query(updateSql);

    const sql = `
        SELECT 
            rc.*,
            (SELECT COUNT(*) FROM review_campaign_application rca WHERE rca.campaign_code = rc.campaign_code) AS application_count,
            (SELECT GROUP_CONCAT(rcc.channel_code) FROM review_campaign_channel rcc WHERE rcc.campaign_code = rc.campaign_code) AS channels
        FROM review_campaign rc
        ORDER BY rc.created_at DESC
    `;
    const [rows] = await db.query(sql);

    return rows.map(row => ({
        ...row,
        channels: row.channels ? row.channels.split(',') : []
    }));
}

export const getDraftReviewCampaigns = async () => {
    const sql = `
        SELECT campaign_code, title, state, created_at, updated_at
        FROM review_campaign
        WHERE state = 'DRAFT'
        ORDER BY updated_at DESC
    `;
    const [rows] = await db.query(sql);
    return rows;
}

export const getReviewCampaignCategory = async () => {
    const sql = `SELECT * FROM review_campaign_category`;
    const [rows] = await db.query(sql);
    return rows;
}

export const getReviewCampaignChannelView = async () => {
    const sql = `SELECT * FROM review_campaign_channel_view`;
    const [rows] = await db.query(sql);
    return rows;
}

export const getReviewCampaign = async (campaign_code) => {
    const updateSql = `
        UPDATE review_campaign
        SET state = CASE
            WHEN NOW() >= start_write_date THEN 'REVIEWING'
            WHEN CURDATE() < DATE(start_application_date) THEN 'SCHEDULED'
            WHEN CURDATE() >= DATE(start_application_date) AND CURDATE() <= DATE(end_application_date) THEN 'RECRUITING'
            WHEN CURDATE() > DATE(end_application_date) THEN 'SELECTING'
            ELSE state
        END
        WHERE is_display = 1 
          AND state IN ('PENDING', 'SCHEDULED', 'RECRUITING', 'SELECTING')
          AND campaign_code = ?
    `;
    await db.query(updateSql, [campaign_code]);

    const sql = `SELECT * FROM review_campaign WHERE campaign_code = ?`;
    const [rows] = await db.query(sql, [campaign_code]);

    if (rows.length === 0) return null;

    const campaign = rows[0];

    const [applications] = await db.query(`SELECT COUNT(*) as application_count FROM review_campaign_application WHERE campaign_code = ? AND status != 'CANCELLED'`, [campaign_code]);
    campaign.application_count = applications[0].application_count;

    const [channels] = await db.query(`SELECT * FROM review_campaign_channel WHERE campaign_code = ?`, [campaign_code]);
    campaign.channels = channels;

    const [missions] = await db.query(`SELECT * FROM review_campaign_mission WHERE campaign_code = ?`, [campaign_code]);
    campaign.mission = missions[0] || null;

    const [rewards] = await db.query(`SELECT * FROM review_campaign_reward WHERE campaign_code = ?`, [campaign_code]);

    for (const reward of rewards) {
        const [options] = await db.query(`SELECT * FROM review_campaign_reward_option WHERE reward_code = ?`, [reward.reward_code]);
        reward.reward_options = options;
    }
    campaign.rewards = rewards;

    return campaign;
}

export const getReviewCampaignApplicationList = async (campaign_code) => {
    const sql = `
        SELECT * FROM 
        review_campaign_application 
        WHERE campaign_code = ?`;
    const [applications] = await db.query(sql, [campaign_code]);

    for (const application of applications) {
        const [channels] = await db.query(`
            SELECT rcac.*, urc.*
            FROM review_campaign_application_channel rcac
            LEFT JOIN user_review_channel urc ON rcac.review_channel_code = urc.review_channel_code
            WHERE rcac.campaign_application_code = ?
        `, [application.campaign_application_code]);
        application.channels = channels;

        const [rewardOptions] = await db.query(`
            SELECT * FROM review_campaign_application_reward_option 
            WHERE campaign_application_code = ?
        `, [application.campaign_application_code]);
        application.reward_options = rewardOptions;

        const [post] = await db.query(`
            SELECT * FROM review_campaign_post 
            WHERE campaign_application_code = ?
        `, [application.campaign_application_code]);
        application.postList = post || [];
    }

    return applications;
}

export const selectReviewCampaignApplication = async (campaign_application_code) => {
    const sql = `UPDATE review_campaign_application SET status = 'SELECTED' WHERE campaign_application_code = ?`;
    const [rows] = await db.query(sql, [campaign_application_code]);

    const checkSql = `
        SELECT rc.campaign_code, rc.max_applicants, 
               (SELECT COUNT(*) FROM review_campaign_application rca WHERE rca.campaign_code = rc.campaign_code AND rca.status = 'SELECTED') as selected_count
        FROM review_campaign_application app
        JOIN review_campaign rc ON app.campaign_code = rc.campaign_code
        WHERE app.campaign_application_code = ?
    `;
    const [checkRows] = await db.query(checkSql, [campaign_application_code]);

    if (checkRows.length > 0) {
        const { campaign_code, max_applicants, selected_count } = checkRows[0];
        if (selected_count >= max_applicants) {
            await db.query(`UPDATE review_campaign SET state = 'REVIEWING' WHERE campaign_code = ?`, [campaign_code]);
        }
    }

    return rows;
}

export const getUserAddress = async (address_code) => {
    const sql = `SELECT * FROM user_address WHERE address_code = ?`;
    const [rows] = await db.query(sql, [address_code]);
    return rows;
}

export const insertReviewCampaignApplicationDelivery = async (data) => {
    const sql = `INSERT INTO review_campaign_application_delivery (campaign_application_delivery_code, campaign_application_code, courier, tracking_number) VALUES (?, ?, ?, ?)`;
    const [rows] = await db.query(sql, [data.campaign_application_delivery_code, data.campaign_application_code, data.courier, data.tracking_number]);
    return rows;
}

export const updateReviewCampaignApplicationDelivery = async (data) => {
    const sql = `UPDATE review_campaign_application_delivery SET courier = ?, tracking_number = ? WHERE campaign_application_delivery_code = ?`;
    const [rows] = await db.query(sql, [data.courier, data.tracking_number, data.campaign_application_delivery_code]);
    return rows;
}

export const getReviewCampaignApplicationDelivery = async (campaign_application_code) => {
    const sql = `SELECT * FROM review_campaign_application_delivery WHERE campaign_application_code = ?`;
    const [rows] = await db.query(sql, [campaign_application_code]);
    return rows[0];
}