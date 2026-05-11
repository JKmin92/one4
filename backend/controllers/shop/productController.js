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

export const createProductOrderBasket = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) return res.status(404).send({ message: 'no user' });

        const items = req.body.map(item => ({ ...item, user_code: user.user_code }));
        const result = await ProductService.createProductOrderBasket(items);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const getProductOrderBasket = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) return res.status(404).send({ message: 'no user' });

        const product_order_basket = await ProductService.getProductOrderBasket(user.user_code);
        res.status(200).json(product_order_basket);
    } catch (error) {
        next(error);
    }
};

export const changeProductOrderBasketQuantity = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) return res.status(404).send({ message: 'no user' });

        const product_order_basket = await ProductService.changeProductOrderBasketQuantity({ ...req.body, user_code: user.user_code });
        res.status(200).json(product_order_basket);
    } catch (error) {
        next(error);
    }
};

export const deleteProductOrderBasket = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) return res.status(404).send({ message: 'no user' });

        const product = await ProductService.deleteProductOrderBasket(req.params.id, user.user_code);
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

export const getProductOrderBasketCount = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) return res.status(404).send({ message: 'no user' });

        const count = await ProductService.getProductOrderBasketCount(user.user_code);
        res.status(200).json(count);
    } catch (error) {
        next(error);
    }
};

export const getOrderProduct = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) return res.status(404).send({ message: 'no user' });

        const orderProductItems = await ProductService.getOrderProduct(req.body.orderItems);
        res.status(200).json(orderProductItems);
    } catch (error) {
        next(error);
    }
};

export const getBasketProductInfo = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) return res.status(404).send({ message: 'no user' });

        const basketProductInfo = await ProductService.getBasketProduct(req.body.basketItems);
        res.status(200).json(basketProductInfo);
    } catch (error) {
        next(error);
    }
};