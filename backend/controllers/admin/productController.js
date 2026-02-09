import * as productService from '../../services/admin/productService.js';

export const createCategory = async (req, res, next) => {
    try {
        const category = req.body;
        const result = await productService.insertProductCategory(category);
        res.status(200).json(result);
    } catch (e) {
        next(e);
    }
}

export const getCategory = async (req, res, next) => {
    try {
        const result = await productService.selectProductCategory();
        res.status(200).json(result);
    } catch (e) {
        next(e);
    }
}

export const updateCategory = async (req, res, next) => {
    try {
        const category = req.body;
        const result = await productService.updateProductCategory(category);
        res.status(200).json(result);
    } catch (e) {
        next(e);
    }
}

export const deleteCategory = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await productService.deleteProductCategory(id);
        res.status(200).json(result);
    } catch (e) {
        next(e);
    }
}

export const updateProductCategorySortOrder = async (req, res, next) => {
    try {
        const categories = req.body;
        const result = await productService.updateProductCategorySortOrder(categories);
        res.status(200).json(result);
    } catch (e) {
        next(e);
    }
}

export const createProduct = async (req, res, next) => {
    try {
        const productData = req.body;
        const files = req.files;
        const result = await productService.insertProduct(productData, files);
        res.status(201).json(result);
    } catch (e) {
        next(e);
    }
}

export const getProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await productService.getProductDetails(id);
        res.status(200).json(result);
    } catch (e) {
        next(e);
    }
}