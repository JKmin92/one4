import * as ProductService from "../../services/shop/productService.js";

export const getCategories = async (req, res, next) => {
    try {
        const categories = await ProductService.getCategories();
        res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
};

export const getCategoryById = async (req, res, next) => {
    try {
        const category = await ProductService.getCategoryById(req.params.id);
        res.status(200).json(category);
    } catch (error) {
        next(error);
    }
};

export const getSubCategoryById = async (req, res, next) => {
    try {
        const subCategory = await ProductService.getSubCategoryById(req.params.id);
        res.status(200).json(subCategory);
    } catch (error) {
        next(error);
    }
};

export const getProductsByCategoryId = async (req, res, next) => {
    try {
        const products = await ProductService.getProductsByCategoryId(req.params.id);
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};
