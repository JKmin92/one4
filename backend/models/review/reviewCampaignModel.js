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

