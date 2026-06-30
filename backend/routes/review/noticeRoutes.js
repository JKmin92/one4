import express from 'express';
import * as noticeController from '../../controllers/review/noticeController.js';

const router = express.Router();

router.get('/', noticeController.getActiveNotices);
router.get('/:notice_code', noticeController.getNoticeDetail);

export default router;
