import db from './config/db.js';

async function dropFks() {
    try {
        // Find product_order FKs
        const [poRows] = await db.query(`
            SELECT CONSTRAINT_NAME 
            FROM information_schema.KEY_COLUMN_USAGE 
            WHERE TABLE_SCHEMA = DATABASE() 
              AND TABLE_NAME = 'product_order' 
              AND COLUMN_NAME = 'address_code' 
              AND REFERENCED_TABLE_NAME IS NOT NULL
        `);
        for (const row of poRows) {
            await db.query(`ALTER TABLE product_order DROP FOREIGN KEY ${row.CONSTRAINT_NAME}`);
            console.log(`Dropped FK ${row.CONSTRAINT_NAME} from product_order`);
        }
        await db.query(`ALTER TABLE product_order DROP COLUMN address_code`);
        console.log('Dropped address_code from product_order');

        // Find review_campaign_application FKs
        const [rcaRows] = await db.query(`
            SELECT CONSTRAINT_NAME 
            FROM information_schema.KEY_COLUMN_USAGE 
            WHERE TABLE_SCHEMA = DATABASE() 
              AND TABLE_NAME = 'review_campaign_application' 
              AND COLUMN_NAME = 'address_code' 
              AND REFERENCED_TABLE_NAME IS NOT NULL
        `);
        for (const row of rcaRows) {
            await db.query(`ALTER TABLE review_campaign_application DROP FOREIGN KEY ${row.CONSTRAINT_NAME}`);
            console.log(`Dropped FK ${row.CONSTRAINT_NAME} from review_campaign_application`);
        }
        await db.query(`ALTER TABLE review_campaign_application DROP COLUMN address_code`);
        console.log('Dropped address_code from review_campaign_application');

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

dropFks();
