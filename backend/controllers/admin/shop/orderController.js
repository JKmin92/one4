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