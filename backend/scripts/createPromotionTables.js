import db from '../config/db.js';

const createTables = async () => {
    try {
        const createPromotionTable = `
            CREATE TABLE IF NOT EXISTS promotion (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                code VARCHAR(50),
                discount_type ENUM('percentage', 'fixed') NOT NULL DEFAULT 'percentage',
                discount_value DECIMAL(10, 2) NOT NULL,
                start_date DATETIME NOT NULL,
                end_date DATETIME NOT NULL,
                min_order_amount DECIMAL(10, 2) DEFAULT NULL,
                max_discount_amount DECIMAL(10, 2) DEFAULT NULL,
                usage_limit INT DEFAULT NULL,
                description TEXT,
                is_active BOOLEAN DEFAULT TRUE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `;

        const createPromotionTargetTable = `
            CREATE TABLE IF NOT EXISTS promotion_target (
                id INT AUTO_INCREMENT PRIMARY KEY,
                promotion_id INT NOT NULL,
                target_type ENUM('all', 'category', 'product') NOT NULL,
                target_id INT DEFAULT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (promotion_id) REFERENCES promotion(id) ON DELETE CASCADE
            )
        `;

        await db.query(createPromotionTable);
        console.log('Promotion table created or already exists.');

        await db.query(createPromotionTargetTable);
        console.log('Promotion target table created or already exists.');

        process.exit(0);
    } catch (error) {
        console.error('Error creating tables:', error);
        process.exit(1);
    }
};

createTables();
