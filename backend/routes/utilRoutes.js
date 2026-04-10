import express from 'express';
import * as utilController from '../controllers/utilController.js';

const router = express.Router();

router.get('/metadata', utilController.getMetadata);

export default router;
