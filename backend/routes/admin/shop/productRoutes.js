import express from 'express';
import * as productController from '../../../controllers/admin/shop/productController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Category Routes
router.post('/category', productController.createCategory);
router.get('/category', productController.getCategory);
router.put('/category', productController.updateCategory);
router.delete('/category/:category_code', productController.deleteCategory);
router.put('/category/sort', productController.updateProductCategorySortOrder);

// Product Routes
router.post('/', upload.fields([{ name: 'mainImage', maxCount: 1 }, { name: 'subImages', maxCount: 10 }]), productController.createProduct);
router.put('/:id', upload.fields([{ name: 'mainImage', maxCount: 1 }, { name: 'subImages', maxCount: 10 }]), productController.updateProduct);
router.get('/:id', productController.getProduct);
router.get('/', productController.getProductList);

export default router;
