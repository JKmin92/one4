import express from 'express';
import * as displayController from '../../../controllers/admin/review/displayController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const bannerUploadFields = upload.fields([
    { name: 'image_pc', maxCount: 1 },
    { name: 'image_mobile', maxCount: 1 },
    { name: 'image_tablet', maxCount: 1 }
]);

router.get('/banners', displayController.getBannerList);
router.post('/banners', bannerUploadFields, displayController.createBanner);
router.put('/banners/reorder', displayController.updateBannerOrder);
router.put('/banners/:id', bannerUploadFields, displayController.updateBanner);
router.delete('/banners/:id', displayController.deleteBanner);

export default router;
