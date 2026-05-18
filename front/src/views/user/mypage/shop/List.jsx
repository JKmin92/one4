import { Box, Button, EmptyState, Heading, HStack, Image, Link, Stack, Status, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../utils/api";
import { LuChevronRight, LuDot, LuShoppingCart } from "react-icons/lu";
import { formatDate, formatDateYMD, formatNumber } from "../../../../utils/simpleUtils";

function OrderList() {

    const [orderList, setOrderList] = useState([]);

    useEffect(() => {
        getOrderList();
    }, []);

    const getOrderList = async () => {
        try {
            const res = await axiosInstance.get('/shop/product/order/list');
            if (res.data) {
                console.log(res.data);
                setOrderList(res.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const orderStatus = (status) => {
        switch (status) {
            case 'PENDING':
                return (
                    <Status.Root colorPalette="orange">
                        <Status.Indicator /> 결제 대기
                    </Status.Root>
                )
            case 'PAID':
                return (
                    <Status.Root colorPalette="blue">
                        <Status.Indicator /> 결제 완료
                    </Status.Root>
                )
            case 'PROCESSING':
                return (
                    <Status.Root colorPalette="blue">
                        <Status.Indicator /> 제품 준비 중
                    </Status.Root>
                )
            case 'SHIPPING':
                return (
                    <Status.Root colorPalette="blue">
                        <Status.Indicator /> 배송 중
                    </Status.Root>
                )
            case 'DELIVERED':
                return (
                    <Status.Root colorPalette="blue">
                        <Status.Indicator /> 배송 완료
                    </Status.Root>
                )
            case 'COMPLETED':
                return (
                    <Status.Root colorPalette="green">
                        <Status.Indicator /> 구매 확정
                    </Status.Root>
                )
            case 'CANCELED':
                return (
                    <Status.Root colorPalette="orange">
                        <Status.Indicator /> 주문 취소
                    </Status.Root>
                )
            case 'CLAIM':
                return (
                    <Status.Root colorPalette="red">
                        <Status.Indicator /> 클레임 접수
                    </Status.Root>
                )
            default:
                return '알 수 없음';
        }
    }

    return (
        <Stack w="full" rounded="md" border="1px solid #eee" p="20px" gap="6" textAlign="left">
            <Heading fontSize="sm" textAlign="left">주문 내역</Heading>
            {(!orderList || orderList.length <= 0) ? (
                <EmptyState.Root>
                    <EmptyState.Content>
                        <EmptyState.Indicator><LuShoppingCart /></EmptyState.Indicator>
                        <VStack textAlign="center">
                            <EmptyState.Title>주문 내역이 없습니다.</EmptyState.Title>
                            <EmptyState.Description>
                                주문 내역이 없습니다.
                            </EmptyState.Description>
                        </VStack>
                    </EmptyState.Content>
                </EmptyState.Root>
            ) : (
                <Stack gap="10">
                    {orderList.map((order) => (
                        <Stack key={order.order_code} shadow="md" rounded="md" p="20px" gap="5">
                            <HStack justifyContent="space-between">
                                <Text fontWeight="medium">{formatDateYMD(order.created_at)} 주문</Text>
                                <Link href={`/mypage/order/${order.order_code}`} fontSize="sm">주문 상세 보기 <LuChevronRight /></Link>
                            </HStack>

                            <Stack direction="row" justifyContent="space-between" alignItems="center" gap="10">
                                <Stack w="full">
                                    {order.product_order_items.map((item) => (
                                        <Stack direction="row" key={item.order_item_code} justifyContent="space-between" alignItems="end">
                                            <Stack direction="row" gap="5">
                                                <Image src={item.image_url} w="24" rounded="md" />
                                                <Stack>
                                                    <Text fontWeight="medium">{item.product_name}</Text>
                                                    <HStack fontSize="sm" color="fg.muted" gap="0">
                                                        {item.product_option_code && (
                                                            <>
                                                                <Text>{item.option_value}</Text>
                                                                <LuDot />
                                                            </>
                                                        )}
                                                        <Text>{item.quantity} 개</Text>
                                                    </HStack>
                                                    <Text>{formatNumber(item.price)} 원</Text>
                                                </Stack>
                                            </Stack>
                                            <Button variant="outline" size="xs">장바구니 넣기</Button>
                                        </Stack>
                                    ))}
                                </Stack>

                                <Stack textAlign="end" justifyContent="end">
                                    <Box justifyContent="flex-end">
                                        {orderStatus(order.status)}
                                    </Box>
                                    <Text>{formatNumber(order.total_product_price + order.delivery_price)} 원</Text>
                                    <Button size="xs" as={Link} href={`/mypage/order/${order.order_code}`}>주문 상세보기</Button>
                                </Stack>
                            </Stack>
                        </Stack>
                    ))}
                </Stack>
            )}
        </Stack>
    )
}

export default OrderList;