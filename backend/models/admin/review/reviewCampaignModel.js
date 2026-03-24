import db from '../../../config/db.js';

export const insertReviewCampaign = async (data) => {
    const sql = `
    INSERT INTO review_campaign (campaign_code, title, user_code, campaign_category_id, campaign_type, max_applicants, 
    main_image, content, start_application_date, end_application_date, start_write_date, end_write_date, is_display) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    const [rows] = await db.query(sql,
        [data.campaign_code, data.title, data.user_code, data.campaign_category_id, data.campaign_type, data.max_applicants,
        data.main_image, data.content, data.start_application_date, data.end_application_date, data.start_write_date,
        data.end_write_date, data.is_display]
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
    const sql = `
    INSERT INTO review_campaign_mission (campaign_code, title_guide, content_guide, hashtags, mandatory_keyword, optional_keyword, 
    min_photo_count, min_text_length) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    const [rows] = await db.query(sql,
        [data.campaign_code, data.title_guide, data.content_guide, data.hashtags, data.mandatory_keyword,
        data.optional_keyword, data.min_photo_count, data.min_text_length]
    );
    return rows;
}

export const insertReviewCampaignReward = async (data) => {
    const sql = `INSERT INTO review_campaign_reward (campaign_code, reward_type, name, description, value, quantity) VALUES (?, ?, ?, ?, ?, ?)`
    const [rows] = await db.query(sql, [data.campaign_code, data.reward_type, data.name, data.description, data.value, data.quantity]);
    return rows;
}

export const insertReviewCampaignRewardOption = async (data) => {
    const sql = `INSERT INTO review_campaign_reward_option (reward_id, option_name, option_value) VALUES (?, ?, ?)`
    const [rows] = await db.query(sql, [data.reward_id, data.option_name, data.option_value]);
    return rows;
}

export const getReviewCampaignList = async () => {
    const sql = `SELECT * FROM review_campaign`;
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