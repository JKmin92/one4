import { Box, HStack, Icon, Link, Stack, Table, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../../utils/api";
import { formatDate, formatNumber } from "../../../../../utils/simpleUtils";
import { LuExternalLink } from "react-icons/lu";
import { toaster } from "../../../../../components/ui/toaster";
import { PiSmileySad } from "react-icons/pi";

function OrderDetail({ user_code }) {

    const [orderList, setOrderList] = useState([]);

    useEffect(() => {
        const getUserOrderList = async () => {
            try {
                const orderList = await axiosInstance.get(`/admin/member/user/orderList/${user_code}`);
                setOrderList(orderList.data);
            } catch (error) {
                console.error(error);
                toaster.create({ title: '주문 내역 불러오는데 에러가 발생했습니다.', type: 'error' });
            }
        }
        getUserOrderList();
    }, [user_code]);

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
        <Table.Root>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader textAlign="center">주문번호</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">주문일시</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">주문상품</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">수량</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">총 상품금액</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">실제 결제금액</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">결제방식</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">처리상태</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {orderList.length === 0 ? (
                    <Table.Row>
                        <Table.Cell colSpan="8" textAlign="center">
                            <Stack alignItems="center" py="10">
                                <Icon fontSize="7xl"><PiSmileySad /></Icon>
                                <Text>주문 내역이 없습니다.</Text>
                            </Stack>
                        </Table.Cell>
                    </Table.Row>
                ) : orderList?.map((order, index) => {
                    const itemCount = order.product_order_items.length;
                    const total_price = order.product_order_items.reduce((acc, item) => acc + item.price, 0) + order.delivery_price;
                    return (
                        <Table.Row key={order.order_code}>
                            <Table.Cell rowSpan={itemCount}>
                                <HStack justify="center">
                                    <Link href={`/admin/shop/order/${order.order_code}`} target="_blank" color="fg.info">
                                        {order.order_code}
                                        <Icon size="xs"><LuExternalLink /></Icon>
                                    </Link>
                                </HStack>
                            </Table.Cell>
                            <Table.Cell rowSpan={itemCount} textAlign="center">{formatDate(order.created_at)}</Table.Cell>
                            {order.product_order_items.map((item, index) => {
                                const key = order.order_code + item.order_item_code;
                                return (
                                    <>
                                        <Table.Cell textAlign="center">{item.product_name}</Table.Cell>
                                        <Table.Cell textAlign="center">{formatNumber(item.quantity)}</Table.Cell>
                                        <Table.Cell textAlign="center">{formatNumber(item.price)}</Table.Cell>
                                    </>
                                )
                            })}
                            <Table.Cell rowSpan={itemCount} textAlign="center">{formatNumber(total_price)}</Table.Cell>
                            <Table.Cell rowSpan={itemCount} textAlign="center">{getPaymentMethod(order.product_order_payment.payment_type)}</Table.Cell>
                            <Table.Cell rowSpan={itemCount} textAlign="center">
                                <Box bg={order.status === 'PENDING' ? 'orange' : 'blue'} rounded="sm" p="1" fontSize="xs" color="fg.inverted">
                                    {order.status === 'PENDING' ? '결제대기' : '결제완료'}
                                </Box>
                            </Table.Cell>
                        </Table.Row>
                    )
                })}
            </Table.Body>
        </Table.Root>
    )

}

export default OrderDetail;