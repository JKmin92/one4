import pool from '../config/db.js';

const runMigration = async () => {
    try {
        console.log('Creating device_info table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS device_info (
                device_code VARCHAR(50) PRIMARY KEY,
                user_code VARCHAR(50) NOT NULL,
                device_type ENUM('PC', 'MOBILE', 'TABLET', 'UNKNOWN') DEFAULT 'UNKNOWN',
                device_name VARCHAR(100),
                browser_info VARCHAR(100),
                ip_address VARCHAR(45),
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `);

        console.log('Altering refresh_tokens table...');
        // ignore errors if column already exists
        try {
            await pool.query(`ALTER TABLE refresh_tokens ADD COLUMN device_code VARCHAR(50) DEFAULT NULL;`);
            await pool.query(`ALTER TABLE refresh_tokens ADD CONSTRAINT fk_refresh_device FOREIGN KEY (device_code) REFERENCES device_info(device_code) ON DELETE CASCADE;`);
        } catch (e) {
            console.log('Alter table error (might already exist):', e.message);
        }

        console.log('Migration complete!');
        process.exit(0);
    } catch (e) {
        console.error('Migration failed:', e);
        process.exit(1);
    }
}

runMigration();
