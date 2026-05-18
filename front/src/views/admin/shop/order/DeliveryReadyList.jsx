import { Button, Checkbox, Heading, HStack, Input, Stack, Table } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../utils/api";

function DeliveryReadyList() {

    const [orderList, setOrderList] = useState([]);
    const [allChecked, setAllChecked] = useState(false);

    useEffect(() => {
        getOrderList();
    }, []);

    const getOrderList = async () => {
        try {
            const res = await axiosInstance.get('/shop/product/order/processing');
            if (res.data) {
                console.log(res.data);
                setOrderList(res.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Stack p="30px" px="layoutX" gap="6">
            <Heading>배송준비중 주문 리스트</Heading>

            <form>
                <HStack>
                    <Input placeholder="검색어를 입력해주세요." />
                    <Button>검색</Button>
                </HStack>
            </form>

            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>
                            <Checkbox.Root checked={allChecked} onCheckedChange={(e) => setAllChecked(!!e.checked)}>
                                <Checkbox.HiddenInput />
                                <Checkbox.Control />
                            </Checkbox.Root>
                        </Table.ColumnHeader>
                        <Table.ColumnHeader>주문일</Table.ColumnHeader>
                        <Table.ColumnHeader>주문번호</Table.ColumnHeader>
                        <Table.ColumnHeader>주문자</Table.ColumnHeader>
                        <Table.ColumnHeader>송장번호</Table.ColumnHeader>
                        <Table.ColumnHeader>상품명/옵션</Table.ColumnHeader>
                        <Table.ColumnHeader>수량</Table.ColumnHeader>
                        <Table.ColumnHeader>금액</Table.ColumnHeader>
                        <Table.ColumnHeader>결제수단</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
            </Table.Root>
        </Stack>
    )
}

export default DeliveryReadyList;