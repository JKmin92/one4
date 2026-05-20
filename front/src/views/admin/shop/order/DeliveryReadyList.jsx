import { Box, Button, Checkbox, Heading, HStack, Image, Input, NativeSelect, Stack, StackSeparator, Table, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../utils/api";
import { formatDate, formatNumber } from "../../../../utils/simpleUtils";
import { ToggleTip } from "../../../../components/ui/toggle-tip";
import { LuInfo } from "react-icons/lu";

function DeliveryCompanySelectList({ value, onChange }) {

    return (
        <NativeSelect.Root size="sm" rounded="md">
            <NativeSelect.Field placeholder="택배사를 선택해주세요." value={value || ''} onChange={onChange}>
                <option value="한진택배">한진택배</option>
                <option value="CJ 대한통운">CJ 대한통운</option>
                <option value="롯데택배">롯데택배</option>
                <option value="우체국택배">우체국택배</option>
                <option value="현대택배">현대택배</option>
            </NativeSelect.Field>
        </NativeSelect.Root>
    )
}

function DeliveryReadyList() {

    const [orderList, setOrderList] = useState([]);
    const [allChecked, setAllChecked] = useState(false);
    const [checkedItems, setCheckedItems] = useState([]);
    const [deliveryInputs, setDeliveryInputs] = useState({});

    const handleDeliveryInputChange = (orderCode, itemCode, field, value) => {
        setDeliveryInputs(prev => ({
            ...prev,
            [orderCode]: {
                ...(prev[orderCode] || {}),
                [itemCode]: {
                    ...((prev[orderCode] || {})[itemCode] || { post_company: '', post_number: '' }),
                    [field]: value
                }
            }
        }));
    };

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
        getOrderList();
    }, []);

    const getOrderList = async () => {
        try {
            const res = await axiosInstance.get('/admin/shop/order/list/processing');
            if (res.data) {
                setOrderList(res.data);
                res.data.map((order) => {
                    if (order.product_order_deliveries) {
                        order.product_order_deliveries.map((delivery) => {
                            setDeliveryInputs(prev => ({
                                ...prev,
                                [delivery.order_code]: {
                                    ...((prev[delivery.order_code]) || {}),
                                    [delivery.order_item_code]: {
                                        post_company: delivery.post_company,
                                        post_number: delivery.post_number
                                    }
                                }
                            }))
                        })
                    }
                })

            }
        } catch (error) {
            console.log(error);
        }
    }

    const getPaymentMethod = (payment_type) => {
        switch (payment_type) {
            case 'CARD':
                return (<Box fontSize="xs" bg="blue" p="1" color="fg.inverted" rounded="sm">신용카드</Box>);
            case 'BANK':
                return (<Box fontSize="xs" bg="green" p="1" color="fg.inverted" rounded="sm">계좌이체</Box>);
            case 'ESCROW':
                return (<Box fontSize="xs" bg="orange" p="1" color="fg.inverted" rounded="sm">에스크로</Box>);
            default:
                return (<Box fontSize="xs" bg="gray" p="1" color="fg.inverted" rounded="sm">알 수 없음</Box>);
        }
    }

    /**
     * 체크된 주문에 송장번호 저장
     */
    const saveDeliveryInfo = async () => {
        if (checkedItems.length === 0) {
            alert('저장할 주문을 선택해주세요.');
            return;
        }

        const result = {};

        checkedItems.forEach(orderCode => {
            const order = orderList.find(o => o.order_code === orderCode);
            if (!order) return;

            const orderInputs = deliveryInputs[orderCode] || {};
            const firstItemCode = order.product_order_items[0]?.order_item_code;
            const firstItemData = orderInputs[firstItemCode] || { post_company: '', post_number: '' };

            result[orderCode] = order.product_order_items.map(item => {
                const inputData = orderInputs[item.order_item_code] || {};
                return {
                    order_item_code: item.order_item_code,
                    post_company: inputData.post_company || firstItemData.post_company,
                    post_number: inputData.post_number || firstItemData.post_number
                };
            });
        });

        try {
            const res = await axiosInstance.post('/admin/shop/order/delivery', result);
            if (res.data) {
                alert('배송 정보가 저장되었습니다.');
                getOrderList();
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

            <HStack>
                <Button size="xs">선택 상품 배송중으로 이동</Button>
                <Button size="xs" variant="outline">선택 상품 결제완료로 이동</Button>
                <Button size="xs" bg="bg.info" color="fg" onClick={saveDeliveryInfo}>택배사/송장번호 저장</Button>
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
                        <Table.ColumnHeader textAlign="center">주문자</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">상품명/옵션</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">수량</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">
                            송장번호
                            <ToggleTip content={<>송장번호/택배사 입력 후 배송중으로 변경 시 자동 저장됩니다.<br />첫번째 줄에 입력한 값은 같은 주문에 미기입된 송장번호에 동일하게 저장됩니다.</>}>
                                <Button size="xs" variant="ghost"><LuInfo /></Button>
                            </ToggleTip>
                        </Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">금액</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">결제수단</Table.ColumnHeader>
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
                                <Table.Cell textAlign="center">{order.order_code}</Table.Cell>
                                <Table.Cell textAlign="center">{order.address.name}</Table.Cell>

                                <Table.Cell pr="0">
                                    <Stack separator={<StackSeparator />} gap="2" >
                                        {order.product_order_items.map((orderItem) => (
                                            <HStack key={orderItem.order_item_code} gap="5" pl="2" minH="10">
                                                <Image src={orderItem.product_image_url} w="8" h="8" objectFit="cover" rounded="md" />
                                                <Stack gap="0" flex="1" overflow="hidden">
                                                    <Text whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" title={orderItem.product_name}>{orderItem.product_name}</Text>
                                                    {orderItem.product_option_code && (
                                                        <Text fontSize="xs" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" title={`[${orderItem.option_name}] : ${orderItem.option_value}`}>{`[${orderItem.option_name}] : ${orderItem.option_value}`}</Text>
                                                    )}
                                                </Stack>
                                            </HStack>
                                        ))}
                                    </Stack>
                                </Table.Cell>
                                <Table.Cell textAlign="center" px="0">
                                    <Stack separator={<StackSeparator />} gap="2">
                                        {order.product_order_items.map((orderItem) => (
                                            <HStack key={orderItem.order_item_code} justify="center" minH="10">
                                                <Text textAlign="center">{orderItem.quantity}</Text>
                                            </HStack>
                                        ))}
                                    </Stack>
                                </Table.Cell>
                                <Table.Cell textAlign="center" px="0">
                                    <Stack separator={<StackSeparator />} gap="2">
                                        {order.product_order_items.map((orderItem) => (
                                            <HStack key={orderItem.order_item_code} justify="center" minH="10" pr="2">
                                                <DeliveryCompanySelectList
                                                    value={deliveryInputs[order.order_code]?.[orderItem.order_item_code]?.post_company || ''}
                                                    onChange={(e) => handleDeliveryInputChange(order.order_code, orderItem.order_item_code, 'post_company', e.target.value)}
                                                />
                                                <Input
                                                    placeholder="송장번호를 입력해주세요"
                                                    fontSize="sm"
                                                    rounded="md"
                                                    value={deliveryInputs[order.order_code]?.[orderItem.order_item_code]?.post_number || ''}
                                                    onChange={(e) => handleDeliveryInputChange(order.order_code, orderItem.order_item_code, 'post_number', e.target.value)}
                                                />
                                            </HStack>
                                        ))}
                                    </Stack>
                                </Table.Cell>
                                <Table.Cell textAlign="center">{formatNumber(order.actual_payment_amount)}</Table.Cell>
                                <Table.Cell textAlign="center">{getPaymentMethod(order.product_order_payment.payment_type)}</Table.Cell>
                            </Table.Row>
                        )
                    })}
                </Table.Body>
            </Table.Root>
        </Stack>
    )
}

export default DeliveryReadyList;