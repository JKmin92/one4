import * as orderModel from "../../../models/admin/shop/orderModel.js";

export const getOrderList = async (status) => {
    return await orderModel.getOrderList(status);
}