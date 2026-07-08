import db from './backend/config/db.js';
import * as reviewCampaignModel from './backend/models/review/reviewCampaignModel.js';

async function testSync() {
    try {
        const [users] = await db.query('SELECT user_code FROM user LIMIT 1');
        const [campaigns] = await db.query('SELECT campaign_code FROM review_campaign LIMIT 2');
        
        if (users.length > 0 && campaigns.length > 0) {
            const user_code = users[0].user_code;
            const campaign_codes = campaigns.map(c => c.campaign_code);
            
            console.log(`Syncing: user_code=${user_code}, codes=${campaign_codes}`);
            
            await reviewCampaignModel.syncCampaignViewLog(user_code, campaign_codes);
            console.log('Sync successful!');
            
            const [logs] = await db.query('SELECT * FROM review_campaign_view_log');
            console.log('Logs after sync:', logs);
        } else {
            console.log('No user or campaign found.');
        }
    } catch (error) {
        console.error('Error during sync test:', error);
    }
    process.exit(0);
}

testSync();
