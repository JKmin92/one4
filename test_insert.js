import db from './backend/config/db.js';
import * as reviewCampaignModel from './backend/models/review/reviewCampaignModel.js';

async function testInsert() {
    try {
        const [users] = await db.query('SELECT user_code FROM user LIMIT 1');
        const [campaigns] = await db.query('SELECT campaign_code FROM review_campaign LIMIT 1');
        
        if (users.length > 0 && campaigns.length > 0) {
            const user_code = users[0].user_code;
            const campaign_code = campaigns[0].campaign_code;
            
            console.log(`Inserting: user_code=${user_code}, campaign_code=${campaign_code}`);
            
            await reviewCampaignModel.addCampaignViewLog(user_code, campaign_code);
            console.log('Insert successful!');
            
            const [logs] = await db.query('SELECT * FROM review_campaign_view_log');
            console.log('Logs after insert:', logs);
        } else {
            console.log('No user or campaign found to test with.');
        }
    } catch (error) {
        console.error('Error during insert test:', error);
    }
    process.exit(0);
}

testInsert();
