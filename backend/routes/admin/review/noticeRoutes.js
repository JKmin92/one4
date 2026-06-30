import express from 'express';
import * as noticeController from '../../../controllers/admin/review/noticeController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', noticeController.getNoticeList);
router.get('/:notice_code', noticeController.getNoticeById);
router.post('/', noticeController.createNotice);
router.put('/:notice_code', noticeController.updateNotice);
router.delete('/:notice_code', noticeController.deleteNotice);
router.post('/upload', upload.single('image'), noticeController.uploadImage);

export default router;
