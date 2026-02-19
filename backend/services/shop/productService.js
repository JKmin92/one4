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

    if (products.length === 0) return [];

    const productIds = products.map(p => p.id);
    const promotions = await ProductModel.getActivePromotions(productIds);

    return products.map(product => {
        if (product.images && typeof product.images === 'string') {
            try {
                product.images = JSON.parse(product.images);
            } catch (e) {
                console.error("Failed to parse images JSON for product", product.id, e);
                product.images = [];
            }
        }

        const productPromotions = promotions.filter(p => p.related_product_id === product.id);

        productPromotions.sort((a, b) => {
            if (a.target_type !== b.target_type) {
                return a.target_type === 'product' ? -1 : 1;
            }
            return new Date(b.created_at) - new Date(a.created_at);
        });

        const activePromotion = productPromotions[0];

        if (activePromotion) {
            let discountPrice = product.price;
            if (activePromotion.discount_type === 'percentage') {
                discountPrice = product.price * (1 - activePromotion.discount_value / 100);
            } else if (activePromotion.discount_type === 'fixed') {
                discountPrice = product.price - activePromotion.discount_value;
            }
            product.discount_price = Math.floor(discountPrice);
            product.active_promotion = activePromotion;
        } else {
            product.discount_price = null;
        }

        return product;
    });
};

export const getProductById = async (id) => {
    const product = await ProductModel.getProductById(id);
    if (!product) return null;

    const jsonFields = ['images', 'options', 'categories'];
    jsonFields.forEach(field => {
        if (product[field] && typeof product[field] === 'string') {
            try {
                product[field] = JSON.parse(product[field]);
            } catch (e) {
                console.error(`Failed to parse ${field} JSON for product`, product.id, e);
                product[field] = [];
            }
        } else if (!product[field]) {
            product[field] = [];
        }
    });

    const promotions = await ProductModel.getActivePromotions([product.id]);
    const productPromotions = promotions.filter(p => p.related_product_id === product.id);

    productPromotions.sort((a, b) => {
        if (a.target_type !== b.target_type) {
            return a.target_type === 'product' ? -1 : 1;
        }
        return new Date(b.created_at) - new Date(a.created_at);
    });

    const activePromotion = productPromotions[0];

    if (activePromotion) {
        let discountPrice = product.price;
        if (activePromotion.discount_type === 'percentage') {
            discountPrice = product.price * (1 - activePromotion.discount_value / 100);
        } else if (activePromotion.discount_type === 'fixed') {
            discountPrice = product.price - activePromotion.discount_value;
        }
        product.discount_price = Math.floor(discountPrice);
        product.active_promotion = activePromotion;
    } else {
        product.discount_price = null;
    }

    const optionsMap = {};
    product.options.forEach(opt => {
        if (!optionsMap[opt.name]) {
            optionsMap[opt.name] = {
                label: opt.name,
                id: Object.keys(optionsMap).length + 1,
                items: []
            };
        }
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