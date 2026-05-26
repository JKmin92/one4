import { useEffect, useState } from "react";
import axiosInstance from "../../../../utils/api";
import { Box, Button, Checkbox, Heading, HStack, Icon, Input, Link, Stack, Table } from "@chakra-ui/react";
import { formatDate, formatNumber } from "../../../../utils/simpleUtils";
import { toaster } from "../../../../components/ui/toaster";
import { LuExternalLink } from "react-icons/lu";

function UnpaidList() {
    const [orderList, setOrderList] = useState([]);
    const [allChecked, setAllChecked] = useState(false);
    const [checkedItems, setCheckedItems] = useState([]);

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

    useEffect(() => {

        loadOrderList();
    }, []);

    const loadOrderList = async () => {
        try {
            const res = await axiosInstance.get(`/admin/shop/order/list/pending`);
            setOrderList(res.data);
        } catch (e) {
            console.error(e);
        }
    }

    const submitPaidCheck = async () => {
        try {
            const body = { order_codes: checkedItems, status: 'PAID' };
            const response = await axiosInstance.put(`/admin/shop/order/status`, body);
            if (response.data.success) {
                loadOrderList();
                setCheckedItems([]);
                toaster.create({ title: '결제가 확인되었습니다.', type: 'success' });
            }
        } catch (e) {
            console.error(e);
            toaster.create({ title: '오류가 발생했습니다.', type: 'error' });
        }
    }

    return (
        <Stack p="30px" px="layoutX" gap="6">
            <Heading>입금전 주문 리스트</Heading>

            <form>
                <HStack>
                    <Input placeholder="검색어를 입력해주세요." />
                    <Button>검색</Button>
                </HStack>
            </form>

            <HStack>
                <Button size="xs" onClick={submitPaidCheck}>선택 상품 결제 확인</Button>
                <Button size="xs" variant="outline">선택 상품 주문 취소</Button>
            </HStack>

            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader textAlign="center">
                            <Checkbox.Root checked={allChecked} onCheckedChange={handleAllCheck}>
                                <Checkbox.HiddenInput />
                                <Checkbox.Control />
                            </Checkbox.Root>
                        </Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">주문일</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">주문번호</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">상품명</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">주문자</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">입금자</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">입금액</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">상태</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {orderList.map((order) => {
                        return (
                            <Table.Row key={order.order_code}>
                                <Table.Cell textAlign="center">
                                    <Checkbox.Root checked={checkedItems.includes(order.order_code)} onCheckedChange={(e) => handleSingleCheck(e, order.order_code)}>
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control />
                                    </Checkbox.Root>
                                </Table.Cell>
                                <Table.Cell textAlign="center">{formatDate(order.created_at)}</Table.Cell>
                                <Table.Cell textAlign="center">
                                    <HStack>
                                        <Link href={`/admin/shop/order/${order.order_code}`} target="_blank" color="fg.info">
                                            {order.order_code}
                                            <Icon size="xs"><LuExternalLink /></Icon>
                                        </Link>
                                    </HStack>
                                </Table.Cell>
                                <Table.Cell textAlign="center">{order.order_name}</Table.Cell>
                                <Table.Cell textAlign="center">{order.address.name}</Table.Cell>
                                <Table.Cell textAlign="center">{order.product_order_payment.deposit_name}</Table.Cell>
                                <Table.Cell textAlign="center">{formatNumber(order.actual_payment_amount)}</Table.Cell>
                                <Table.Cell textAlign="center">
                                    <Box fontSize="xs" bg={order.status === 'PENDING' ? 'orange' : 'blue'} rounded="sm" p="1" color="fg.inverted">
                                        {order.status === 'PENDING' ? '결제대기' : '결제완료'}
                                    </Box>
                                </Table.Cell>
                            </Table.Row>
                        )
                    })}

                    {orderList.length === 0 && (
                        <Table.Row>
                            <Table.Cell textAlign="center" colSpan={8} py="10">검색되는 주문이 없습니다.</Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table.Root>
        </Stack>
    )
}

export default UnpaidList;