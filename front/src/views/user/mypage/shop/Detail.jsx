import { Alert, Button, DataList, Heading, HStack, Image, Link, Stack, Status, Table, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { toaster } from "../../../../components/ui/toaster";
import axiosInstance from "../../../../utils/api";
import { useParams } from "react-router-dom";
import { formatDate, formatDateToMonthDay, formatDateYMD, formatNumber } from "../../../../utils/simpleUtils";
import { LuBadgeAlert, LuDot } from "react-icons/lu";

function Detail() {

    const { order_code } = useParams();
    const [productOrder, setProductOrder] = useState();
    const [productOrderItems, setProductOrderItems] = useState();
    const [productOrderPayment, setProductOrderPayment] = useState();
    const [address, setAddress] = useState();

    useEffect(() => {
        const getOrderData = async () => {
            try {
                const response = await axiosInstance.get(`/shop/product/order/${order_code}`);
                if (response.data) {
                    console.log(response.data);
                    setProductOrder(response.data.product_order);
                    setProductOrderItems(response.data.product_order_items);
                    setProductOrderPayment(response.data.product_order_payment);
                    setAddress(response.data.address);
                }
            } catch (e) {
                console.error(e);
                toaster.create({ title: '오류가 발생했습니다.', type: 'error' });
            }
        }
        getOrderData();
    }, [order_code]);

    const getPaymentMethod = (payment_type) => {
        switch (payment_type) {
            case 'CARD':
                return '신용카드';
            case 'BANK':
                return '계좌이체';
            case 'ESCROW':
                return '에스크로';
            default:
                return '알 수 없음';
        }
    }

    const orderStatus = (status) => {
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
            case 'CANCELED':
                return (
                    <Status.Root colorPalette="orange">
                        <Status.Indicator /> 주문 취소
                    </Status.Root>
                )
            case 'CLAIM':
                return (
                    <Status.Root colorPalette="red">
                        <Status.Indicator /> 클레임 접수
                    </Status.Root>
                )
            default:
                return '알 수 없음';
        }
    }

    return (
        <Stack w="full" rounded="md" border="1px solid #eee" p="20px" gap="6" textAlign="left">
            <Heading fontSize="sm" textAlign="left">주문 상세</Heading>
            <Stack>
                {orderStatus(productOrder?.status)}
                <HStack gap="0">
                    <Text fontWeight="medium">{formatDateYMD(productOrder?.created_at)} 주문</Text>
                    <LuDot />
                    <Text>주문번호 {productOrder?.order_code}</Text>
                </HStack>
            </Stack>
            {productOrder?.status === 'PENDING' && (
                <Alert.Root status="warning">
                    <Alert.Indicator>
                        <LuBadgeAlert />
                    </Alert.Indicator>
                    <Alert.Content>
                        <Alert.Title>{formatDateToMonthDay(productOrderPayment?.payment_deadline)}까지 결제하지 않으시면 주문이 자동 취소됩니다.</Alert.Title>
                        <Alert.Description>
                            <Stack direction="row" gap="5">
                                <Text>기업은행 123-45871-27156(예금주 : 에이민)</Text>
                                <Text>입금자명 : {productOrderPayment?.deposit_name}</Text>
                                <Text fontSize="xs">* 실제 결제금액과 입금자명이 일치하지 않으면 발송이 어렵습니다.</Text>
                            </Stack>
                        </Alert.Description>
                    </Alert.Content>
                </Alert.Root>
            )}
            <Stack>
                {productOrderItems?.map((item) => (
                    <Stack key={item.order_item_code} direction="row" gap="5">
                        <Image src={item.image_url} w="24" rounded="md" />
                        <Stack>
                            <Link target="_blank" href={`/products/${item.product_code}`}>
                                <Text fontWeight="medium">{item.product_name}</Text>
                            </Link>

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
                ))}
            </Stack>
            <Table.Root>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>받는사람</Table.Cell>
                        <Table.Cell>{address?.name}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>연락처</Table.Cell>
                        <Table.Cell>{address?.phone}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>배송지</Table.Cell>
                        <Table.Cell>[{address?.postcode}] {address?.address} {address?.detailAddress}</Table.Cell>
                    </Table.Row>
                    {address?.post_request && (
                        <Table.Row>
                            <Table.Cell>배송요청사항</Table.Cell>
                            <Table.Cell>{address?.post_request}</Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table.Root>

            <Table.Root>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell w="2/3">
                            <Stack>
                                <Text fontSize="sm" color="fg.muted">결제 수단</Text>
                                <Text fontSize="md">{getPaymentMethod(productOrderPayment?.payment_type)}</Text>
                            </Stack>
                        </Table.Cell>
                        <Table.Cell w="1/3">
                            <DataList.Root orientation="horizontal" gap="1">
                                <DataList.Item>
                                    <DataList.ItemLabel>총 상품 가격</DataList.ItemLabel>
                                    <DataList.ItemValue>{formatNumber(productOrder?.total_product_price)}</DataList.ItemValue>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.ItemLabel>배송비</DataList.ItemLabel>
                                    <DataList.ItemValue>{formatNumber(productOrder?.delivery_price)}</DataList.ItemValue>
                                </DataList.Item>
                            </DataList.Root>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell w="2/3">
                            {productOrderPayment?.payment_type === "BANK" && (
                                <Stack gap="1">
                                    <Text>기업은행 123-45871-27156(예금주 : 에이민)</Text>
                                    <Text>입금자명 : {productOrderPayment?.deposit_name}</Text>
                                    <Text fontSize="xs">* 실제 결제금액과 입금자명이 일치하지 않으면 발송이 어렵습니다.</Text>
                                    {productOrder?.status === 'PENDING' && (
                                        <Text>결제 기한 : {formatDateToMonthDay(productOrderPayment?.payment_deadline)}까지</Text>
                                    )}
                                </Stack>
                            )}
                        </Table.Cell>
                        <Table.Cell w="1/3">
                            <DataList.Root orientation="horizontal" fontWeight="medium">
                                <DataList.Item>
                                    <DataList.ItemLabel>총 결제 금액</DataList.ItemLabel>
                                    <DataList.ItemValue>{formatNumber(productOrder?.actual_payment_amount)}</DataList.ItemValue>
                                </DataList.Item>
                            </DataList.Root>
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table.Root>
            <Stack direction="row" justifyContent="center">
                {productOrder?.status === 'PENDING' && (
                    <Button variant="outline" onClick={() => { }}>주문취소</Button>
                )}
                {productOrder?.status === 'PAID' && (
                    <Button variant="outline" onClick={() => { }}>환불신청</Button>
                )}
                {(productOrder?.status === 'SHIPPING' || productOrder?.status === 'PROCESSING' || productOrder?.status === 'DELIVERED') && (
                    <>
                        <Button onClick={() => { }}>구매확정</Button>
                        <Button variant="outline">교환/반품 신청</Button>
                    </>
                )}
                {productOrder?.status === 'COMPLETED' && (
                    <Button variant="outline">교환/반품 신청</Button>
                )}

            </Stack>
        </Stack>
    )
}

export default Detail;