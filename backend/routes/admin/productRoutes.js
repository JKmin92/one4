import express from 'express';
import * as productController from '../../controllers/admin/productController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage for processing in service

// Category Routes
router.post('/category', productController.createCategory);
router.get('/category', productController.getCategory);
router.put('/category', productController.updateCategory);
router.delete('/category/:id', productController.deleteCategory);
router.put('/category/sort', productController.updateProductCategorySortOrder);

// Product Routes
router.post('/', upload.fields([{ name: 'mainImage', maxCount: 1 }, { name: 'subImages', maxCount: 10 }]), productController.createProduct);
router.get('/:id', productController.getProduct);

export default router;
