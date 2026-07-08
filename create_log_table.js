import db from './backend/config/db.js';

async function run() {
    try {
        const [userCols] = await db.query("DESCRIBE user");
        const userCodeCol = userCols.find(c => c.Field === 'user_code');
        console.log('user_code type:', userCodeCol.Type);

        const [campaignCols] = await db.query("DESCRIBE review_campaign");
        const campaignCodeCol = campaignCols.find(c => c.Field === 'campaign_code');
        console.log('campaign_code type:', campaignCodeCol.Type);

        const sql = `
            CREATE TABLE IF NOT EXISTS review_campaign_view_log (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_code ${userCodeCol.Type} COLLATE utf8mb4_general_ci NOT NULL,
                campaign_code ${campaignCodeCol.Type} NOT NULL,
                viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY uk_user_campaign (user_code, campaign_code),
                FOREIGN KEY (user_code) REFERENCES user(user_code) ON DELETE CASCADE,
                FOREIGN KEY (campaign_code) REFERENCES review_campaign(campaign_code) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `;
        await db.query(sql);
        console.log('Created review_campaign_view_log table successfully.');
    } catch (e) {
        console.error('Error:', e);
    }
    process.exit();
}
run();
