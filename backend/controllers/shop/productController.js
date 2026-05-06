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
        const category = await ProductService.getCategoryByCode(req.params.id);
        res.status(200).json(category);
    } catch (error) {
        next(error);
    }
};

export const getSubCategoryById = async (req, res, next) => {
    try {
        const subCategory = await ProductService.getSubCategoriesByCode(req.params.id);
        res.status(200).json(subCategory);
    } catch (error) {
        next(error);
    }
};

export const getProductsByCategoryCode = async (req, res, next) => {
    try {
        const products = await ProductService.getProductsByCategoryCode(req.params.id);
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

export const getProductById = async (req, res, next) => {
    try {
        const product = await ProductService.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};
