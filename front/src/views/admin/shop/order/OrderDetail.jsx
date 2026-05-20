import { Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../../utils/api";
import { toaster } from "../../../../components/ui/toaster";
import { formatDate } from "../../../../utils/simpleUtils";

function OrderDetail() {
    const { order_code } = useParams();
    const [productOrder, setProductOrder] = useState();
    const [address, setAddress] = useState();
    const [productOrderDeliveryList, setProductOrderDeliveryList] = useState([]);
    const [productPayment, setProductPayment] = useState();
    const [productOrderItemList, setProductOrderItemList] = useState([]);
    const [productOrderClaimList, setProductOrderClaimList] = useState([]);

    useEffect(() => {
        const loadOrder = async () => {
            try {
                const response = await axiosInstance.get(`/admin/shop/order/${order_code}`);
                setProductOrder(response.data.product_order);
                setAddress(response.data.address);
                setProductOrderDeliveryList(response.data.product_order_deliveries);
                setProductPayment(response.data.product_payment);
                setProductOrderItemList(response.data.product_order_items);
                setProductOrderClaimList(response.data.product_order_claims);
            } catch (e) {
                console.error(e);
                toaster.create({ title: '오류가 발생했습니다.', type: 'error' });
            }
        }
        loadOrder();
    }, []);

    return (
        <Stack p="30px" px="layoutX" gap="6">
            <Heading>주문 상세정보</Heading>
            <HStack fontSize="sm" gap="8" border="1px solid" borderColor="gray.300" py="2" px="5" borderRadius="md">
                <Text>주문번호 : {productOrder?.order_code}</Text>
                <Text>주문일 : {formatDate(productOrder?.created_at)}</Text>
            </HStack>

        </Stack>
    )
}

export default OrderDetail;