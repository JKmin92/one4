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

export const getProductById = async (id) => {
    const product = await ProductModel.getProductById(id);

    if (!product) return null;

    // Parse JSON fields
    const jsonFields = ['images', 'options', 'categories'];
    jsonFields.forEach(field => {
        if (product[field] && typeof product[field] === 'string') {
            try {
                product[field] = JSON.parse(product[field]);
            } catch (e) {
                console.error(`Failed to parse ${field} JSON for product`, product.id, e);
                product[field] = [];
            }
        } else if (!product[field]) { // Handle null/undefined
            product[field] = [];
        }
    });

    // Group options
    const optionsMap = {};
    product.options.forEach(opt => {
        if (!optionsMap[opt.name]) {
            optionsMap[opt.name] = {
                label: opt.name,
                id: Object.keys(optionsMap).length + 1,
                items: []
            };
        }
        // Avoid duplicates if needed, though DB usually has unique rows for option_num
        // But here we might have multiple rows with same name/value if stock differs? 
        // Assuming unique name-value pairs for the select items
        const exists = optionsMap[opt.name].items.some(item => item.value === opt.value);
        if (!exists) {
            optionsMap[opt.name].items.push({
                label: opt.value,
                value: opt.value,
                stock: opt.stock
            });
        }
    });
    product.options = Object.values(optionsMap);

    return product;
};