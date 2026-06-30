import db from './config/db.js';
import { generateUniqueId } from './utils/customUtils.js';

async function migrate() {
    try {
        console.log('Starting migration...');

        // 1. Create product_order_address
        await db.query(`
            CREATE TABLE IF NOT EXISTS product_order_address (
                order_address_code VARCHAR(255) PRIMARY KEY,
                order_code VARCHAR(255) NOT NULL,
                name VARCHAR(255),
                postcode VARCHAR(50),
                address VARCHAR(255),
                detailAddress VARCHAR(255),
                phone VARCHAR(50)
            )
        `);
        console.log('Created product_order_address table.');

        // 2. Create review_campaign_application_address
        await db.query(`
            CREATE TABLE IF NOT EXISTS review_campaign_application_address (
                application_address_code VARCHAR(255) PRIMARY KEY,
                campaign_application_code VARCHAR(255) NOT NULL,
                name VARCHAR(255),
                postcode VARCHAR(50),
                address VARCHAR(255),
                detailAddress VARCHAR(255),
                phone VARCHAR(50)
            )
        `);
        console.log('Created review_campaign_application_address table.');

        // 3. Migrate product_order data
        const [orders] = await db.query(`SELECT order_code, address_code FROM product_order`);
        for (const order of orders) {
            if (!order.address_code) continue;
            
            // Check if already migrated
            const [existing] = await db.query(`SELECT * FROM product_order_address WHERE order_code = ?`, [order.order_code]);
            if (existing.length > 0) continue;

            const [addresses] = await db.query(`SELECT * FROM user_address WHERE address_code = ?`, [order.address_code]);
            const address = addresses[0];
            if (address) {
                const newCode = generateUniqueId();
                await db.query(
                    `INSERT INTO product_order_address (order_address_code, order_code, name, postcode, address, detailAddress, phone) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [newCode, order.order_code, address.name, address.postcode, address.address, address.detailAddress, address.phone]
                );
            }
        }
        console.log(`Migrated ${orders.length} product orders.`);

        // 4. Migrate review_campaign_application data
        const [apps] = await db.query(`SELECT campaign_application_code, address_code FROM review_campaign_application`);
        for (const app of apps) {
            if (!app.address_code) continue;

            const [existing] = await db.query(`SELECT * FROM review_campaign_application_address WHERE campaign_application_code = ?`, [app.campaign_application_code]);
            if (existing.length > 0) continue;

            const [addresses] = await db.query(`SELECT * FROM user_address WHERE address_code = ?`, [app.address_code]);
            const address = addresses[0];
            if (address) {
                const newCode = generateUniqueId();
                await db.query(
                    `INSERT INTO review_campaign_application_address (application_address_code, campaign_application_code, name, postcode, address, detailAddress, phone) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [newCode, app.campaign_application_code, address.name, address.postcode, address.address, address.detailAddress, address.phone]
                );
            }
        }
        console.log(`Migrated ${apps.length} review applications.`);

        // 5. Drop old foreign keys (using TRY CATCH since they might have constraints or different environments)
        try {
            await db.query(`ALTER TABLE product_order DROP FOREIGN KEY product_order_ibfk_2`); // typical naming
        } catch(e) {}
        try {
            await db.query(`ALTER TABLE product_order DROP COLUMN address_code`);
            console.log('Dropped address_code from product_order.');
        } catch (err) {
            console.log('Could not drop address_code from product_order (maybe already dropped or has constraint):', err.message);
        }

        try {
            await db.query(`ALTER TABLE review_campaign_application DROP FOREIGN KEY review_campaign_application_ibfk_3`);
        } catch(e) {}
        try {
            await db.query(`ALTER TABLE review_campaign_application DROP COLUMN address_code`);
            console.log('Dropped address_code from review_campaign_application.');
        } catch (err) {
            console.log('Could not drop address_code from review_campaign_application:', err.message);
        }

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
