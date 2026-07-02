import * as notificationModel from '../models/notificationModel.js';

export const getNotificationList = async (req, res) => {
    try {
        const user_code = req.user.user_code; // authMiddleware assigns this
        const notifications = await notificationModel.getNotificationList(user_code);
        res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "서버 에러" });
    }
}

export const readNotification = async (req, res) => {
    try {
        const user_code = req.user.user_code;
        const notification_code = req.params.id;
        const success = await notificationModel.readNotification(notification_code, user_code);
        if (success) {
            res.status(200).json({ message: "읽음 처리 완료" });
        } else {
            res.status(404).json({ message: "알림을 찾을 수 없습니다." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "서버 에러" });
    }
}

export const readAllNotifications = async (req, res) => {
    try {
        const user_code = req.user.user_code;
        await notificationModel.readAllNotifications(user_code);
        res.status(200).json({ message: "전체 읽음 처리 완료" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "서버 에러" });
    }
}
