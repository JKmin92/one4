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

export const updateOrderStatus = async (order_codes, status) => {
    const orderItemList = await orderModel.getProductOrderItems(order_codes);
    const orderItemCodes = orderItemList.map(orderItem => orderItem.order_item_code);

    await orderModel.updateOrderStatus(order_codes, status);
    await orderModel.updateOrderItemStatus(orderItemCodes, status);
    return { success: true };
}

export const updatePaidCheckTime = async (order_codes) => {
    await orderModel.updatePaidCheckTime(order_codes);
    return { success: true };
}

export const getProductOrderClaimByType = async (type) => {
    return await orderModel.getProductOrderClaimByType(type);
}

export const updateProductOrderClaimProcessing = async (order_claim_code) => {
    const claim = await orderModel.getProductOrderClaim(order_claim_code);
    if (claim && (claim.claim_type?.toUpperCase() === 'EXCHANGE' || claim.claim_type?.toUpperCase() === 'RETURN')) {
        await orderModel.updateProductOrderClaimDetailStatus([order_claim_code], 'RETURN_REQUEST');
    }
    return await orderModel.updateProductOrderClaimProcessing(order_claim_code);
}

export const updateProductOrderClaimDetailStatus = async (order_claim_codes, status) => {
    if (status === 'REFUND_ACTIVE') {
        return await orderModel.updateProductOrderClaimRefoundActive(order_claim_codes);
    }

    const claims = await orderModel.getProductOrderClaims(order_claim_codes);

    const claimsToUpdate = claims.filter(c =>
        c.claim_status?.toUpperCase() === 'REQUEST' || c.claim_status?.toUpperCase() === 'REQUESTED'
    );
    if (claimsToUpdate.length > 0) {
        const codesToUpdate = claimsToUpdate.map(c => c.order_claim_code);
        await orderModel.updateProductOrderClaimsStatus(codesToUpdate, 'PROCESSING');
    }

    if (status === 'RESEND_COMPLETED') {
        await orderModel.updateProductOrderClaimsCompleted(order_claim_codes);
    }

    return await orderModel.updateProductOrderClaimDetailStatus(order_claim_codes, status);
}

export const updateProductOrderClaimsRejected = async (order_claim_codes) => {
    return await orderModel.updateProductOrderClaimsRejected(order_claim_codes);
}

export const updateProductOrderClaimRefund = async ({ total_product_amount, deducted_delivery_fee, refund_charge_amount, total_refund_amount, refund_method, order_claim_code }) => {
    return await orderModel.updateProductOrderClaimRefund({ total_product_amount, deducted_delivery_fee, refund_charge_amount, total_refund_amount, refund_method, order_claim_code });
}
