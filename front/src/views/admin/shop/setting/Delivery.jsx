import { Button, Checkbox, Heading, HStack, Input, InputGroup, NativeSelect, Stack, Table, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../utils/api";
import { toaster } from "../../../../components/ui/toaster";

function Delivery() {

    const [deliveryMethod, setDeliveryMethod] = useState('FREE');
    const [dayDeliveryTime, setDayDeliveryTime] = useState('');
    const [dayDeliveryImpassable, setDayDeliveryImpassable] = useState([]);
    const [basicDeliveryPrice, setBasicDeliveryPrice] = useState('');
    const [orderStandard, setOrderStandard] = useState('');
    const [islandPrice, setIslandPrice] = useState(0);

    useEffect(() => {
        getDelivery();
    }, []);

    const getDelivery = async () => {
        try {
            const res = await axiosInstance.get('/admin/shop/setting/delivery');
            setDeliveryMethod(res.data.delivery_method);
            setDayDeliveryTime(res.data.day_delivery_time);
            setDayDeliveryImpassable(res.data.day_delivery_impassable);
            setBasicDeliveryPrice(res.data.basic_delivery_price);
            setOrderStandard(res.data.order_standard);
            setIslandPrice(res.data.island_price);
        } catch (e) {
            console.error(e);
            toaster.create({ title: '오류가 발생했습니다.', type: 'error' });
        }
    }

    const handleImpassableChange = (e, value) => {
        if (e.target.checked) {
            setDayDeliveryImpassable([...dayDeliveryImpassable, value]);
        } else {
            setDayDeliveryImpassable(dayDeliveryImpassable.filter((item) => item !== value));
        }
    }

    const saveDeliverySetting = async () => {
        try {
            const data = {
                delivery_method: deliveryMethod,
                day_delivery_time: dayDeliveryTime,
                day_delivery_impassable: dayDeliveryImpassable,
                basic_delivery_price: basicDeliveryPrice,
                order_standard: orderStandard,
            }

            const res = await axiosInstance.put('/admin/shop/setting/delivery', data);
            console.log(res.data);
            toaster.create({ title: '저장되었습니다.', type: 'success' });
        } catch (e) {
            console.error(e);
            toaster.create({ title: '오류가 발생했습니다.', type: 'error' });
        }
    }

    return (
        <Stack p="30px" px="layoutX" gap="6">
            <HStack justifyContent="space-between">
                <Heading>배송설정</Heading>
                <Button onClick={saveDeliverySetting}>저장</Button>
            </HStack>

            <Table.Root>
                <Table.ColumnGroup>
                    <Table.Column w="200px" />
                    <Table.Column w="auto" />
                </Table.ColumnGroup>
                <Table.Body>
                    <Table.Row>
                        <Table.ColumnHeader>당일발송</Table.ColumnHeader>
                        <Table.Cell>
                            <InputGroup endElement="시 이전 주문 시 당일 발송" w="300px"><Input value={dayDeliveryTime} onChange={(e) => setDayDeliveryTime(e.target.value)} /></InputGroup>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.ColumnHeader>당일 발송 불가일</Table.ColumnHeader>
                        <Table.Cell>
                            <HStack gap="12">
                                <Checkbox.Root checked={dayDeliveryImpassable.includes('weekdays')} onChange={(e) => handleImpassableChange(e, 'weekdays')}>
                                    <Checkbox.HiddenInput value="weekdays" />
                                    <Checkbox.Control />
                                    <Checkbox.Label>평일(월 - 금)</Checkbox.Label>
                                </Checkbox.Root>
                                <Checkbox.Root checked={dayDeliveryImpassable.includes('weekends')} onChange={(e) => handleImpassableChange(e, 'weekends')}>
                                    <Checkbox.HiddenInput value="weekends" />
                                    <Checkbox.Control />
                                    <Checkbox.Label>주말(토 - 일)</Checkbox.Label>
                                </Checkbox.Root>
                                <Checkbox.Root checked={dayDeliveryImpassable.includes('holidays')} onChange={(e) => handleImpassableChange(e, 'holidays')}>
                                    <Checkbox.HiddenInput value="holidays" />
                                    <Checkbox.Control />
                                    <Checkbox.Label>공휴일</Checkbox.Label>
                                </Checkbox.Root>
                                <Checkbox.Root checked={dayDeliveryImpassable.includes('accHolidays')} onChange={(e) => handleImpassableChange(e, 'accHolidays')}>
                                    <Checkbox.HiddenInput value="accHolidays" />
                                    <Checkbox.Control />
                                    <Checkbox.Label>기타 택배 휴무일</Checkbox.Label>
                                </Checkbox.Root>
                            </HStack>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.ColumnHeader>배송비 설정</Table.ColumnHeader>
                        <Table.Cell>
                            <NativeSelect.Root w="300px">
                                <NativeSelect.Field value={deliveryMethod} onChange={(e) => setDeliveryMethod(e.target.value)}>
                                    <option value="FREE">배송비 무료</option>
                                    <option value="FIXED">고정 배송비</option>
                                    <option value="PRICE">구매 금액에 따른 배송비</option>
                                </NativeSelect.Field>
                                <NativeSelect.Indicator />
                            </NativeSelect.Root>
                        </Table.Cell>
                    </Table.Row>
                    {deliveryMethod === 'FIXED' && (
                        <Table.Row>
                            <Table.ColumnHeader>고정 배송비</Table.ColumnHeader>
                            <Table.Cell>
                                <InputGroup endElement="원" w="300px"><Input value={basicDeliveryPrice} onChange={(e) => setBasicDeliveryPrice(e.target.value)} /></InputGroup>
                            </Table.Cell>
                        </Table.Row>
                    )}
                    {deliveryMethod === 'PRICE' && (
                        <Table.Row>
                            <Table.ColumnHeader>구매 금액에 따른 배송비</Table.ColumnHeader>
                            <Table.Cell>
                                <HStack gap="12">
                                    <HStack>
                                        <Text>구매 금액이</Text>
                                        <InputGroup endElement="원" w="300px"><Input value={orderStandard} onChange={(e) => setOrderStandard(e.target.value)} /></InputGroup>
                                        <Text>미만일 경우</Text>
                                    </HStack>
                                    <HStack>
                                        <Text>택배비</Text>
                                        <InputGroup endElement="원" w="300px"><Input value={basicDeliveryPrice} onChange={(e) => setBasicDeliveryPrice(e.target.value)} /></InputGroup>
                                    </HStack>
                                </HStack>
                            </Table.Cell>
                        </Table.Row>
                    )}
                    <Table.Row>
                        <Table.ColumnHeader>도서산간지역 배송비 추가</Table.ColumnHeader>
                        <Table.Cell>
                            <InputGroup endElement="원" w="300px"><Input value={islandPrice} onChange={(e) => setIslandPrice(e.target.value)} /></InputGroup>
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table.Root>
        </Stack>
    )

}

export default Delivery;