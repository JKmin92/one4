import db from "../../../config/db.js";

export const getUserList = async () => {
    const sql = `SELECT * FROM user WHERE role = 'USER' ORDER BY created_at DESC`;
    const [users] = await db.query(sql);

    if (users.length === 0) return [];

    const userCodes = users.map(user => user.user_code);
    const [channels] = await db.query(
        `SELECT * FROM user_review_channel WHERE user_code IN (?) AND deleted = 0`,
        [userCodes]
    );

    const channelMap = {};
    channels.forEach(channel => {
        if (!channelMap[channel.user_code]) {
            channelMap[channel.user_code] = [];
        }
        channelMap[channel.user_code].push(channel);
    });

    return users.map(user => ({
        ...user,
        review_channels: channelMap[user.user_code] || []
    }));
}