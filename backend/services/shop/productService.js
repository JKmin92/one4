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