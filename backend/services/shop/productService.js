import * as ProductModel from "../../models/shop/productModel.js";

export const getCategories = async () => {
    return await ProductModel.getCategories();
};

export const getCategoryById = async (id) => {
    return await ProductModel.getCategoryById(id);
};

export const getSubCategoryById = async (id) => {
    return await ProductModel.getSubCategoryById(id);
};

export const getProductsByCategoryId = async (categoryId) => {
    const products = await ProductModel.getProductsByCategoryId(categoryId);
    return products.map(product => {
        if (product.images && typeof product.images === 'string') {
            try {
                product.images = JSON.parse(product.images);
            } catch (e) {
                console.error("Failed to parse images JSON for product", product.id, e);
                product.images = [];
            }
        }
        return product;
    });
};