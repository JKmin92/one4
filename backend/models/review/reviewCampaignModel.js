import db from "../../config/db.js";
import { generateUniqueId } from "../../utils/customUtils.js";

export const getReviewCampaign = async (campaign_code) => {
    const sql = `SELECT rc.*,
            (SELECT COUNT(*) FROM review_campaign_application rca WHERE rca.campaign_code = rc.campaign_code AND rca.status = 'APPLIED') AS application_count
            FROM review_campaign rc WHERE campaign_code = ?`;
    const [rows] = await db.query(sql, [campaign_code]);
    if (rows.length === 0) return null;

    const campaign = rows[0];

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

export const getReviewCampaignChannelView = async () => {
    const [rows] = await db.query(`SELECT * FROM review_campaign_channel_view`);
    return rows;
}

export const getReviewCategory = async () => {
    const [rows] = await db.query(`SELECT * FROM review_campaign_category`);
    return rows;
}

export const getReviewCampaignList = async (category_code) => {
    // 1. 데이터를 가져오기 전 현재 시간에 맞춰 상태(state) 최신화 업데이트
    const updateSql = `
        UPDATE review_campaign
        SET state = CASE
            WHEN CURDATE() < DATE(start_application_date) THEN 'SCHEDULED'
            WHEN CURDATE() >= DATE(start_application_date) AND CURDATE() <= DATE(end_application_date) THEN 'RECRUITING'
            WHEN CURDATE() > DATE(end_application_date) THEN 'SELECTING'
            ELSE state
        END
        WHERE is_display = 1 
          AND state IN ('PENDING', 'SCHEDULED', 'RECRUITING', 'SELECTING')
    `;
    await db.query(updateSql);

    // 2. is_display = 1 이며 state = 'RECRUITING' 인 캠페인만 조회 (category_code 묶음 기준)
    const sql = `SELECT rc.*,
            (SELECT COUNT(*) FROM review_campaign_application rca WHERE rca.campaign_code = rc.campaign_code AND rca.status = 'APPLIED') AS application_count
            FROM review_campaign rc 
            WHERE (rc.campaign_category_code = ? 
               OR rc.campaign_category_code IN (SELECT category_code FROM review_campaign_category WHERE parent_code = ?))
              AND rc.is_display = 1 
              AND rc.state = 'RECRUITING'`;
    const [rows] = await db.query(sql, [category_code, category_code]);

    if (rows.length === 0) return rows;

    const campaignCodes = rows.map(r => r.campaign_code);

    const rewardSql = `SELECT * FROM review_campaign_reward WHERE campaign_code IN (?)`;
    const [rewardRows] = await db.query(rewardSql, [campaignCodes]);

    const channelSql = `SELECT * FROM review_campaign_channel WHERE campaign_code IN (?)`;
    const [channelRows] = await db.query(channelSql, [campaignCodes]);

    return rows.map(campaign => ({
        ...campaign,
        rewards: rewardRows.filter(reward => reward.campaign_code === campaign.campaign_code),
        channels: channelRows.filter(channel => channel.campaign_code === campaign.campaign_code)
    }));
}

export const insertReviewCampaignApplication = async (data) => {
    const sql = `INSERT INTO review_campaign_application (campaign_code, user_code, address_code, campaign_application_code) VALUES (?, ?, ?, ?)`
    const [rows] = await db.query(sql, [data.campaign_code, data.user_code, data.address_code, data.campaign_application_code]);
    return data.campaign_application_code;
}

export const insertReviewCampaignApplicationRewardOption = async (data) => {
    const campaign_application_reward_option_code = generateUniqueId();
    const sql = `INSERT INTO review_campaign_application_reward_option (campaign_application_reward_option_code, campaign_application_code, reward_option_code, reward_option_value) VALUES (?, ?, ?, ?)`
    const [rows] = await db.query(sql, [campaign_application_reward_option_code, data.campaign_application_code, data.reward_option_code, data.reward_option_value]);
    return rows;
}

export const insertReviewCampaignApplicationChannel = async (data) => {
    const campaign_application_channel_code = generateUniqueId();
    const sql = `INSERT INTO review_campaign_application_channel (campaign_application_channel_code, campaign_application_code, review_channel_code) VALUES (?, ?, ?)`
    const [rows] = await db.query(sql, [campaign_application_channel_code, data.campaign_application_code, data.review_channel_code]);
    return rows;
}

export const insertUserAddress = async (user_address) => {
    await db.query(
        `INSERT INTO user_address (user_code, address_code, name, postcode, address, detailAddress, phone, isDefault) VALUES (?,?,?,?,?,?,?,?)`,
        [user_address.user_code, user_address.address_code, user_address.name, user_address.postcode, user_address.address, user_address.detailAddress, user_address.phone, user_address.isDefault]
    );
    return user_address.address_code;
}

export const getUserReviewCampaignApplicationList = async (user_code) => {
    const sql = `
        SELECT 
            rca.*, 
            rc.title,
            rc.main_image,
            rc.state as campaign_state,
            rc.campaign_type,
            rc.start_write_date,
            rc.end_write_date,
            rc.reviewer_selection_date
        FROM review_campaign_application rca
        JOIN review_campaign rc ON rca.campaign_code = rc.campaign_code
        WHERE rca.user_code = ?
    `;
    const [rows] = await db.query(sql, [user_code]);
    if (rows.length === 0) return [];

    const campaignCodes = [...new Set(rows.map(r => r.campaign_code))];
    const [channelRows] = await db.query(`SELECT * FROM review_campaign_channel WHERE campaign_code IN (?)`, [campaignCodes]);
    const [rewardRows] = await db.query(`SELECT * FROM review_campaign_reward WHERE campaign_code IN (?)`, [campaignCodes]);

    return rows.map(row => ({
        ...row,
        channels: channelRows.filter(channel => channel.campaign_code === row.campaign_code),
        rewards: rewardRows.filter(reward => reward.campaign_code === row.campaign_code)
    }));
}

export const getUserReviewCampaignApplication = async (campaign_application_code, user_code) => {
    const sql = `
        SELECT 
            rca.*, 
            rc.title,
            rc.short_description,
            rc.content,
            rc.main_image,
            rc.campaign_type,
            rc.state,
            rc.start_application_date,
            rc.end_application_date,
            rc.start_write_date,
            rc.end_write_date,
            rc.reviewer_selection_date,
            rc.product_name
        FROM review_campaign_application rca
        JOIN review_campaign rc ON rca.campaign_code = rc.campaign_code
        WHERE rca.campaign_application_code = ? AND rca.user_code = ?
    `;
    const [rows] = await db.query(sql, [campaign_application_code, user_code]);
    if (rows.length === 0) return null;

    const campaign = rows[0];

    const [channels] = await db.query(`SELECT * FROM review_campaign_application_channel WHERE campaign_application_code = ?`, [campaign.campaign_application_code]);
    campaign.channels = channels;

    const [missions] = await db.query(`SELECT * FROM review_campaign_mission WHERE campaign_code = ?`, [campaign.campaign_code]);
    campaign.mission = missions[0] || null;

    const [rewards] = await db.query(`SELECT * FROM review_campaign_reward WHERE campaign_code = ?`, [campaign.campaign_code]);

    for (const reward of rewards) {
        const [options] = await db.query(`SELECT * FROM review_campaign_reward_option WHERE reward_code = ?`, [reward.reward_code]);
        reward.reward_options = options;

        for (const reward_option of reward.reward_options) {
            const [selected_options] = await db.query(`SELECT * FROM review_campaign_application_reward_option WHERE reward_option_code = ? AND campaign_application_code = ?`, [reward_option.reward_option_code, campaign.campaign_application_code]);
            reward_option.selected_options = selected_options;
        }
    }

    campaign.rewards = rewards;



    return campaign;
}

export const updateUserReviewChannel = async (user_review_channel) => {
    const sql = `
        UPDATE user_review_channel SET channel_url = ?, meta_title = ?, meta_description = ?, meta_image = ? WHERE review_channel_code = ?
    `
    await db.query(sql, [user_review_channel.channel_url, user_review_channel.meta_title, user_review_channel.meta_description, user_review_channel.meta_image, user_review_channel.review_channel_code]);
    return user_review_channel.review_channel_code;
}

export const getUserReviewChannel = async (review_channel_code) => {
    const sql = `SELECT * FROM user_review_channel WHERE review_channel_code = ?`
    const [rows] = await db.query(sql, [review_channel_code]);
    return rows[0];
}

export const isReviewCampaignApplication = async (campaign_code, user_code) => {
    const sql = `SELECT campaign_application_code FROM review_campaign_application WHERE campaign_code = ? AND user_code = ? AND status != 'CANCELLED'`
    const [rows] = await db.query(sql, [campaign_code, user_code]);
    return rows[0];
}

export const getUserAddress = async (address_code, user_code) => {
    const sql = `SELECT * FROM user_address WHERE address_code = ? AND user_code = ?`
    const [rows] = await db.query(sql, [address_code, user_code]);
    return rows[0];
}

export const getReviewCampaignApplicationDelivery = async (campaign_application_code, user_code) => {
    const sql = `
        SELECT d.* 
        FROM review_campaign_application_delivery d
        JOIN review_campaign_application a ON d.campaign_application_code = a.campaign_application_code
        WHERE d.campaign_application_code = ? AND a.user_code = ?
    `;
    const [rows] = await db.query(sql, [campaign_application_code, user_code]);
    return rows[0];
}

export const insertReviewCampaignPost = async (data) => {
    const sql = `
        INSERT INTO review_campaign_post
        (campaign_post_code, campaign_application_code, user_code, post_url)
        VALUES (?, ?, ?, ?)
    `
    const [rows] = await db.query(sql, [data.campaign_post_code, data.campaign_application_code, data.user_code, data.post_url]);

    return rows[0];
}

export const updateReviewCampaignPost = async (data) => {
    const sql = `UPDATE review_campaign_post SET post_url = ? , status = 'RESUBMITTED' WHERE campaign_post_code = ? AND user_code = ?`;
    const [rows] = await db.query(sql, [data.post_url, data.campaign_post_code, data.user_code]);

    if (rows.affectedRows > 0) {
        const updateSql = `
            UPDATE review_campaign_application 
            SET status = 'SUBMITTED' 
            WHERE campaign_application_code = (SELECT campaign_application_code FROM review_campaign_post WHERE campaign_post_code = ?)
              AND user_code = ?
        `;
        await db.query(updateSql, [data.campaign_post_code, data.user_code]);
    }

    return data.campaign_post_code;
}

export const getReviewCampaignPost = async (campaign_application_code, user_code) => {
    const sql = `SELECT * FROM review_campaign_post WHERE campaign_application_code = ? AND user_code = ?`;
    const [rows] = await db.query(sql, [campaign_application_code, user_code]);
    return rows[0];
}

export const getReviewCampaignPostByCampaignPostCode = async (campaign_post_code) => {
    const sql = `SELECT * FROM review_campaign_post WHERE campaign_post_code = ?`;
    const [rows] = await db.query(sql, [campaign_post_code]);
    return rows[0];
}

export const submitReviewCampaignApplicationStatus = async (campaign_application_code, user_code) => {
    const sql = `UPDATE review_campaign_application SET status = 'SUBMITTED' WHERE campaign_application_code = ? AND user_code = ?`;
    await db.query(sql, [campaign_application_code, user_code]);
    return campaign_application_code;
}

export const getReviewCampaignFeedbackList = async (campaign_application_code, user_code) => {
    const sql = `
        SELECT f.* 
        FROM review_campaign_feedback f
        JOIN review_campaign_application a ON f.campaign_application_code = a.campaign_application_code
        WHERE f.campaign_application_code = ? AND a.user_code = ?
    `;
    const [rows] = await db.query(sql, [campaign_application_code, user_code]);
    return rows;
}

export const getReviewCampaignApplicationChannel = async (campaign_application_code, user_code) => {
    const sql = `
        SELECT rcac.*, urc.*
        FROM review_campaign_application_channel rcac
        JOIN user_review_channel urc ON rcac.review_channel_code = urc.review_channel_code
        WHERE rcac.campaign_application_code = ? AND urc.user_code = ?
    `;
    const [rows] = await db.query(sql, [campaign_application_code, user_code]);
    return rows;
}

export const deleteReviewCampaignApplication = async (campaign_application_code, user_code) => {
    const sql = `UPDATE review_campaign_application SET status = 'CANCELLED' WHERE campaign_application_code = ? AND user_code = ?`;
    await db.query(sql, [campaign_application_code, user_code]);
    return campaign_application_code;
}