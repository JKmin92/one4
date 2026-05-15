import { Heading, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toaster } from "../../../components/ui/toaster";
import axiosInstance from "../../../utils/api";

function OrderComplete() {
    const location = useLocation();
    const [productOrder, setProductOrder] = useState();
    const [productOrderItems, setProductOrderItems] = useState();
    const [productOrderPayment, setProductOrderPayment] = useState();

    useEffect(() => {
        if (location.state && location.state.orderCode) {

            const getProductOrder = async () => {
                try {
                    const orderCode = location.state.orderCode;
                    const response = await axiosInstance.get(`/shop/product/order/${orderCode}`);
                    setProductOrder(response.data.product_order);
                    setProductOrderItems(response.data.product_order_items);
                    setProductOrderPayment(response.data.product_order_payment);
                } catch (e) {
                    console.error(e);
                    toaster.create({ title: '오류가 발생되었습니다.', type: 'error' });
                }
            }

            getProductOrder();
        }
    }, []);

    return (
        <Stack p={{ base: '40px 0', md: "80px 0" }} px={{ base: '15px', md: "layoutX" }} width={{ base: 'full', md: "6xl" }} margin="auto" gap="6">
            <Heading>주문이 완료 되었습니다.</Heading>
            <Stack>
                <Text fontWeight="medium">주문 제품</Text>
                <Stack>

                </Stack>
            </Stack>
        </Stack>
    )
}

export default OrderComplete;