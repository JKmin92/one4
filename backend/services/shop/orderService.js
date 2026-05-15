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
        const product_order_items = data.orderProducts.map((item) => {
            let itemPrice = item.product_price;

            if (item.promotions && item.promotions.length > 0) {
                const promotion = item.promotions[0];
                if (promotion.discount_type === 'fixed') {
                    itemPrice = itemPrice - promotion.discount_value;
                } else if (promotion.discount_type === 'percentage' || promotion.discount_type === 'percent') {
                    itemPrice = itemPrice * (1 - promotion.discount_value / 100);
                }
            }

            return {
                order_item_code: generateUniqueId(),
                order_code,
                product_code: item.product_code,
                product_option_code: item.product_option_code,
                quantity: item.quantity,
                discount_type: item.promotions?.[0]?.discount_type || null,
                discount_value: item.promotions?.[0]?.discount_value || null,
                price: itemPrice * item.quantity
            }
        });
        const product_order_payment = { ...data.selectedPayment, payment_code: generateUniqueId(), order_code: order_code };

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