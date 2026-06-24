import { Button, HStack, Heading, InputGroup, Input, Stack, Table } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ToggleTip } from "../../../../components/ui/toggle-tip";
import { LuInfo } from "react-icons/lu";
import { toaster } from "../../../../components/ui/toaster";
import axiosInstance from "../../../../utils/api";

function Payment() {

    const [bankAutoCancelDays, setBankAutoCancelDays] = useState("");
    const [orderAutoCompleteDays, setOrderAutoCompleteDays] = useState("");

    const getShopOrderSetting = async () => {
        try {
            const res = await axiosInstance.get('/admin/shop/setting/order');
            setBankAutoCancelDays(res.data.bank_auto_cancel_days);
            setOrderAutoCompleteDays(res.data.order_auto_complete_days);
        } catch (e) {
            console.error(e);
            toaster.create({ title: '오류가 발생했습니다.', type: 'error' });
        }
    }

    useEffect(() => {
        getShopOrderSetting();
    }, []);

    const updateShopOrderSetting = async () => {
        try {
            const data = {
                bank_auto_cancel_days: bankAutoCancelDays,
                order_auto_complete_days: orderAutoCompleteDays,
            }
            await axiosInstance.put('/admin/shop/setting/order', data);
            toaster.create({ title: "저장되었습니다.", type: "success" });
            getShopOrderSetting();
        } catch (e) {
            console.error(e);
            toaster.create({ title: '오류가 발생했습니다.', type: 'error' });
        }
    }

    return (
        <Stack p="30px" px="layoutX" gap="6">
            <HStack justifyContent="space-between">
                <Heading>결제 설정</Heading>
                <Button onClick={updateShopOrderSetting}>저장</Button>
            </HStack>

            <Table.Root>
                <Table.ColumnGroup>
                    <Table.Column w="200px" />
                    <Table.Column w="auto" />
                </Table.ColumnGroup>
                <Table.Body>
                    <Table.Row>
                        <Table.ColumnHeader>자동 취소일<ToggleTip content="무통장 주문건 한정으로 적용됩니다."><Button size="xs" variant="ghost"><LuInfo /></Button></ToggleTip></Table.ColumnHeader>
                        <Table.Cell>
                            <InputGroup endElement="일 이후 자동 주문취소" w="300px">
                                <Input value={bankAutoCancelDays} onChange={(e) => setBankAutoCancelDays(e.target.value)} />
                            </InputGroup>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.ColumnHeader>자동 확정일<ToggleTip content="배송 완료된 주문건 한정으로 적용됩니다."><Button size="xs" variant="ghost"><LuInfo /></Button></ToggleTip></Table.ColumnHeader>
                        <Table.Cell>
                            <InputGroup endElement="일 이후 자동 주문확정" w="300px">
                                <Input value={orderAutoCompleteDays} onChange={(e) => setOrderAutoCompleteDays(e.target.value)} />
                            </InputGroup>
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table.Root>
        </Stack>
    )
}

export default Payment;