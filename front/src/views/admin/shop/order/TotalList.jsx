import { Box, Button, Heading, HStack, Icon, Input, Link, Stack, Table } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../utils/api";
import { formatDate, formatNumber } from "../../../../utils/simpleUtils";
import { LuExternalLink } from "react-icons/lu";

function TotalList() {
    const [orderList, setOrderList] = useState([]);

    useEffect(() => {
        const loadOrderList = async () => {
            try {
                const res = await axiosInstance.get(`/admin/shop/order/list/total`);
                console.log(res.data);
                setOrderList(res.data);
            } catch (e) {
                console.error(e);
            }
        }
        loadOrderList();
    }, []);

    const getPaymentMethod = (payment_type) => {
        switch (payment_type) {
            case 'CARD':
                return (<Box bg="blue" p="1" color="fg.inverted" rounded="sm">신용카드</Box>);
            case 'BANK':
                return (<Box bg="green" p="1" color="fg.inverted" rounded="sm">계좌이체</Box>);
            case 'ESCROW':
                return (<Box bg="orange" p="1" color="fg.inverted" rounded="sm">에스크로</Box>);
            default:
                return (<Box bg="gray" p="1" color="fg.inverted" rounded="sm">알 수 없음</Box>);
        }
    }

    return (
        <Stack p="30px" px="layoutX" gap="6">
            <Heading>주문 전체 리스트</Heading>
            <form>
                <HStack>
                    <Input placeholder="검색어를 입력해주세요." />
                    <Button>검색</Button>
                </HStack>
            </form>
            <Table.Root >
                <Table.ColumnGroup>
                    <Table.Column w="auto" />
                    <Table.Column w="auto" />
                    <Table.Column w="auto" />
                    <Table.Column w="auto" />
                    <Table.Column w="auto" />
                    <Table.Column w="auto" />
                    <Table.Column w="auto" />
                    <Table.Column w="auto" />
                    <Table.Column w="20" />
                    <Table.Column w="20" />
                    <Table.Column w="20" />
                    <Table.Column w="20" />
                    <Table.Column w="20" />
                    <Table.Column w="20" />
                </Table.ColumnGroup>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader textAlign="center">주문일</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">주문번호</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">주문자</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">상품명</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">총 상품구매금액</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">총 실결제금액</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">결제수단</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">결제상태</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">미배송</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">배송중</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">배송완료</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">취소</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">교환</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">반품</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {orderList.map((order) => {
                        const notSendCount = order.product_order_items.filter((item) => item.status === 'PROCESSING' || item.status === 'PAID').length;
                        const deliveryCount = order.product_order_items.filter((item) => item.status === 'SHIPPING').length;
                        const deliveredCount = order.product_order_items.filter((item) => item.status === 'DELIVERED' || item.status === 'COMPLETED').length;
                        const canceledCount = order.product_order_items.filter((item) => item.status === 'CANCELED').length;
                        const exchangeCount = order.product_order_items.filter((item) => item.status === 'EXCHANGE').length;
                        const returnCount = order.product_order_items.filter((item) => item.status === 'RETURN').length;

                        return (
                            <Table.Row key={order.order_code}>
                                <Table.Cell textAlign="center">{formatDate(order.created_at)}</Table.Cell>
                                <Table.Cell textAlign="center">
                                    <HStack>
                                        <Link href={`/admin/shop/order/${order.order_code}`} target="_blank" color="fg.info">
                                            {order.order_code}
                                            <Icon size="xs"><LuExternalLink /></Icon>
                                        </Link>
                                    </HStack>
                                </Table.Cell>
                                <Table.Cell textAlign="center">{order.address.name}</Table.Cell>
                                <Table.Cell>{order.order_name}</Table.Cell>
                                <Table.Cell textAlign="center">{formatNumber(order.total_product_price)}</Table.Cell>
                                <Table.Cell textAlign="center">{formatNumber(order.actual_payment_amount)}</Table.Cell>
                                <Table.Cell textAlign="center" fontSize="xs">{getPaymentMethod(order.product_order_payment.payment_type)}</Table.Cell>
                                <Table.Cell textAlign="center">
                                    <Box bg={order.status === 'PENDING' ? 'orange' : 'blue'} rounded="sm" p="1" fontSize="xs" color="fg.inverted">
                                        {order.status === 'PENDING' ? '결제대기' : '결제완료'}
                                    </Box>
                                </Table.Cell>
                                <Table.Cell textAlign="center">{formatNumber(notSendCount)}</Table.Cell>
                                <Table.Cell textAlign="center">{formatNumber(deliveryCount)}</Table.Cell>
                                <Table.Cell textAlign="center">{formatNumber(deliveredCount)}</Table.Cell>
                                <Table.Cell textAlign="center">{formatNumber(canceledCount)}</Table.Cell>
                                <Table.Cell textAlign="center">{formatNumber(exchangeCount)}</Table.Cell>
                                <Table.Cell textAlign="center">{formatNumber(returnCount)}</Table.Cell>
                            </Table.Row>
                        )
                    })}
                </Table.Body>
            </Table.Root>
        </Stack >
    )
}

export default TotalList;