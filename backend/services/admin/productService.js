import * as model from '../../models/admin/productModel.js';
import moment from 'moment';

export const insertProductCategory = async (category) => {
    const timePart = moment().format('YYMMDDHHmmss');
    const id = `${timePart}`;
    await model.insertProductCategory({ ...category, id: id });
    return { ...category, id };
}

export const selectProductCategory = async () => {
    return await model.selectProductCategory();
}

export const updateProductCategory = async (category) => {
    return await model.updateProductCategory(category);
}

export const deleteProductCategory = async (id) => {
    return await model.deleteProductCategory(id);
}

export const updateProductCategorySortOrder = async (categories) => {
    return await model.updateProductCategorySortOrder(categories);
}