import { Button, Heading, HStack, Image, Stack, StackSeparator, Table, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toaster } from "../../../components/ui/toaster";
import axiosInstance from "../../../utils/api";
import { formatDate, formatDateToMonthDay, formatNumber } from "../../../utils/simpleUtils";

function OrderComplete() {
    const location = useLocation();
    const navigate = useNavigate();
    const [productOrder, setProductOrder] = useState();
    const [productOrderItems, setProductOrderItems] = useState();
    const [productOrderPayment, setProductOrderPayment] = useState();
    const [address, setAddress] = useState();
    const orderCode = location.state.orderCode;

    useEffect(() => {
        if (orderCode) {
            const getProductOrder = async () => {
                try {
                    const response = await axiosInstance.get(`/shop/product/order/${orderCode}`);
                    setProductOrder(response.data.product_order);
                    setProductOrderItems(response.data.product_order_items);
                    setProductOrderPayment(response.data.product_order_payment);
                    setAddress(response.data.address);
                } catch (e) {
                    console.error(e);
                    toaster.create({ title: '오류가 발생되었습니다.', type: 'error' });
                }
            }

            getProductOrder();
        }
    }, []);

    return (
        <Stack p={{ base: '40px 0', md: "80px 0" }} px={{ base: '15px', md: "layoutX" }} width={{ base: 'full', md: "6xl" }} margin="auto" gap="6">
            <Heading>주문이 완료 되었습니다.</Heading>
            <Stack>
                <Stack border="1px solid lightgray" rounded="lg" p="4" gap="4" separator={<StackSeparator />}>
                    {productOrderItems?.map((productOrderItem) => (
                        <Stack key={productOrderItem.order_item_code} direction="row" justifyContent="space-between" alignItems="center">
                            <HStack gap="6">
                                <Image src={productOrderItem.image_url} w="28" rounded="md" />
                                <Stack>
                                    <Text fontWeight="medium" fontSize="lg">{productOrderItem.product_name}</Text>
                                    {productOrderItem.product_option_code && (
                                        <Text fontSize="sm">{productOrderItem.option_name}: {productOrderItem.option_value}</Text>
                                    )}
                                    <Text fontSize="sm">수량: {productOrderItem.quantity}</Text>

                                </Stack>
                            </HStack>
                            <Stack textAlign="end">
                                {productOrderItem.discount_value > 0 && (
                                    <Text textDecoration="line-through" fontSize="sm" color="gray">{formatNumber(productOrderItem.product_price * productOrderItem.quantity)}원</Text>
                                )}
                                <Text fontWeight="semibold">{formatNumber((productOrderItem.product_price - productOrderItem.discount_value) * productOrderItem.quantity)}원</Text>
                            </Stack>
                        </Stack>
                    ))}
                </Stack>
            </Stack>
            <Table.Root showColumnBorder>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>주문일시</Table.Cell>
                        <Table.Cell>{formatDate(productOrder?.created_at)}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell w="52">주문자</Table.Cell>
                        <Table.Cell>{address?.name}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell w="52">연락처</Table.Cell>
                        <Table.Cell>{address?.phone}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell w="52">배송지</Table.Cell>
                        <Table.Cell>[{address?.postcode}] {address?.address} {address?.detailAddress}</Table.Cell>
                    </Table.Row>
                    {address?.post_request && (
                        <Table.Row>
                            <Table.Cell w="52">요청사항</Table.Cell>
                            <Table.Cell>{address?.post_request}</Table.Cell>
                        </Table.Row>
                    )}

                    <Table.Row>
                        <Table.Cell w="52">총 결제 금액</Table.Cell>
                        <Table.Cell>24,500원</Table.Cell>
                    </Table.Row>
                    {productOrderPayment?.payment_type === 'BANK' && productOrder.status === 'PENDING' && (
                        <Table.Row>
                            <Table.Cell w="52">결제 정보</Table.Cell>
                            <Table.Cell>
                                <Stack gap="2">
                                    <Text>기업은행 123-45871-27156(예금주 : 에이민)</Text>
                                    <Text>입금자명 : {productOrderPayment.deposit_name}</Text>
                                    <Text fontSize="xs">* 실제 결제금액과 입금자명이 일치하지 않으면 발송이 어렵습니다.</Text>
                                    <Text>결제 기한 : {formatDateToMonthDay(productOrderPayment.payment_deadline)}까지</Text>
                                </Stack>
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table.Root>
            <HStack justifyContent="center" gap="4">
                <Button onClick={() => navigate(`/mypage/order/${orderCode}`)}>주문 내역 확인</Button>
                <Button variant="outline">쇼핑 계속하기</Button>
            </HStack>
        </Stack>
    )
}

export default OrderComplete;