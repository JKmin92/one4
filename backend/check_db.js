import db from './config/db.js';

async function check() {
    try {
        const [rows] = await db.query('DESCRIBE user_recently_viewed');
        console.log(JSON.stringify(rows, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

check();
