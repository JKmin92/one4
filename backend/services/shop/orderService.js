import * as orderModel from "../../models/shop/orderModel.js";
import { generateUniqueId } from "../../utils/customUtils.js";

export const insertProductOrder = async (data) => {
    try {
        const order_code = generateUniqueId();
        const total_product_price = data.orderProducts.reduce((total, item) => {
            let price = item.product_price;

            if (item.promotions && item.promotions.length > 0) {
                if (item.promotions[0].discount_type === 'fixed') {
                    price = price - item.promotions[0].discount_value;
                } else if (item.promotions[0].discount_type === 'percentage') {
                    price = price * (1 - item.promotions[0].discount_value / 100);
                }
            }

            return total + (price * item.quantity);
        }, 0);
        const delivery_price = total_product_price >= 50000 ? 0 : 3500; //관련 세팅 추가 필요
        const product_order = {
            order_code: order_code,
            user_code: data.user_code,
            address_code: data.selectedAddress.address_code,
            total_product_price: total_product_price,
            delivery_price: delivery_price,
            used_mileage: 0,
            actual_payment_amount: total_product_price + delivery_price,
            status: data.selectedPayment.payment_type === 'BANK' ? 'PENDING' : 'PAID'
        };
        const product_order_items = [];
        for (const item of data.orderProducts) {
            let itemPrice = item.product_price;

            if (item.promotions && item.promotions.length > 0) {
                const promotion = item.promotions[0];
                if (promotion.discount_type === 'fixed') {
                    itemPrice = itemPrice - promotion.discount_value;
                } else if (promotion.discount_type === 'percentage' || promotion.discount_type === 'percent') {
                    itemPrice = itemPrice * (1 - promotion.discount_value / 100);
                }
            }

            const productName = await orderModel.getProductNameByCode(item.product_code);

            let optionLabel = null;
            let optionValue = null;
            if (item.product_option_code && item.product_option_code !== 'unique') {
                const option = await orderModel.getProductOptionByCode(item.product_option_code);
                if (option) {
                    optionLabel = option.name;
                    optionValue = option.value;
                }
            }

            product_order_items.push({
                order_item_code: generateUniqueId(),
                order_code,
                product_code: item.product_code,
                product_option_code: item.product_option_code,
                quantity: item.quantity,
                discount_type: item.promotions?.[0]?.discount_type || null,
                discount_value: item.promotions?.[0]?.discount_value || null,
                price: item.product_price * item.quantity,
                each_price: itemPrice,
                final_price: itemPrice * item.quantity,
                product_name: productName,
                product_option_label: optionLabel,
                product_option_value: optionValue
            });
        }
        const payment_deadline = new Date();
        payment_deadline.setDate(payment_deadline.getDate() + 5);
        payment_deadline.setHours(23, 59, 59, 0);
        const product_order_payment = { ...data.selectedPayment, payment_code: generateUniqueId(), order_code: order_code, payment_deadline };

        await orderModel.insertProductOrder(product_order);
        for (let i = 0; i < product_order_items.length; i++) {
            await orderModel.insertProductOrderItem(product_order_items[i]);
        }
        await orderModel.insertProductOrderPayment(product_order_payment);
        return { result: true, order_code: order_code };
    } catch (error) {
        console.log(error);
        return { result: false };
    }
}

export const getProductOrder = async (order_code) => {
    return await orderModel.getProductOrder(order_code);
}

export const getUserProductOrder = async (user_code) => {
    return await orderModel.getUserProductOrder(user_code);
}

export const updateOrderCompleted = async (order_code, user_code) => {
    await orderModel.updateOrderCompleted(order_code, user_code);
    return { result: true };
}

export const insertProductOrderClaim = async (data) => {
    const order_claim_code = generateUniqueId();
    const delivery_price = await orderModel.getProductOrderDeliveryPriceForOrderCode(data.order_code, data.user_code);
    let total_product_amount = 0;

    data.product_order_items.map(async (item) => {
        const product_order_item = await orderModel.getProductOrderItemForOrderItemCode(item.order_item_code);
        const targetProductAmount = (product_order_item.final_price / product_order_item.quantity) * item.quantity;
        total_product_amount += targetProductAmount;
    });

    if (delivery_price === null) {
        return { result: false, message: '권한 없음' };
    }

    const order_cliam = {
        order_claim_code: order_claim_code,
        order_code: data.order_code,
        user_code: data.user_code,
        claim_type: data.claim_type,
        reason_category: data.reason_type,
        reason_detail: data.reason_detail,
        total_product_amount: total_product_amount,
        deducted_delivery_fee: delivery_price
    };
    await orderModel.insertProductOrderClaim(order_cliam);

    data.product_order_items.map(async (item) => {
        const order_claim_item_code = generateUniqueId();
        const delivery_code = await orderModel.getProductOrderDeliveryCodeForItemCode(item.order_item_code, data.order_code);
        const product_order_item = await orderModel.getProductOrderItemForOrderItemCode(item.order_item_code);
        const targetProductAmount = (product_order_item.final_price / product_order_item.quantity) * item.quantity;

        const product_order_item_claim = {
            order_claim_item_code: order_claim_item_code,
            order_claim_code: order_claim_code,
            order_item_code: item.order_item_code,
            delivery_code: delivery_code,
            quantity: item.quantity,
            product_amount: targetProductAmount
        };
        await orderModel.insertProductOrderClaimItem(product_order_item_claim, data.claim_type);
    });



    return { result: true };
}