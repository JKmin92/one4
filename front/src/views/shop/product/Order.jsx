import { Accordion, Box, Button, Checkbox, CloseButton, Collapsible, DataList, Dialog, Field, Flex, NativeSelect, Heading, HStack, Icon, Input, InputGroup, RadioCard, RadioGroup, Separator, Stack, StackSeparator, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { formatNumber } from "../../../utils/simpleUtils";
import { LuSearch } from "react-icons/lu";
import { toaster } from "../../../components/ui/toaster";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/api";

function ProductList({ orderProducts = [] }) {

    return (
        <Box borderWidth="1px" rounded="md">
            <Flex bg="gray.subtle" p="10px" alignItems="center">
                <Heading>상품</Heading>
            </Flex>
            <Stack separator={<StackSeparator />} p="10px 0">
                {orderProducts.map((product, index) => {
                    const optionText = product.options ? `${product.options.name}: ${product.options.value}` : null;
                    const quantity = product.quantity;

                    let productPrice = product.product_price * quantity;
                    if (product.active_promotion) {
                        if (product.active_promotion.discount_type === 'fixed') {
                            productPrice = (product.product_price - product.active_promotion.discount_value) * quantity;
                        } else if (product.active_promotion.discount_type === 'percentage') {
                            productPrice = (product.product_price * (1 - product.active_promotion.discount_value / 100)) * quantity;
                        }
                    }

                    return (
                        <Flex key={index} p="0 10px" justifyContent="space-between" alignItems="center">
                            <Stack gap="0">
                                <Text fontSize="md">{product.product_name}</Text>
                                <HStack fontSize="xs">
                                    {optionText != null && (
                                        <Text>{optionText}</Text>
                                    )}
                                    <Text>수량 {quantity}개</Text>
                                </HStack>
                            </Stack>
                            <HStack>
                                {product.active_promotion && (
                                    <HStack>
                                        <Text fontSize="xs" >
                                            {product.active_promotion.discount_type === 'fixed' ? `-${Math.round((product.active_promotion.discount_value / product.product_price) * 100)}%` : `-${product.active_promotion.discount_value}%`}
                                        </Text>
                                        <Text fontSize="xs" textDecorationLine="line-through">{formatNumber(product.product_price * quantity)}</Text>
                                    </HStack>
                                )}
                                <Text fontSize="lg" fontWeight="medium">{formatNumber(productPrice)}</Text>
                            </HStack>
                        </Flex>
                    )
                })}
            </Stack>
        </Box>
    )
}

function AddDelivery({ deliveryList, setDeliveryList, setAddDeliveryStatus }) {

    const [isDaumLoaded, setIsDaumLoaded] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const searchAddressRef = useRef(null);
    const nameRef = useRef(null)
    const [postcode, setPostcode] = useState(null);
    const [address, setAddress] = useState(null);
    const detailAddressRef = useRef(null);
    const phoneRef = useRef(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;
        script.onload = () => setIsDaumLoaded(true);
        document.body.appendChild(script);
    }, []);

    const openPostcode = () => {
        if (!isDaumLoaded) return;
        setIsSearch(true);

        setTimeout(() => {
            const currentScroll = window.scrollY;

            new window.daum.Postcode({
                oncomplete: (data) => {
                    let addr = '', extraAddr = '';

                    if (data?.userSelectedType === 'R') addr = data?.roadAddress;
                    else addr = data?.jibunAddress;

                    if (data.userSelectedType === 'R') {
                        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) extraAddr += data.bname;
                        if (data.buildingName !== "") extraAddr += extraAddr !== "" ? ", " + data.buildingName : data.buildingName;
                        if (extraAddr !== "") extraAddr = `(${extraAddr})`;
                    }

                    setPostcode(data.zonecode);
                    setAddress(addr + extraAddr);
                    setIsSearch(false);
                    window.scrollTo(0, currentScroll);
                }, onresize: (size) => {
                    if (searchAddressRef.current) searchAddressRef.current.style.height = size.height + 'px'
                }, width: '100%', height: '100%',
            }).embed(searchAddressRef.current);
        }, 0);
    }

    const addAddress = () => {
        /** TODO : 별도 address Id 생성 */
        const id = deliveryList.reduce((max, cur) => cur.id > max ? cur.id : max, 0) + 1;
        const phone = phoneRef.current.value.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
        const newAddress = { id: id, name: nameRef.current.value, postcode: postcode, address: address, detailAddress: detailAddressRef.current.value, phone: phone };

        setDeliveryList(prev => [...prev, newAddress]);
        setAddDeliveryStatus(false);
    }


    return (
        <Stack gap="4">
            <Box ref={searchAddressRef} display={isSearch ? 'block' : 'none'}></Box>
            <Stack gap="8" display={!isSearch ? 'flex' : 'none'}>
                <Stack gap="4">
                    <Field.Root>
                        <Field.Label>성함</Field.Label>
                        <Input placeholder="수령자 성함을 입력해주세요." ref={nameRef} />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>주소</Field.Label>
                        <Button variant="ghost" w="100%" p="0" onClick={openPostcode}>
                            <Flex justifyContent="space-between" w="100%" borderColor="bg.emphasized" borderWidth="1px" p="10px" rounded="sm">
                                <Text whiteSpace="pre-line" textAlign="left" pr="10px">{postcode ? `[${postcode}] ${address}` : '주소검색'}</Text>
                                <Icon size="md"><LuSearch /></Icon>
                            </Flex>
                        </Button>
                        <Input placeholder="상세 주소" ref={detailAddressRef} />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>연락처</Field.Label>
                        <Input placeholder="'-'를 제외하고 입력해주세요." ref={phoneRef} />
                    </Field.Root>

                    <Field.Root>
                        <Checkbox.Root>
                            <Checkbox.HiddenInput />
                            <Checkbox.Control />
                            <Checkbox.Label>기본 배송지로 설정</Checkbox.Label>
                        </Checkbox.Root>
                    </Field.Root>
                </Stack>
                <Button onClick={addAddress}>배송비 추가</Button>
            </Stack>
        </Stack>
    )
}

function Delivery({ deliveryList, setDeliveryList, setSelectedAddress }) {
    const [addDeliveryStatus, setAddDeliveryStatus] = useState(false);
    const [delivery, setDelivery] = useState(null);
    const [selectedCode, setSelectedCode] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!deliveryList) return;

        const selected = deliveryList.find(d => d.isDefault === 1 || d.isDefault === true);
        if (selected) {
            setSelectedAddress(selected);
            setDelivery(selected);
            setSelectedCode(selected.address_code);
        }
    }, [deliveryList]);

    const selectAddress = () => {
        const selected = deliveryList.find(d => d.address_code === selectedCode);
        if (selected) {
            setSelectedAddress(selected);
            setDelivery(selected);
            setOpen(false);
        }
    }

    return (
        <Box borderWidth="1px" rounded="md">
            <Flex bg="gray.subtle" p="10px" justifyContent="space-between" alignItems="center">
                <Heading>배송지 {delivery && `${delivery.name}`}</Heading>
                <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
                    <Dialog.Trigger asChild><Button variant="outline" borderColor="gray.fg">배송지 변경</Button></Dialog.Trigger>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header><Dialog.Title>배송지</Dialog.Title></Dialog.Header>
                            <Dialog.Body>
                                {addDeliveryStatus ? (
                                    <AddDelivery deliveryList={deliveryList} setDeliveryList={setDeliveryList} setAddDeliveryStatus={setAddDeliveryStatus} />
                                ) : (
                                    deliveryList.length > 0 ? (
                                        <RadioCard.Root value={selectedCode} onValueChange={(e) => setSelectedCode(e.value)}>
                                            <Stack gap="4">
                                                {deliveryList.map((del) => (
                                                    <RadioCard.Item key={del.address_code} value={del.address_code}>
                                                        <RadioCard.ItemHiddenInput />
                                                        <RadioCard.ItemControl>
                                                            <RadioCard.ItemIndicator />
                                                            <RadioCard.ItemContent>
                                                                <RadioCard.ItemText>{del.name}</RadioCard.ItemText>
                                                                <RadioCard.ItemDescription>
                                                                    <Stack gap="0">
                                                                        <Text>[{del.postcode}] {del.address} {del.detailAddress}</Text>
                                                                        <Text>{del.phone}</Text>
                                                                    </Stack>
                                                                </RadioCard.ItemDescription>
                                                            </RadioCard.ItemContent>
                                                        </RadioCard.ItemControl>
                                                    </RadioCard.Item>
                                                ))}
                                            </Stack>
                                        </RadioCard.Root>
                                    ) : null
                                )}
                            </Dialog.Body>
                            <Dialog.Footer>
                                {!addDeliveryStatus && (
                                    deliveryList.length > 0 ? (
                                        <HStack w="100%">
                                            <Button variant="outline" width="1/2" onClick={() => setAddDeliveryStatus(true)}>배송지 추가</Button>
                                            <Button width="1/2" onClick={selectAddress}>배송지 선택</Button>
                                        </HStack>
                                    ) : (
                                        <Button variant="outline">배송지 추가</Button>
                                    )
                                )}
                            </Dialog.Footer>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Dialog.Root>

            </Flex>
            {delivery ? (
                <Stack gap="0" p="10px">
                    <Text fontSize="md">[{delivery.postcode}] {delivery.address} {delivery.detailAddress}</Text>
                    <Text fontSize="sm">{delivery.phone}</Text>
                </Stack>
            ) : (
                <Button>배송지 추가</Button>
            )}
        </Box>
    )
}

function Payment({ setSelectedPayment }) {

    const [paymentType, setPaymentType] = useState('CARD');
    const [selectedBank, setSelectedBank] = useState('');
    const [depositName, setDepositName] = useState('');
    const [accountList, setAccountList] = useState([]);

    useEffect(() => {
        getAccountList();
    }, []);

    const getAccountList = async () => {
        try {
            const res = await axiosInstance.get('/shop/product/order/account');
            if (res.status !== 200) {
                toaster.create({ title: '오류가 발생했습니다.', type: 'error' });
                return;
            }
            setAccountList(res.data);
        } catch (e) {
            console.error(e);
            toaster.create({ title: '오류가 발생했습니다.', type: 'error' });
        }
    }


    const paymentKinds = [
        {
            value: 'CARD',
            label: '신용/체크카드',
            content: '신용/체크카드 결제 관련 내용 들어갈 예정'
        },
        {
            value: 'BANK',
            label: '무통장 결제',
            content: (
                <Stack>
                    <NativeSelect.Root value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)}>
                        <NativeSelect.Field placeholder="계좌를 선택해주세요">
                            {accountList.map((account) => (
                                <option key={account.account_code} value={account.account_code}>{account.bank} {account.account_number}({account.account_holder})</option>
                            ))}
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                    </NativeSelect.Root>
                    <Input value={depositName} onChange={(e) => setDepositName(e.target.value)} placeholder="입금자명을 입력해주세요." />
                </Stack>
            )
        },
        {
            value: 'ESCROW',
            label: '에스크로',
            content: '에스크로 결제 관련 내용 들어갈 예정'
        },
    ]

    useEffect(() => {
        setSelectedPayment(prev => ({ ...prev, payment_type: paymentType }));
    }, [paymentType]);

    useEffect(() => {
        setSelectedPayment(prev => ({ ...prev, bank_code: selectedBank }));
    }, [selectedBank]);

    useEffect(() => {
        setSelectedPayment(prev => ({ ...prev, deposit_name: depositName }));
    }, [depositName]);

    return (
        <Box borderWidth="1px" rounded="md">
            <Flex bg="gray.subtle" p="10px" alignItems="center">
                <Heading>결제</Heading>
            </Flex>
            <Stack >
                <RadioGroup.Root defaultValue={paymentType} value={paymentType} onValueChange={(e) => setPaymentType(e.value)}>
                    <Stack separator={<StackSeparator />} gap="0">
                        {paymentKinds.map((kind) => (
                            <Stack p="15px 10px" >
                                <RadioGroup.Item key={kind.value} value={kind.value}>
                                    <RadioGroup.ItemHiddenInput />
                                    <RadioGroup.ItemIndicator />
                                    <RadioGroup.ItemText>
                                        {kind.label}
                                    </RadioGroup.ItemText>
                                </RadioGroup.Item>
                                <Collapsible.Root open={kind.value === paymentType ? true : false}>
                                    <Collapsible.Content>
                                        {kind.content}
                                    </Collapsible.Content>
                                </Collapsible.Root>
                            </Stack>
                        ))}
                    </Stack>
                </RadioGroup.Root>

            </Stack>
        </Box>
    )
}

function Order() {

    const location = useLocation();
    const [orderProducts, setOrderProducts] = useState([]);
    const [deliveryList, setDeliveryList] = useState([]);
    const [totalProductPrice, setTotalProductPrice] = useState(0);
    const [deliveryPrice, setDeliveryPrice] = useState(0);

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [shopDeliverySetting, setShopDeliverySetting] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state && location.state.orderData) {
            const orderItems = location.state.orderData;

            const getProductList = async () => {
                try {
                    const response = await axiosInstance.post(`/shop/product/order/product`, { orderItems })
                    if (response.data) {
                        let total = 0;
                        response.data.forEach(product => {
                            let productPrice = product.product_price * product.quantity;
                            if (product.active_promotion) {
                                if (product.active_promotion.discount_type === 'fixed') {
                                    productPrice = (product.product_price - product.active_promotion.discount_value) * product.quantity;
                                } else if (product.active_promotion.discount_type === 'percentage') {
                                    productPrice = (product.product_price * (1 - product.active_promotion.discount_value / 100)) * product.quantity;
                                }
                            }
                            total += productPrice;
                        });
                        setTotalProductPrice(total);
                        setOrderProducts(response.data);
                    } else {
                        toaster.create({ title: '오류가 발생했습니다.', type: 'error' });
                    }
                } catch (e) {
                    console.error(e);
                    toaster.create({ title: '오류가 발생했습니다.', type: 'error' });
                }
            }
            getProductList();
        } else if (location.state && location.state.basketData) {
            const basketItems = location.state.basketData;

            const getBasketProductList = async () => {
                try {
                    const response = await axiosInstance.post(`/shop/product/order/basket`, { basketItems });
                    if (response.data) {
                        let total = 0;
                        response.data.forEach(product => {
                            let productPrice = product.product_price * product.quantity;
                            if (product.active_promotion) {
                                if (product.active_promotion.discount_type === 'fixed') {
                                    productPrice = (product.product_price - product.active_promotion.discount_value) * product.quantity;
                                } else if (product.active_promotion.discount_type === 'percentage') {
                                    productPrice = (product.product_price * (1 - product.active_promotion.discount_value / 100)) * product.quantity;
                                }
                            }
                            total += productPrice;
                        });
                        setTotalProductPrice(total);
                        setOrderProducts(response.data);
                    } else {
                        toaster.create({ title: '오류가 발생했습니다.', type: 'error' });
                    }
                } catch (e) {
                    console.error(e);
                    toaster.create({ title: '오류가 발생했습니다.', type: 'error' });
                }
            }
            getBasketProductList();
        }

        const getShopDeliverySetting = async () => {
            try {
                const response = await axiosInstance.get(`/shop/product/order/delivery/setting`);
                if (response.data) {
                    setShopDeliverySetting(response.data);
                } else {
                    toaster.create({ title: '배송지를 불러올 수 없습니다.', type: 'error' });
                }
            } catch (e) {
                console.error(e);
                toaster.create({ title: '오류가 발생했습니다.', type: 'error' });
            }
        }
        getShopDeliverySetting();
    }, [location]);

    useEffect(() => {
        let delivery_price = 0;
        if (!shopDeliverySetting) return;
        if (shopDeliverySetting.delivery_method === 'FREE') {
            delivery_price = 0;
        } else if (shopDeliverySetting.delivery_method === 'FIXED') {
            delivery_price = shopDeliverySetting.basic_delivery_price;
        } else {
            delivery_price = totalProductPrice >= shopDeliverySetting.order_standard ? 0 : shopDeliverySetting.basic_delivery_price;
        }
        setDeliveryPrice(delivery_price);
    }, [totalProductPrice, shopDeliverySetting]);


    useEffect(() => {

        const getDeliveryList = async () => {
            try {
                const response = await axiosInstance.get(`/user/address`);
                if (response.data) {
                    setDeliveryList(response.data);
                } else {
                    toaster.create({ title: '배송지를 불러올 수 없습니다.', type: 'error' });
                }
            } catch (e) {
                console.error(e);
                toaster.create({ title: '오류가 발생했습니다.', type: 'error' });
            }
        }

        getDeliveryList();
    }, []);

    const onOrderSubmit = async () => {
        try {
            const response = await axiosInstance.post(`/shop/product/order`, {
                orderProducts,
                selectedAddress,
                selectedPayment
            });

            if (response.data.result == true) {
                navigate('/order/complete', { state: { orderCode: response.data.order_code } });
            }
        } catch (e) {
            console.error(e);
            toaster.create({ title: '오류가 발생했습니다.', type: 'error' });
        }
    }

    return (
        <Stack p={{ base: '40px 0', md: "80px 0" }} px={{ base: '15px', md: "layoutX" }} width={{ base: 'full', md: "6xl" }} margin="auto" gap="6">
            <Heading size='2xl'>주문/결제</Heading>
            <Stack direction={{ base: 'column', md: "row" }}>
                <Box width={{ base: 'full', md: "3/4" }}>
                    <Stack gap="6">
                        <ProductList orderProducts={orderProducts} />
                        <Delivery deliveryList={deliveryList} setDeliveryList={setDeliveryList} setSelectedAddress={setSelectedAddress} />
                        <Payment setSelectedPayment={setSelectedPayment} />
                    </Stack>
                </Box>
                <Box width={{ base: 'full', md: "1/4" }} position="relative">
                    <Stack gap="6" position="sticky" top="10px" borderWidth="1px" rounded="md" p="10px">
                        <Heading>최종 결제 금액</Heading>
                        <DataList.Root orientation="horizontal">
                            <DataList.Item>
                                <DataList.ItemLabel>총 상품 가격</DataList.ItemLabel>
                                <DataList.ItemValue justifyContent="end">{formatNumber(totalProductPrice)}</DataList.ItemValue>
                            </DataList.Item>
                            <DataList.Item>
                                <DataList.ItemLabel>배송비</DataList.ItemLabel>
                                <DataList.ItemValue justifyContent="end">{formatNumber(deliveryPrice)}</DataList.ItemValue>
                            </DataList.Item>
                        </DataList.Root>
                        <Separator />
                        <DataList.Root orientation="horizontal">
                            <DataList.Item fontWeight="medium">
                                <DataList.ItemLabel>총 결제 금액</DataList.ItemLabel>
                                <DataList.ItemValue justifyContent="end" fontSize="xl">{formatNumber(totalProductPrice + deliveryPrice)}</DataList.ItemValue>
                            </DataList.Item>
                        </DataList.Root>
                        <Button onClick={onOrderSubmit}>결제하기</Button>
                    </Stack>
                </Box>
            </Stack>
        </Stack>
    )
}

export default Order;