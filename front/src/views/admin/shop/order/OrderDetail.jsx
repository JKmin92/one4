import { Box, Button, Checkbox, DataList, Dialog, Heading, HStack, Image, Input, NativeSelect, Stack, StackSeparator, Table, Tabs, Text } from "@chakra-ui/react";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../../utils/api";
import { toaster } from "../../../../components/ui/toaster";
import { formatDate, formatNumber } from "../../../../utils/simpleUtils";
import { LuCheck } from "react-icons/lu";

function DeliveryCompanySelectList({ value, onChange }) {

    return (
        <NativeSelect.Root size="xs" rounded="md">
            <NativeSelect.Field placeholder="택배사를 선택해주세요." value={value} onChange={(e) => onChange(e.currentTarget.value)}>
                <option value="한진택배">한진택배</option>
                <option value="CJ 대한통운">CJ 대한통운</option>
                <option value="롯데택배">롯데택배</option>
                <option value="우체국택배">우체국택배</option>
                <option value="현대택배">현대택배</option>
            </NativeSelect.Field>
        </NativeSelect.Root>
    )
}

function ChangeOrderStatusSelectList({ value, onChange }) {


    return (
        <NativeSelect.Root size="xs" rounded="md">
            <NativeSelect.Field placeholder="상태를 선택해주세요." value={value} onChange={(e) => onChange(e.currentTarget.value)}>
                <option value="PROCESSING">배송준비중</option>
                <option value="SHIPPING">배송중</option>
                <option value="DELIVERED">배송완료</option>
                <option value="COMPLETED">구매확정</option>
                <option value="RETURN">반품</option>
                <option value="EXCHANGE">교환</option>
                <option value="CANCELED">취소</option>
            </NativeSelect.Field>
        </NativeSelect.Root>
    )
}



function OrderDetail() {
    const { order_code } = useParams();
    const [productOrder, setProductOrder] = useState();
    const [address, setAddress] = useState();
    const [productOrderDeliveryList, setProductOrderDeliveryList] = useState([]);
    const [productOrderPayment, setProductOrderPayment] = useState();
    const [productOrderItemList, setProductOrderItemList] = useState([]);
    const [productOrderClaimList, setProductOrderClaimList] = useState([]);
    const [orderUser, setOrderUser] = useState();

    const [orderProductSelectList, setOrderProductSelectList] = useState([]);
    const [allOrderProductSelect, setAllOrderProductSelect] = useState(false);
    const [deliveryCompany, setDeliveryCompany] = useState('');
    const [deliveryValue, setDeliveryValue] = useState('');
    const [orderStatus, setOrderStatus] = useState('');
    const [confirmState, setConfirmState] = useState({
        open: false,
        title: '',
        descript: '',
        resolve: null
    });

    const showConfirm = (title, descript) => {
        return new Promise((resolve) => {
            setConfirmState({ open: true, title, descript, resolve });
        });
    };

    const processedOrderItemList = useMemo(() => {
        if (!productOrderItemList) return [];
        return productOrderItemList.map(item => {
            let discountPrice = 0;
            if (item.discount_value != null && item.discount_value > 0) {
                const discountType = item.discount_type?.toUpperCase();
                if (discountType === 'FIXED') {
                    discountPrice = item.discount_value * item.quantity;
                } else if (discountType === 'PERCENT') {
                    const actualPrice = item.price / item.quantity;
                    discountPrice = actualPrice * (item.discount_value / 100) * item.quantity;
                }
            }
            return {
                ...item,
                discount_price: discountPrice
            };
        });
    }, [productOrderItemList]);

    const totalDiscountValue = useMemo(() => {
        return processedOrderItemList.reduce((sum, item) => sum + (item.discount_price || 0), 0);
    }, [processedOrderItemList]);

    useEffect(() => {

        loadOrder();
    }, []);

    const loadOrder = async () => {
        try {
            const response = await axiosInstance.get(`/admin/shop/order/${order_code}`);
            setProductOrder(response.data.product_order);
            setAddress(response.data.address);
            setProductOrderDeliveryList(response.data.product_order_deliveries);
            setProductOrderPayment(response.data.product_order_payment);
            setProductOrderItemList(response.data.product_order_items);
            setProductOrderClaimList(response.data.product_order_claims);
            setOrderUser(response.data.orderUser);
        } catch (e) {
            console.error(e);
            toaster.create({ title: '오류가 발생했습니다.', type: 'error' });
        }
    }

    const orderItemStatus = (status) => {
        switch (status) {
            case 'PENDING':
                return (<Box bg="yellow.subtle" p="1" color="fg" rounded="sm">결제대기</Box>);
            case 'PAID':
                return (<Box bg="green.subtle" p="1" color="fg" rounded="sm">결제완료</Box>);
            case 'PROCESSING':
                return (<Box bg="green.subtle" p="1" color="fg.subtle" rounded="sm">배송준비중</Box>);
            case 'SHIPPING':
                return (<Box bg="blue.solid" p="1" color="fg.inverted" rounded="sm">배송중</Box>);
            case 'DELIVERED':
                return (<Box bg="green.solid" p="1" color="fg.inverted" rounded="sm">배송완료</Box>);
            case 'COMPLETED':
                return (<Box bg="green.solid" p="1" color="fg.inverted" rounded="sm">구매확정</Box>);
            case 'RETURN':
                return (<Box bg="orange.solid" p="1" color="fg.inverted" rounded="sm">반품</Box>);
            case 'EXCHANGE':
                return (<Box bg="orange" p="1" color="fg.inverted" rounded="sm">교환</Box>);
            case 'CANCELED':
                return (<Box bg="gray.muted" p="1" color="fg" rounded="sm">취소</Box>);
            default:
                return (<Box bg="gray" p="1" color="fg.inverted" rounded="sm">알수없음</Box>);
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

    const handleAllProductCheck = (e) => {
        const isChecked = !!e.checked;
        setAllOrderProductSelect(isChecked);
        if (isChecked) {
            setOrderProductSelectList(processedOrderItemList.map(item => item.order_item_code));
        } else {
            setOrderProductSelectList([]);
        }
    }

    const handleSingleProductCheck = (e, order_item_code) => {
        const isChecked = !!e.checked;
        if (isChecked) {
            setOrderProductSelectList(prev => [...prev, order_item_code]);
        } else {
            setOrderProductSelectList(prev => prev.filter(code => code !== order_item_code));
        }
    }

    useEffect(() => {
        if (orderProductSelectList.length > 0 && orderProductSelectList.length === processedOrderItemList.length) {
            setAllOrderProductSelect(true);
        } else {
            setAllOrderProductSelect(false);
        }
    }, [orderProductSelectList, processedOrderItemList]);

    const changeOrderProductStatus = async () => {
        if (orderProductSelectList.length === 0) {
            toaster.create({ title: '선택된 상품이 없습니다.', type: 'error' });
            return;
        }

        let isConfirmed = true;

        if (orderStatus === 'SHIPPING' || orderStatus === 'DELIVERED' || orderStatus === 'COMPLETED') {
            if (productOrderDeliveryList.length === 0 &&
                (deliveryCompany === '' || deliveryCompany === null || deliveryValue === '' || deliveryValue === null)) {
                isConfirmed = await showConfirm(
                    '택배사, 송장번호 미기입',
                    '택배사 또는 송장번호가 미기입된 상태입니다.<br />택배사와 송장번호 미기입 상태로 저장하시겠습니까?'
                );
            }
        }

        if (!isConfirmed) {
            return;
        }

        if (orderStatus != '' && orderStatus != null && orderStatus != undefined) {
            try {
                const body = { order_codes: [order_code], status: orderStatus };
                const response = await axiosInstance.put(`/admin/shop/order/status`, body);
                if (response.data.success) {
                    loadOrder();
                    setOrderProductSelectList([]);
                    toaster.create({ title: '상태가 변경되었습니다.', type: 'success' });
                }
            } catch (e) {
                console.error(e);
                toaster.create({ title: '오류가 발생했습니다.', type: 'error' });
            }
        }

        if (deliveryCompany != '' || deliveryValue != '') {

            const result = {
                [order_code]: orderProductSelectList.map((order_item_code) => ({
                    order_item_code: order_item_code,
                    post_company: deliveryCompany,
                    post_number: deliveryValue
                }))
            };

            try {
                const res = await axiosInstance.post('/admin/shop/order/delivery', result);
                if (res.data) {
                    toaster.create({ title: '배송 정보가 저장되었습니다.', type: 'success' });
                    loadOrder();
                }
            } catch (error) {
                console.log(error);
            }
        }

    };

    return (
        <Stack p="30px" px="layoutX" gap="12">
            <Heading>주문 상세정보</Heading>
            <HStack fontSize="sm" gap="8" border="1px solid" borderColor="gray.300" py="2" px="5" borderRadius="md">
                <Text>주문번호 : {productOrder?.order_code}</Text>
                <Text>주문일 : {formatDate(productOrder?.created_at)}</Text>
            </HStack>

            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader textAlign="center">총 결제금액</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">총 취소금액</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">실 환불금액</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell textAlign="center">{formatNumber(productOrder?.actual_payment_amount)}</Table.Cell>
                        <Table.Cell textAlign="center">{formatNumber(productOrder?.total_cancel_amount || 0)}</Table.Cell>
                        <Table.Cell textAlign="center">{formatNumber(productOrder?.actual_refund_amount || 0)}</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table.Root>

            <Stack>
                <Heading fontSize="md">주문상품</Heading>
                <Table.Root>
                    <Table.Header >
                        <Table.Row bg="gray.subtle">
                            <Table.ColumnHeader textAlign="center">
                                <Checkbox.Root checked={allOrderProductSelect} onCheckedChange={handleAllProductCheck}>
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                </Checkbox.Root>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center">상품번호</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center">이미지</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center">주문상품</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center">수량</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center">상품금액</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center">총 할인금액</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center">배송비</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center">총 주문금액</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center">송장번호</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center">상태</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {processedOrderItemList?.map((item, index) => {
                            const firstDelivery = productOrderDeliveryList && productOrderDeliveryList.length > 0 ? productOrderDeliveryList[0] : null;
                            const isAllSamePost = firstDelivery ? productOrderDeliveryList.every(delivery =>
                                delivery.post_company === firstDelivery.post_company &&
                                delivery.post_number === firstDelivery.post_number
                            ) : false;
                            const itemDelivery = productOrderDeliveryList?.find(d => d.order_item_code === item.order_item_code);

                            return (
                                <Table.Row key={item.order_item_code}>
                                    <Table.Cell textAlign="center">
                                        <Checkbox.Root checked={orderProductSelectList.includes(item.order_item_code)} onCheckedChange={(e) => handleSingleProductCheck(e, item.order_item_code)}>
                                            <Checkbox.HiddenInput />
                                            <Checkbox.Control />
                                        </Checkbox.Root>
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">{item.product_code}</Table.Cell>
                                    <Table.Cell textAlign="center">
                                        <Image margin="auto" src={item.image_url || item.product_image_url} w="8" />
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                        <Stack gap="1">
                                            <Text>{item.product_name}</Text>
                                            {item.product_order_code && (<Text>[{item.product_option_label}] : {item.prouct_option_value}</Text>)}
                                        </Stack>
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">{item.quantity}</Table.Cell>
                                    <Table.Cell textAlign="center">{formatNumber(item.price)}</Table.Cell>

                                    {index === 0 && (
                                        <Table.Cell textAlign="center" rowSpan={processedOrderItemList.length}>
                                            {formatNumber(totalDiscountValue)}
                                        </Table.Cell>
                                    )}

                                    {index === 0 && (
                                        <Table.Cell textAlign="center" rowSpan={processedOrderItemList.length}>
                                            {formatNumber(productOrder?.delivery_price)}
                                        </Table.Cell>
                                    )}

                                    {index === 0 && (
                                        <Table.Cell textAlign="center" rowSpan={processedOrderItemList.length}>
                                            {formatNumber(productOrder?.actual_payment_amount)}
                                        </Table.Cell>
                                    )}

                                    {isAllSamePost ? (
                                        index === 0 && (
                                            <Table.Cell textAlign="center" rowSpan={processedOrderItemList.length}>
                                                {firstDelivery ? (
                                                    <Stack minH="12" gap="1" justify="center">
                                                        <HStack justify="center" fontSize="xs">
                                                            <Text>{firstDelivery.post_company}</Text>
                                                            <Text>{firstDelivery.post_number}</Text>
                                                        </HStack>
                                                        <Button size="2xs" fontSize="xs">배송 추적</Button>
                                                    </Stack>
                                                ) : (
                                                    <Text>배송정보 없음</Text>
                                                )}
                                            </Table.Cell>
                                        )
                                    ) : (
                                        <Table.Cell textAlign="center">
                                            <Stack separator={<StackSeparator />} gap="2">
                                                {itemDelivery ? (
                                                    <Stack minH="12" gap="1">
                                                        <HStack justify="center" fontSize="xs">
                                                            <Text>{itemDelivery.post_company}</Text>
                                                            <Text>{itemDelivery.post_number}</Text>
                                                        </HStack>
                                                        <Button size="2xs" fontSize="xs">배송 추적</Button>
                                                    </Stack>
                                                ) : (
                                                    <Text fontSize="xs" color="gray.500">배송 정보 없음</Text>
                                                )}
                                            </Stack>
                                        </Table.Cell>
                                    )}
                                    {isAllSamePost ? (
                                        index === 0 && (
                                            <Table.Cell textAlign="center" rowSpan={processedOrderItemList.length}>{orderItemStatus(item.status)}</Table.Cell>
                                        )
                                    ) : (
                                        <Table.Cell textAlign="center">{orderItemStatus(item.status)}</Table.Cell>
                                    )}

                                </Table.Row>
                            )
                        })}
                        <Table.Row bg="bg.subtle">
                            <Table.Cell colSpan="9">
                                <HStack>
                                    <LuCheck />
                                    <Text>선택한 상품을</Text>
                                    <HStack>
                                        <ChangeOrderStatusSelectList value={orderStatus} onChange={setOrderStatus} />
                                        <DeliveryCompanySelectList value={deliveryCompany} onChange={setDeliveryCompany} />
                                        <Input placeholder="송장번호" size="xs" value={deliveryValue} onChange={(e) => setDeliveryValue(e.target.value)} />
                                        <Button size="xs" onClick={changeOrderProductStatus}>일괄적용</Button>
                                    </HStack>
                                </HStack>
                            </Table.Cell>
                            <Table.Cell colSpan="2">
                                <HStack justify="end">
                                    <Button size="xs">상품환불</Button>
                                    <Button size="xs">상품교환</Button>
                                </HStack>
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table.Root>
            </Stack>

            <Stack>
                <Heading fontSize="md">취소/교환/반품/환불</Heading>

                {/** 취소 관련 Table 생성 예정. */}
                <Tabs.Root defaultValue="cancel" variant="subtle">
                    <Tabs.List>
                        <Tabs.Trigger value="cancel">취소</Tabs.Trigger>
                        <Tabs.Trigger value="exchange">교환</Tabs.Trigger>
                        <Tabs.Trigger value="return">반품</Tabs.Trigger>
                        <Tabs.Trigger value="refund">환불</Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="cancel">
                        <Table.Root>
                            <Table.Header>
                                <Table.Row bg="gray.subtle">
                                    <Table.ColumnHeader>요청일시</Table.ColumnHeader>
                                    <Table.ColumnHeader>처리상태</Table.ColumnHeader>
                                    <Table.ColumnHeader>이미지</Table.ColumnHeader>
                                    <Table.ColumnHeader>상품</Table.ColumnHeader>
                                    <Table.ColumnHeader>취소수량</Table.ColumnHeader>
                                    <Table.ColumnHeader>취소사유</Table.ColumnHeader>
                                    <Table.ColumnHeader>취소사유(상세)</Table.ColumnHeader>
                                    <Table.ColumnHeader>처리일시</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell colSpan="8" textAlign="center">취소정보가 없습니다.</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table.Root>
                    </Tabs.Content>
                    <Tabs.Content value="exchange">
                        <Table.Root>
                            <Table.Header>
                                <Table.Row bg="gray.subtle">
                                    <Table.ColumnHeader>요청일시</Table.ColumnHeader>
                                    <Table.ColumnHeader>처리상태</Table.ColumnHeader>
                                    <Table.ColumnHeader>이미지</Table.ColumnHeader>
                                    <Table.ColumnHeader>상품</Table.ColumnHeader>
                                    <Table.ColumnHeader>교환수량</Table.ColumnHeader>
                                    <Table.ColumnHeader>교환사유</Table.ColumnHeader>
                                    <Table.ColumnHeader>교환사유(상세)</Table.ColumnHeader>
                                    <Table.ColumnHeader>차액</Table.ColumnHeader>
                                    <Table.ColumnHeader>처리일시</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell colSpan="9" textAlign="center">교환정보가 없습니다.</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table.Root>
                    </Tabs.Content>
                    <Tabs.Content value="return">
                        <Table.Root>
                            <Table.Header>
                                <Table.Row bg="gray.subtle">
                                    <Table.ColumnHeader>요청일시</Table.ColumnHeader>
                                    <Table.ColumnHeader>처리상태</Table.ColumnHeader>
                                    <Table.ColumnHeader>이미지</Table.ColumnHeader>
                                    <Table.ColumnHeader>상품</Table.ColumnHeader>
                                    <Table.ColumnHeader>반품수량</Table.ColumnHeader>
                                    <Table.ColumnHeader>반품사유</Table.ColumnHeader>
                                    <Table.ColumnHeader>반품사유(상세)</Table.ColumnHeader>
                                    <Table.ColumnHeader>환불수단</Table.ColumnHeader>
                                    <Table.ColumnHeader>환불계좌</Table.ColumnHeader>
                                    <Table.ColumnHeader>처리일시</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell colSpan="10" textAlign="center">반품정보가 없습니다.</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table.Root>
                    </Tabs.Content>
                    <Tabs.Content value="refund">
                        <Table.Root>
                            <Table.Header>
                                <Table.Row bg="gray.subtle">
                                    <Table.ColumnHeader>요청일시</Table.ColumnHeader>
                                    <Table.ColumnHeader>처리상태</Table.ColumnHeader>
                                    <Table.ColumnHeader>이미지</Table.ColumnHeader>
                                    <Table.ColumnHeader>상품</Table.ColumnHeader>
                                    <Table.ColumnHeader>환불수량</Table.ColumnHeader>
                                    <Table.ColumnHeader>환불사유</Table.ColumnHeader>
                                    <Table.ColumnHeader>환불사유(상세)</Table.ColumnHeader>
                                    <Table.ColumnHeader>환불수단</Table.ColumnHeader>
                                    <Table.ColumnHeader>환불계좌</Table.ColumnHeader>
                                    <Table.ColumnHeader>처리일시</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell colSpan="10" textAlign="center">환불정보가 없습니다.</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table.Root>
                    </Tabs.Content>
                </Tabs.Root>
            </Stack>

            <HStack gap="12">
                <Stack flex="1" gap="4">
                    <Heading fontSize="md" borderBottom="1px solid #000">결제 정보</Heading>
                    <DataList.Root orientation="horizontal">
                        <DataList.Item>
                            <DataList.ItemLabel>상품 판매금액</DataList.ItemLabel>
                            <DataList.ItemValue justifyContent="end">{formatNumber(productOrderItemList.reduce((acc, item) => acc + (item.price), 0))}</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>총 배송비</DataList.ItemLabel>
                            <DataList.ItemValue justifyContent="end">{formatNumber(productOrder?.delivery_price)}</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>총 할인금액</DataList.ItemLabel>
                            <DataList.ItemValue justifyContent="end">{formatNumber(totalDiscountValue)}</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>실 결제금액</DataList.ItemLabel>
                            <DataList.ItemValue justifyContent="end">{formatNumber(productOrder?.actual_payment_amount)}</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>총 적립금액</DataList.ItemLabel>
                            <DataList.ItemValue justifyContent="end">0</DataList.ItemValue>
                        </DataList.Item>
                    </DataList.Root>
                </Stack>

                <Stack flex="1" gap="4">
                    <Heading fontSize="md" borderBottom="1px solid #000">결제 수단</Heading>
                    <DataList.Root orientation="horizontal">
                        <DataList.Item>
                            <DataList.ItemLabel>결제 방법</DataList.ItemLabel>
                            <DataList.ItemValue>{getPaymentMethod(productOrderPayment?.payment_type)}</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>주문일시</DataList.ItemLabel>
                            <DataList.ItemValue>{formatDate(productOrder?.created_at)}</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>결제 확인 일시</DataList.ItemLabel>
                            <DataList.ItemValue>
                                {productOrderPayment?.paid_check_time ? formatDate(productOrderPayment?.paid_check_time) : '미확인'}
                            </DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>현금영수증 신청여부</DataList.ItemLabel>
                            <DataList.ItemValue>미신청</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>세금계산서 신청여부</DataList.ItemLabel>
                            <DataList.ItemValue>미신청</DataList.ItemValue>
                        </DataList.Item>
                    </DataList.Root>
                </Stack>
            </HStack>

            <HStack gap="12" alignItems="start">
                <Stack flex="1" gap="4">
                    <Heading fontSize="md" borderBottom="1px solid #000">주문자 정보</Heading>
                    <DataList.Root orientation="horizontal">
                        <DataList.Item>
                            <DataList.ItemLabel>성명</DataList.ItemLabel>
                            <DataList.ItemValue>{orderUser?.name} / {orderUser?.email}</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>연락처</DataList.ItemLabel>
                            <DataList.ItemValue>{orderUser?.phone}</DataList.ItemValue>
                        </DataList.Item>
                    </DataList.Root>
                </Stack>

                <Stack flex="1" gap="4">
                    <Heading fontSize="md" borderBottom="1px solid #000">배송지 정보</Heading>
                    <DataList.Root orientation="horizontal">
                        <DataList.Item>
                            <DataList.ItemLabel>수령인</DataList.ItemLabel>
                            <DataList.ItemValue>{address?.name}</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>연락처</DataList.ItemLabel>
                            <DataList.ItemValue>{address?.phone}</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>주소</DataList.ItemLabel>
                            <DataList.ItemValue>[{address?.postcode}] {address?.address} {address?.detailAddress}</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>배송 메세지</DataList.ItemLabel>
                            <DataList.ItemValue>{address?.post_request}</DataList.ItemValue>
                        </DataList.Item>
                    </DataList.Root>
                </Stack>
            </HStack>

            {/* 공통 알림/확인 다이얼로그 */}
            <Dialog.Root open={confirmState.open} onOpenChange={(open) => {
                if (!open) {
                    confirmState.resolve(false);
                    setConfirmState(prev => ({ ...prev, open: false }));
                }
            }}>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>{confirmState.title}</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body dangerouslySetInnerHTML={{ __html: confirmState.descript }} />
                        <Dialog.Footer>
                            <Button variant="outline" onClick={() => {
                                confirmState.resolve(false);
                                setConfirmState(prev => ({ ...prev, open: false }));
                            }}>취소</Button>
                            <Button onClick={() => {
                                confirmState.resolve(true);
                                setConfirmState(prev => ({ ...prev, open: false }));
                            }}>확인</Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>

        </Stack>
    )
}

export default OrderDetail;