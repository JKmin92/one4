import * as orderService from "../../services/shop/orderService.js";

export const insertProductOrder = async (req, res, next) => {
    try {
        const data = req.body;
        const user = req.user;
        if (!user) return res.status(404).send({ message: 'no user' });
        const result = await orderService.insertProductOrder({ ...data, user_code: user.user_code });
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export const getProductOrder = async (req, res, next) => {
    try {
        const order_code = req.params.order_code;
        const result = await orderService.getProductOrder(order_code);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export const getUserProductOrder = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) return res.status(404).send({ message: 'no user' });
        const result = await orderService.getUserProductOrder(user.user_code);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export const updateOrderCompleted = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) return res.status(404).send({ message: 'no user' });
        const order_code = req.params.order_code;
        const result = await orderService.updateOrderCompleted(order_code, user.user_code);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export const insertProductOrderClaim = async (req, res, next) => {
    try {
        const data = req.body;
        const user = req.user;
        if (!user) return res.status(404).send({ message: 'no user' });
        const result = await orderService.insertProductOrderClaim({ ...data, user_code: user.user_code });
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}