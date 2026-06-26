import db from './config/db.js';

async function fixSchema() {
    try {
        await db.query(`
            DELETE t1 FROM user_recently_viewed t1
            INNER JOIN user_recently_viewed t2 
            WHERE t1.id < t2.id 
            AND t1.user_code = t2.user_code 
            AND t1.product_code = t2.product_code
        `);
        await db.query(`
            ALTER TABLE user_recently_viewed 
            ADD UNIQUE INDEX uniq_user_product (user_code, product_code)
        `);
        console.log("Schema fixed!");
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
fixSchema();
