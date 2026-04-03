import db from "../../config/db.js";

export const getReviewCampaign = async (campaign_code) => {
    const sql = `SELECT rc.*,
            (SELECT COUNT(*) FROM review_campaign_application rca WHERE rca.campaign_code = rc.campaign_code) AS application_count
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
        const [options] = await db.query(`SELECT * FROM review_campaign_reward_option WHERE reward_id = ?`, [reward.id]);
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

export const getReviewCampaignList = async (category_id) => {
    // 1. 데이터를 가져오기 전 현재 시간에 맞춰 상태(state) 최신화 업데이트
    const updateSql = `
        UPDATE review_campaign
        SET state = CASE
            WHEN NOW() < start_application_date THEN 'SCHEDULED'
            WHEN NOW() >= start_application_date AND NOW() <= end_application_date THEN 'RECRUITING'
            WHEN NOW() > end_application_date THEN 'SELECTING'
            ELSE state
        END
        WHERE is_display = 1 
          AND state IN ('PENDING', 'SCHEDULED', 'RECRUITING', 'SELECTING')
    `;
    await db.query(updateSql);

    // 2. is_display = 1 이며 state = 'RECRUITING' 인 캠페인만 조회 (category_id 묶음 기준)
    const sql = `SELECT rc.*,
            (SELECT COUNT(*) FROM review_campaign_application rca WHERE rca.campaign_code = rc.campaign_code) AS application_count
            FROM review_campaign rc 
            WHERE (rc.campaign_category_id = ? 
               OR rc.campaign_category_id IN (SELECT id FROM review_campaign_category WHERE parent_id = ?))
              AND rc.is_display = 1 
              AND rc.state = 'RECRUITING'`;
    const [rows] = await db.query(sql, [category_id, category_id]);

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