import express from 'express';
import * as userController from '../../../controllers/admin/member/userController.js';

const router = express.Router();

router.get('/list', userController.getUserList);

export default router;