import * as orderModel from "../../../models/admin/shop/orderModel.js";
import { generateUniqueId } from "../../../utils/customUtils.js";

export const getOrderList = async (status) => {
    return await orderModel.getOrderList(status);
}

export const insertProductOrderDelivery = async (dataList) => {
    for (const [order_code, items] of Object.entries(dataList)) {
        for (const item of items) {
            const delivery_code = generateUniqueId();

            const product_order_delivery = {
                delivery_code,
                order_code,
                order_item_code: item.order_item_code,
                post_company: item.post_company,
                post_number: item.post_number
            };

            await orderModel.insertProductOrderDelivery(product_order_delivery);
        }
    }

    return { success: true, message: "배송 정보가 저장되었습니다." };
}

export const getOrder = async (order_code) => {
    return await orderModel.getOrder(order_code);
}