import express from 'express';
import * as notificationController from '../controllers/notificationController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, notificationController.getNotificationList);
router.put('/read-all', authMiddleware, notificationController.readAllNotifications);
router.put('/:id/read', authMiddleware, notificationController.readNotification);

export default router;
