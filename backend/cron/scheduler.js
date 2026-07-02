import cron from 'node-cron';
import pool from '../config/db.js';
import { insertNotification } from '../models/notificationModel.js';

export const initScheduler = () => {
    // 매일 오전 10시 실행
    cron.schedule('0 10 * * *', async () => {
        try {
            console.log('[Cron Job] Running review deadline check...');
            
            // 1. 종료일이 정확히 3일 남은 캠페인 
            const [upcomingUsers] = await pool.query(`
                SELECT rca.user_code, COUNT(*) as count 
                FROM review_campaign_application rca
                JOIN review_campaign rc ON rca.campaign_code = rc.campaign_code
                WHERE rca.status = 'SELECTED'
                AND DATEDIFF(rc.end_write_date, CURDATE()) = 3
                GROUP BY rca.user_code
            `);

            for (const user of upcomingUsers) {
                const message = user.count === 1 
                    ? `[리뷰기한 임박] 작성 기한이 3일 남은 리뷰 캠페인이 있습니다. 서둘러 작성해주세요!`
                    : `[리뷰기한 임박] 작성 기한이 3일 남은 리뷰 캠페인이 ${user.count}건 있습니다. 서둘러 작성해주세요!`;
                
                let link = '/mypage/review/list?tab=writing';
                if (user.count === 1) {
                    const [rows] = await pool.query(`
                        SELECT rca.campaign_application_code 
                        FROM review_campaign_application rca 
                        JOIN review_campaign rc ON rca.campaign_code = rc.campaign_code 
                        WHERE rca.status = 'SELECTED' 
                        AND DATEDIFF(rc.end_write_date, CURDATE()) = 3 
                        AND rca.user_code = ? 
                        LIMIT 1
                    `, [user.user_code]);
                    if (rows.length > 0) {
                        link = `/mypage/review/${rows[0].campaign_application_code}`;
                    }
                }
                
                await insertNotification(user.user_code, 'REVIEW', message, link);
            }

            // 2. 종료일이 이미 지난(초과) 캠페인
            const [overdueUsers] = await pool.query(`
                SELECT rca.user_code, COUNT(*) as count 
                FROM review_campaign_application rca
                JOIN review_campaign rc ON rca.campaign_code = rc.campaign_code
                WHERE rca.status = 'SELECTED'
                AND DATEDIFF(rc.end_write_date, CURDATE()) < 0
                GROUP BY rca.user_code
            `);

            for (const user of overdueUsers) {
                const message = user.count === 1 
                    ? `[작성기한 초과] 작성 기한이 지난 리뷰 캠페인이 있습니다. 미작성 패널티가 부과될 수 있습니다.`
                    : `[작성기한 초과] 작성 기한이 지난 리뷰 캠페인이 ${user.count}건 있습니다. 미작성 패널티가 부과될 수 있습니다.`;
                
                let link = '/mypage/review/list?tab=unwritten';
                if (user.count === 1) {
                    const [rows] = await pool.query(`
                        SELECT rca.campaign_application_code 
                        FROM review_campaign_application rca 
                        JOIN review_campaign rc ON rca.campaign_code = rc.campaign_code 
                        WHERE rca.status = 'SELECTED' 
                        AND DATEDIFF(rc.end_write_date, CURDATE()) < 0 
                        AND rca.user_code = ? 
                        LIMIT 1
                    `, [user.user_code]);
                    if (rows.length > 0) {
                        link = `/mypage/review/${rows[0].campaign_application_code}`;
                    }
                }
                
                await insertNotification(user.user_code, 'REVIEW', message, link);
            }

            console.log('[Cron Job] Review deadline check completed.');
        } catch (error) {
            console.error('[Cron Job Error]', error);
        }
    });
}
