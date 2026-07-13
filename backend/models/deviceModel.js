import db from '../config/db.js';

export const createDevice = async (device_code, user_code, device_type, device_name, browser_info, ip_address) => {
    await db.query(
        `INSERT INTO device_info (device_code, user_code, device_type, device_name, browser_info, ip_address) 
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
         device_type = VALUES(device_type), 
         device_name = VALUES(device_name), 
         browser_info = VALUES(browser_info), 
         ip_address = VALUES(ip_address),
         updatedAt = CURRENT_TIMESTAMP`,
        [device_code, user_code, device_type, device_name, browser_info, ip_address]
    );
};

export const deleteDevice = async (device_code) => {
    await db.query(`DELETE FROM device_info WHERE device_code = ?`, [device_code]);
};
