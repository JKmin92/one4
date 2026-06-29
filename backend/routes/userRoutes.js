import express from 'express';
import * as userController from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post('/', userController.createUser);
router.get('/exists/email', userController.existsEmail);
router.post('/signIn', userController.signIn);
router.post('/signOut', userController.signOut);
router.post('/refresh', userController.refreshToken);
router.get('/', authMiddleware, userController.me);
router.get('/profile', authMiddleware, userController.getUserProfile);
router.put('/profile', authMiddleware, upload.single('profileImage'), userController.updateUserProfile);

router.get('/address', authMiddleware, userController.getUserAddress);
router.post('/address', authMiddleware, userController.insertUserAddress);
router.put('/address', authMiddleware, userController.updateUserAddress);
router.delete('/address/:address_code', authMiddleware, userController.deleteUserAddress);

router.get('/review/channel', authMiddleware, userController.getUserReviewChannelList);
router.get('/review/channel/:review_channel_code', authMiddleware, userController.getUserReviewChannel);
router.post('/review/channel', authMiddleware, userController.insertUserReviewChannel);
router.put('/review/channel', authMiddleware, userController.updateUserReviewChannel);
router.delete('/review/channel/:review_channel_code', authMiddleware, userController.deleteUserReviewChannel);

router.put('/password', authMiddleware, userController.updatePassword);
router.post('/password/check', authMiddleware, userController.userPasswordCheck);

router.post('/account', authMiddleware, userController.insertUserAccount);
router.get('/account', authMiddleware, userController.getUserAccountList);
router.put('/account/:account_code/basic', authMiddleware, userController.updateUserAccountBasic);
router.delete('/account/:account_code', authMiddleware, userController.deleteUserAccount);

router.get('/point/history', authMiddleware, userController.getUserPointHistory);
router.get('/point', authMiddleware, userController.getUserPoint);
router.get('/point/payout/list', authMiddleware, userController.getUserPointPayoutList);
router.post('/point/payout', authMiddleware, userController.insertUserPointPayout);

router.delete('/', authMiddleware, userController.userWithdraw);

export default router;