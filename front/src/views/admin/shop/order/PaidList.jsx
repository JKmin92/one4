import { Box, Button, Checkbox, Heading, HStack, Image, Input, Stack, StackSeparator, Table, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../utils/api";
import { formatDate, formatNumber } from "../../../../utils/simpleUtils";

function PaidList() {

    const [orderList, setOrderList] = useState([]);
    const [allChecked, setAllChecked] = useState(false);
    const [checkedItems, setCheckedItems] = useState([]);

    useEffect(() => {
        const loadOrderList = async () => {
            try {
                const res = await axiosInstance.get(`/admin/shop/order/list/paid`);
                setOrderList(res.data);
            } catch (e) {
                console.error(e);
            }
        }
        loadOrderList();
    }, []);

    const handleAllCheck = (e) => {
        const isChecked = !!e.checked;
        setAllChecked(isChecked);
        if (isChecked) {
            setCheckedItems(orderList.map(order => order.order_code));
        } else {
            setCheckedItems([]);
        }
    }

    const handleSingleCheck = (e, order_code) => {
        const isChecked = !!e.checked;
        if (isChecked) {
            setCheckedItems(prev => [...prev, order_code]);
        } else {
            setCheckedItems(prev => prev.filter(code => code !== order_code));
        }
    }

    useEffect(() => {
        if (orderList.length > 0 && checkedItems.length === orderList.length) {
            setAllChecked(true);
        } else {
            setAllChecked(false);
        }
    }, [checkedItems, orderList]);

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
            <Heading>결제 완료 주문 리스트</Heading>

            <form>
                <HStack>
                    <Input placeholder="검색어를 입력해주세요." />
                    <Button>검색</Button>
                </HStack>
            </form>

            <HStack>
                <Button size="xs">선택 상품 배송준비로 이동</Button>
                <Button size="xs" variant="outline">선택 상품 입금전으로 이동</Button>
            </HStack>

            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader textAlign="center"><Checkbox.Root checked={allChecked} onCheckedChange={handleAllCheck}><Checkbox.HiddenInput /><Checkbox.Control /></Checkbox.Root></Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">주문일</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">주문번호</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">주문자</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center" pr="0">상품명/옵션</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center" pl="0">수량</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">상품구매금액</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">총 실결제금액</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">결제방식</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {orderList.map((order) => {
                        return (
                            <Table.Row key={order.order_code}>
                                <Table.Cell textAlign="center">
                                    <Checkbox.Root checked={checkedItems.includes(order.order_code)} onCheckedChange={(e) => handleSingleCheck(e, order.order_code)}><Checkbox.HiddenInput /><Checkbox.Control /></Checkbox.Root>
                                </Table.Cell>
                                <Table.Cell textAlign="center">{formatDate(order.created_at)}</Table.Cell>
                                <Table.Cell textAlign="center">{order.order_code}</Table.Cell>
                                <Table.Cell textAlign="center">{order.address.name}</Table.Cell>
                                <Table.Cell pr="0">
                                    <Stack separator={<StackSeparator />} gap="2" >
                                        {order.product_order_items.map((orderItem) => (
                                            <HStack key={orderItem.order_item_code} gap="5" pl="2" minH="10">
                                                <Image src={orderItem.product_image_url} w="8" h="8" objectFit="cover" rounded="md" />
                                                <Stack gap="0">
                                                    <Text>{orderItem.product_name}</Text>
                                                    {orderItem.product_option_code && (
                                                        <Text fontSize="xs">[{orderItem.option_name}] : {orderItem.option_value}</Text>
                                                    )}
                                                </Stack>
                                            </HStack>
                                        ))}
                                    </Stack>
                                </Table.Cell>
                                <Table.Cell pl="0">
                                    <Stack separator={<StackSeparator />} gap="2">
                                        {order.product_order_items.map((orderItem) => (
                                            <HStack key={orderItem.order_item_code} justify="center" minH="10">
                                                <Text textAlign="center">{orderItem.quantity}</Text>
                                            </HStack>
                                        ))}
                                    </Stack>
                                </Table.Cell>
                                <Table.Cell textAlign="center">{formatNumber(order.total_product_price)}</Table.Cell>
                                <Table.Cell textAlign="center">{formatNumber(order.actual_payment_amount)}</Table.Cell>
                                <Table.Cell textAlign="center" fontSize="xs">{getPaymentMethod(order.product_order_payment.payment_type)}</Table.Cell>
                            </Table.Row>
                        )
                    })}
                </Table.Body>
            </Table.Root>
        </Stack>
    )
}

export default PaidList;