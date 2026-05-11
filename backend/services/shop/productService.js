import * as ProductModel from "../../models/shop/productModel.js";
import { generateUniqueId } from "../../utils/customUtils.js";

export const getCategories = async () => {
    return await ProductModel.getCategories();
};

export const getCategoryByCode = async (category_code) => {
    return await ProductModel.getCategoryByCode(category_code);
};

export const getSubCategoriesByCode = async (parent_code) => {
    return await ProductModel.getSubCategoriesByCode(parent_code);
};

export const getProductsByCategoryCode = async (category_code) => {
    const products = await ProductModel.getProductsByCategoryCode(category_code);

    if (products.length === 0) return [];

    const productCodes = products.map(p => p.product_code);
    const promotions = await ProductModel.getActivePromotions(productCodes);

    return products.map(product => {
        if (product.images && typeof product.images === 'string') {
            try {
                product.images = JSON.parse(product.images);
            } catch (e) {
                console.error("Failed to parse images JSON for product", product.product_code, e);
                product.images = [];
            }
        }

        const productPromotions = promotions.filter(p => p.related_product_code === product.product_code);

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

export const getProductById = async (product_code) => {
    const product = await ProductModel.getProduct(product_code);
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

    const promotions = await ProductModel.getActivePromotions([product.product_code]);
    const productPromotions = promotions.filter(p => p.related_product_code === product.product_code);

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
                stock: opt.stock,
                product_option_code: opt.product_option_code
            });
        }
    });
    product.options = Object.values(optionsMap);

    return product;
};

export const createProductOrderBasket = async (dataArray) => {
    let addedCount = 0;

    for (const data of dataArray) {
        const count = await ProductModel.checkProductOrderBasket(data);
        if (count === 0) {
            const order_basket_code = generateUniqueId();
            data.product_option_code = data.product_option_code === 'unique' ? null : data.product_option_code;
            await ProductModel.createProductOrderBasket({ ...data, order_basket_code });
            addedCount++;
        }
    }

    if (addedCount === 0) {
        return { message: 'already', code: '201', success: false };
    }

    return { message: 'success', code: '200', success: true };
}

export const getProductOrderBasket = async (user_code) => {
    const basket = await ProductModel.getProductOrderBasket(user_code);
    if (!basket) return null;

    return basket.map(item => {
        if (item.images && typeof item.images === 'string') {
            try {
                item.images = JSON.parse(item.images);
            } catch (e) {
                console.error("Failed to parse images JSON for product", item.id, e);
                item.images = [];
            }
        }

        if (item.promotions && typeof item.promotions === 'string') {
            try {
                item.promotions = JSON.parse(item.promotions);
            } catch (e) {
                console.error("Failed to parse promotions JSON for product", item.id, e);
                item.promotions = [];
            }
        }

        if (item.options && typeof item.options === 'string') {
            try {
                item.options = JSON.parse(item.options);
            } catch (e) {
                console.error("Failed to parse option_info JSON for product", item.id, e);
                item.options = [];
            }
        }

        const promotions = item.promotions || [];
        const activePromotion = promotions[0];

        if (activePromotion) {
            let discountPrice = item.product_price;
            if (activePromotion.discount_type === 'percentage') {
                discountPrice = item.product_price * (1 - activePromotion.discount_value / 100);
            } else if (activePromotion.discount_type === 'fixed') {
                discountPrice = item.product_price - activePromotion.discount_value;
            }
            item.discount_price = Math.floor(discountPrice);
            item.active_promotion = activePromotion;
        } else {
            item.discount_price = null;
        }

        return item;
    });
}

export const changeProductOrderBasketQuantity = async (data) => {
    return await ProductModel.changeProductOrderBasketQuantity(data);
}

export const deleteProductOrderBasket = async (order_basket_code, user_code) => {
    return await ProductModel.deleteProductOrderBasket(order_basket_code, user_code);
}

export const getProductOrderBasketCount = async (user_code) => {
    return await ProductModel.getProductOrderBasketCount(user_code);
}

export const getOrderProduct = async (orderProductList) => {
    const products = await ProductModel.getOrderProductInfo(orderProductList);
    if (!products) return [];

    return products.map(item => {
        if (item.images && typeof item.images === 'string') {
            try {
                item.images = JSON.parse(item.images);
            } catch (e) {
                console.error("Failed to parse images JSON for product", item.product_code, e);
                item.images = [];
            }
        }

        if (item.promotions && typeof item.promotions === 'string') {
            try {
                item.promotions = JSON.parse(item.promotions);
            } catch (e) {
                console.error("Failed to parse promotions JSON for product", item.product_code, e);
                item.promotions = [];
            }
        }

        if (item.options && typeof item.options === 'string') {
            try {
                item.options = JSON.parse(item.options);
            } catch (e) {
                console.error("Failed to parse options JSON for product", item.product_code, e);
                item.options = null;
            }
        }

        const promotions = item.promotions || [];
        const activePromotion = promotions[0];

        if (activePromotion) {
            let discountPrice = item.product_price;
            if (activePromotion.discount_type === 'percentage') {
                discountPrice = item.product_price * (1 - activePromotion.discount_value / 100);
            } else if (activePromotion.discount_type === 'fixed') {
                discountPrice = item.product_price - activePromotion.discount_value;
            }
            item.discount_price = Math.floor(discountPrice);
            item.active_promotion = activePromotion;
        } else {
            item.discount_price = null;
        }

        return item;
    });
}

export const getBasketProduct = async (basketCodes) => {
    const orderProductList = await ProductModel.getBasketProductInfo(basketCodes);
    return getOrderProduct(orderProductList);
}
