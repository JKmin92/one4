import * as orderService from "../../../services/admin/shop/orderService.js";

export const getOrderList = async (req, res, next) => {
    try {
        const { status } = req.params;
        const result = await orderService.getOrderList(status);
        return res.status(200).json(result);
    } catch (e) {
        next(e);
    }
}

export const insertProductOrderDelivery = async (req, res, next) => {
    try {
        const dataList = req.body;
        const result = await orderService.insertProductOrderDelivery(dataList);
        return res.status(200).json(result);
    } catch (e) {
        next(e);
    }
}

export const getOrder = async (req, res, next) => {
    try {
        const { order_code } = req.params;
        const result = await orderService.getOrder(order_code);
        return res.status(200).json(result);
    } catch (e) {
        next(e);
    }
}