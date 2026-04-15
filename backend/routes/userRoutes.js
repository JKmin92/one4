import express from 'express';
import * as userController from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', userController.createUser);
router.get('/exists/email', userController.existsEmail);
router.post('/signIn', userController.signIn);
router.post('/signOut', userController.signOut);
router.post('/refresh', userController.refreshToken);
router.get('/', authMiddleware, userController.me);
router.get('/profile', authMiddleware, userController.getUserProfile);

router.get('/address', authMiddleware, userController.getUserAddress);
router.post('/address', authMiddleware, userController.insertUserAddress);
router.put('/address', authMiddleware, userController.updateUserAddress);
router.delete('/address/:address_code', authMiddleware, userController.deleteUserAddress);

router.get('/review/channel', authMiddleware, userController.getUserReviewChannelList);
router.get('/review/channel/:review_channel_code', authMiddleware, userController.getUserReviewChannel);
router.post('/review/channel', authMiddleware, userController.insertUserReviewChannel);
router.put('/review/channel', authMiddleware, userController.updateUserReviewChannel);
router.delete('/review/channel/:review_channel_code', authMiddleware, userController.deleteUserReviewChannel);

export default router;