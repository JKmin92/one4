import express from 'express';
import * as productController from '../../controllers/admin/productController.js';

const router = express.Router();

router.post('/category', productController.createCategory);
router.get('/category', productController.getCategory);
router.put('/category', productController.updateCategory);
router.delete('/category/:id', productController.deleteCategory);
router.put('/category/sort', productController.updateProductCategorySortOrder);

export default router;
