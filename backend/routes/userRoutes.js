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

export default router;