import db from './config/db.js';

async function setup() {
    const sql = `
        CREATE TABLE IF NOT EXISTS user_recently_viewed (
            user_code VARCHAR(255) NOT NULL,
            product_code VARCHAR(255) NOT NULL,
            viewed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            dwell_time_seconds INT DEFAULT 0,
            time_to_cart_seconds INT DEFAULT NULL,
            time_to_buy_seconds INT DEFAULT NULL,
            PRIMARY KEY (user_code, product_code),
            INDEX idx_viewed_at (viewed_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    try {
        await db.query(sql);
        console.log('user_recently_viewed table created or already exists.');
    } catch (err) {
        console.error('Error creating table:', err);
    } finally {
        process.exit();
    }
}

setup();
