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

export const updateOrderStatus = async (req, res, next) => {
    try {
        const { order_codes, status, checkedItems } = req.body;
        if (status === 'PAID') await orderService.updatePaidCheckTime(order_codes);
        if (status === 'SHIPPING' && checkedItems && !Array.isArray(checkedItems)) {
            const orderCodes = [];
            for (const [order_code] of Object.entries(checkedItems)) {
                orderCodes.push(order_code);
            }

            await orderService.insertProductOrderDelivery(checkedItems);
            const result = await orderService.updateOrderStatus(orderCodes, status);
            return res.status(200).json(result);
        }
        const result = await orderService.updateOrderStatus(order_codes, status);
        return res.status(200).json(result);
    } catch (e) {
        next(e);
    }
}

export const getProductOrderClaimByType = async (req, res, next) => {
    try {
        const { type } = req.params;
        const result = await orderService.getProductOrderClaimByType(type);
        return res.status(200).json(result);
    } catch (e) {
        next(e);
    }
}

export const updateProductOrderClaimProcessing = async (req, res, next) => {
    try {
        const { order_claim_code } = req.body;
        const result = await orderService.updateProductOrderClaimProcessing(order_claim_code);
        return res.status(200).json(result);
    } catch (e) {
        next(e);
    }
}

export const updateProductOrderClaimDetailStatus = async (req, res, next) => {
    try {
        const { order_claim_codes, status } = req.body;
        const result = await orderService.updateProductOrderClaimDetailStatus(order_claim_codes, status);
        return res.status(200).json(result);
    } catch (e) {
        next(e);
    }
}

export const updateProductOrderClaimsProcessing = async (req, res, next) => {
    try {
        const { order_claim_codes } = req.body;
        let result = { success: false };

        for (const order_claim_code of order_claim_codes) {
            result = await orderService.updateProductOrderClaimProcessing(order_claim_code);
        }

        return res.status(200).json(result);
    } catch (e) {
        next(e);
    }
}

export const updateProductOrderClaimsRejected = async (req, res, next) => {
    try {
        const { order_claim_codes } = req.body;
        const result = await orderService.updateProductOrderClaimsRejected(order_claim_codes);
        return res.status(200).json(result);
    } catch (e) {
        next(e);
    }
}

export const updateProductOrderClaimRefund = async (req, res, next) => {
    try {
        const { total_product_amount, deducted_delivery_fee, refund_charge_amount, total_refund_amount, refund_method, order_claim_code } = req.body;
        const result = await orderService.updateProductOrderClaimRefund({ total_product_amount, deducted_delivery_fee, refund_charge_amount, total_refund_amount, refund_method, order_claim_code });
        return res.status(200).json(result);
    } catch (e) {
        next(e);
    }
}