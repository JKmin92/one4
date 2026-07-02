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
        const shopDeliverySetting = await orderModel.getShopDeliverySetting();
        const delivery_price = !shopDeliverySetting ? 0 :
            shopDeliverySetting.delivery_method === 'free' ? 0 :
                shopDeliverySetting.delivery_method === 'FIXED' ? shopDeliverySetting.basic_delivery_price :
                    total_product_price >= shopDeliverySetting.order_standard ? 0 : shopDeliverySetting.basic_delivery_price;
        const product_order = {
            order_code: order_code,
            user_code: data.user_code,
            address: data.selectedAddress,
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
                product_option_code: item.product_option_code !== 'unique' ? item.product_option_code : null,
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

        if (data.selectedPayment.payment_type === 'BANK') {
            const notificationModel = await import("../../models/notificationModel.js");
            await notificationModel.insertNotification(
                data.user_code,
                'SHOP',
                `[결제대기] 주문이 정상적으로 접수되었습니다. 무통장 입금을 진행해 주세요. (주문번호: ${order_code})`,
                `/mypage/shop/order/${order_code}`
            );
        }

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

export const updateOrderAddress = async (order_code, user_code, data) => {
    // 1. Update product_order_address
    await orderModel.updateProductOrderAddress(order_code, data);
    
    // 2. If updateDefaultAddress is true, update the user's default address
    if (data.updateDefaultAddress) {
        const userAddressModel = await import("../../models/userModel.js"); // lazy load or we can assume it's there
        await userAddressModel.updateUserDefaultAddress(user_code, {
            name: data.name,
            phone: data.phone,
            postcode: data.postcode,
            address: data.address,
            detailAddress: data.detailAddress
        });
    }

    return { result: true };
}

export const updateDepositName = async (order_code, user_code, deposit_name) => {
    // Optionally we can verify if order_code belongs to user_code here
    await orderModel.updateDepositName(order_code, deposit_name);
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

export const getShopAccountList = async () => {
    return await orderModel.getShopAccountList();
}

export const getShopDeliverySetting = async () => {
    return await orderModel.getShopDeliverySetting();
}