import { Box, Button, EmptyState, Heading, HStack, Image, Link, Stack, Status, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../utils/api";
import { LuChevronRight, LuDot, LuShoppingCart } from "react-icons/lu";
import { formatDate, formatDateYMD, formatNumber } from "../../../../utils/simpleUtils";
import { useSearchParams } from "react-router-dom";

function OrderList() {

    const [orderList, setOrderList] = useState([]);
    const [searchParams] = useSearchParams();
    const statusFilter = searchParams.get('status');

    useEffect(() => {
        getOrderList();
    }, []);

    const getOrderList = async () => {
        try {
            const res = await axiosInstance.get('/shop/product/order/list');
            if (res.data) {
                setOrderList(res.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const orderStatus = (status, product_order_claims) => {
        const claim = product_order_claims ? product_order_claims[product_order_claims.length - 1] : null;
        const claim_type = claim ? claim.claim_type === 'CANCEL' ? '취소' : claim.claim_type === 'EXCHANGE' ? '교환' : claim.claim_type === 'RETURN' ? '반품' : claim.claim_type === 'REFOUND' ? '환불' : '' : '';

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
            case 'CANCEL':
                return (
                    <Status.Root colorPalette="orange">
                        <Status.Indicator /> 주문 취소
                    </Status.Root>
                )
            case 'CLAIM':
                if (claim.claim_status === 'REQUEST') {
                    return (
                        <Status.Root colorPalette="orange">
                            <Status.Indicator /> {claim_type} 요청
                        </Status.Root>
                    )
                }

                if (claim.claim_status === 'PROCESSING') {
                    return (
                        <Status.Root colorPalette="blue">
                            <Status.Indicator /> {claim_type} 처리 중
                        </Status.Root>
                    )
                }

                if (claim.claim_status === 'COMPLETED') {
                    return (
                        <Status.Root colorPalette="green">
                            <Status.Indicator /> {claim_type} 완료
                        </Status.Root>
                    )
                }

                if (claim.claim_status === 'REJECTED') {
                    return (
                        <Status.Root colorPalette="red">
                            <Status.Indicator /> {claim_type} 거절
                        </Status.Root>
                    )
                }
            default:
                return '알 수 없음';
        }
    }

    const displayList = statusFilter ? orderList.filter(order => order.status === statusFilter) : orderList;

    return (
        <Stack w="full" rounded="md" border="1px solid #eee" p="20px" gap="6" textAlign="left">
            <Heading fontSize="sm" textAlign="left">{statusFilter === 'CLAIM' ? '취소/반품/교환 내역' : '주문 내역'}</Heading>
            {(!displayList || displayList.length <= 0) ? (
                <EmptyState.Root>
                    <EmptyState.Content>
                        <EmptyState.Indicator><LuShoppingCart /></EmptyState.Indicator>
                        <VStack textAlign="center">
                            <EmptyState.Title>내역이 없습니다.</EmptyState.Title>
                            <EmptyState.Description>
                                조회된 내역이 없습니다.
                            </EmptyState.Description>
                        </VStack>
                    </EmptyState.Content>
                </EmptyState.Root>
            ) : (
                <Stack gap="10">
                    {displayList.map((order) => (
                        <Stack key={order.order_code} shadow="md" rounded="md" p="20px" gap="5">
                            <HStack justifyContent="space-between">
                                <Text fontWeight="medium">{formatDateYMD(order.created_at)} 주문</Text>
                                <Link href={`/mypage/order/${order.order_code}`} fontSize="sm">상세 보기 <LuChevronRight /></Link>
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
                                        {orderStatus(order.status, order.product_order_claims)}
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