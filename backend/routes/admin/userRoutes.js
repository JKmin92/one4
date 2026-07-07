import express from 'express';
import * as userController from '../../controllers/userController.js';

const router = express.Router();

router.post('/signIn', userController.adminSignIn);

export default router;
