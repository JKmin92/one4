import { Box, Button, Checkbox, CloseButton, DataList, EmptyState, Flex, Heading, HStack, Icon, IconButton, Image, Link, NumberInput, Separator, Stack, StackSeparator, Text } from "@chakra-ui/react";
import { calcDiscountPercent, formatNumber } from "../../../utils/simpleUtils";
import { LuMinus, LuPlus, LuShoppingCart } from "react-icons/lu";
import { useEffect, useState } from "react";
import { HiX } from "react-icons/hi";
import axiosInstance from "../../../utils/api";
import { useNavigate } from "react-router-dom";
import { toaster } from "../../../components/ui/toaster";


function OrderBasketProduct({ orderBasket, checked, changeSelectBasket, removeBasket, changeQuantity }) {

    const price = orderBasket.product_price * orderBasket.quantity
    const discount = orderBasket.promotions?.length > 0 ? orderBasket.promotions[0].discount_value * orderBasket.quantity : 0;
    const totalPrice = price - discount;
    const mainImage = orderBasket.images.filter(image => image.is_main)[0].url;


    return (
        <Flex justifyContent="space-between" alignItems="start">
            <Stack direction="row" gap="6" alignItems="center">
                <Checkbox.Root checked={checked} onCheckedChange={({ checked }) => changeSelectBasket(orderBasket.order_basket_code, checked === true)}>
                    <Checkbox.HiddenInput value={orderBasket.order_basket_code} />
                    <Checkbox.Control />
                </Checkbox.Root>

                <Image src={mainImage} aspectRatio="square" rounded="md" width={{ base: '28', md: "32" }} />
                <Stack gap="6">
                    <Stack gap="2">
                        <Stack gap="0">
                            <Link fontSize="lg" fontWeight="medium" href={`/products/${orderBasket.product_code}`}>{orderBasket.product_name}</Link>
                            {orderBasket.options && (
                                <Text fontSize="sm" color="fg.muted">[{orderBasket.options.name}] {orderBasket.options.value}</Text>
                            )}
                        </Stack>

                        {orderBasket.promotions?.length > 0 ? (
                            <Stack gap="0">
                                <Text fontSize="xs" textDecoration="line-through">{formatNumber(price)}</Text>
                                <HStack alignItems="end">
                                    <Text fontSize="sm" fontWeight="medium">{calcDiscountPercent(price, totalPrice)}%</Text>
                                    <Text fontWeight="medium">{formatNumber(totalPrice)}</Text>
                                </HStack>
                            </Stack>
                        ) : (
                            <Text fontWeight="medium">{formatNumber(totalPrice)}</Text>
                        )}
                    </Stack>

                    <NumberInput.Root min="1" unstyled spinOnPress={false} value={orderBasket.quantity} onValueChange={(e) => changeQuantity(orderBasket.order_basket_code, Number(e.value))}>
                        <HStack gap="2">
                            <NumberInput.DecrementTrigger asChild>
                                <IconButton variant="outline" size="5" rounded="full" p="1">
                                    <Icon size="sm"><LuMinus /></Icon>
                                </IconButton>
                            </NumberInput.DecrementTrigger>
                            <NumberInput.ValueText textAlign="center" />
                            <NumberInput.IncrementTrigger asChild>
                                <IconButton variant="outline" size="5" rounded="full" p="1">
                                    <Icon size="sm"><LuPlus /></Icon>
                                </IconButton>
                            </NumberInput.IncrementTrigger>
                        </HStack>
                    </NumberInput.Root>
                </Stack>
            </Stack>
            <CloseButton size="0" rounded="full" variant="solid" bg="gray.focusRing" onClick={() => removeBasket(orderBasket.order_basket_code)}><Icon size="sm"><HiX /></Icon></CloseButton>
        </Flex>
    )
}

function Cart() {

    const [productList, setProductList] = useState([]);
    const [allChecked, setAllChecked] = useState(false);
    const [orderBasketList, setOrderBasketList] = useState([]);
    const [selectedBasketList, setSelectedBasketList] = useState([]);
    const [shopDeliverySetting, setShopDeliverySetting] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getShopDeliverySetting = async () => {
            try {
                const response = await axiosInstance.get('/shop/product/order/delivery/setting');
                setShopDeliverySetting(response.data);
            } catch {
                toaster.create({ title: '배송설정 정보를 불러올 수 없습니다.', type: 'error' });
            }
        }
        const getProductList = async () => {
            try {
                const response = await axiosInstance.get('/shop/product/basket');
                setOrderBasketList(response.data);

                // 모든 상품을 초기 선택 상태로 설정
                if (response.data.length > 0) {
                    setSelectedBasketList(response.data.map(basket => ({ order_basket_code: basket.order_basket_code })));
                    setAllChecked(true);
                }
            } catch {
                toaster.create({ title: '장바구니 정보를 불러올 수 없습니다.', type: 'error' });
            }
        }
        getShopDeliverySetting();
        getProductList();
    }, []);


    const removeBasket = async (order_basket_code) => {
        await axiosInstance.delete(`/shop/product/basket/${order_basket_code}`);
        setOrderBasketList(prev => prev.filter((basket) => basket.order_basket_code !== order_basket_code));
        window.dispatchEvent(new Event('basket_updated'));
    }

    const changeSelectBasket = (order_basket_code, status) => {

        if (status) {
            setSelectedBasketList(prev => {
                const basket = orderBasketList.find((pro) => pro.order_basket_code === order_basket_code);
                if (!basket) return prev;
                if (prev.some(p => p.order_basket_code === order_basket_code)) return prev;
                return [...prev, { order_basket_code: order_basket_code }];
            });
        } else {
            setSelectedBasketList(prev => prev.filter((basket) => basket.order_basket_code !== order_basket_code));
        }
        const allCheck = selectedBasketList.length + 1 == orderBasketList.length ? true : false;
        setAllChecked(allCheck);
    }

    const onChangeQuantity = async (order_basket_code, quantity) => {
        const data = { order_basket_code: order_basket_code, quantity: quantity };
        await axiosInstance.put(`/shop/product/basket`, data);
        setOrderBasketList(prev =>
            prev.map(p => p.order_basket_code === order_basket_code ? { ...p, quantity } : p)
        )
    }

    const totalProductPrice = selectedBasketList.reduce((sum, selected) => {
        const basket = orderBasketList.find(p => p.order_basket_code === selected.order_basket_code);
        if (!basket) return sum;

        const discount = { price: 0 };
        const unitPrice = basket.product_price - (discount?.price || 0);
        const quantity = orderBasketList.find(q => q.order_basket_code === basket.order_basket_code)?.quantity;
        return (unitPrice + sum) * quantity;
    }, 0);

    const deliveryCost = !shopDeliverySetting ? '0'
        : shopDeliverySetting.delivery_method === 'FREE' ?
            "무료" : shopDeliverySetting.delivery_method === 'FIXED' ?
                formatNumber(shopDeliverySetting.basic_delivery_price) + "원"
                : totalProductPrice >= shopDeliverySetting.order_standard ? "무료"
                    : formatNumber(shopDeliverySetting.basic_delivery_price) + "원";
    const selectedProductCount = selectedBasketList.length;


    const handleAllChekced = (allCheck) => {
        if (allCheck) {
            setAllChecked(true);
            orderBasketList.map((basket) => {
                const order_basket_code = basket.order_basket_code;
                setSelectedBasketList(prev => {
                    if (prev.some(p => p.order_basket_code === order_basket_code)) return prev;
                    return [...prev, { order_basket_code: order_basket_code }]
                })
            })
        } else {
            setAllChecked(false);
            setSelectedBasketList([]);
        }
    }

    const removeSelectedBasket = async () => {
        await Promise.all(selectedBasketList.map(async (selectedBasket) => {
            await axiosInstance.delete(`/shop/product/basket/${selectedBasket.order_basket_code}`);
        }));
        
        const removedCodes = selectedBasketList.map(b => b.order_basket_code);
        setOrderBasketList(prev => prev.filter(basket => !removedCodes.includes(basket.order_basket_code)));
        setSelectedBasketList([]);
        window.dispatchEvent(new Event('basket_updated'));
    }

    const onOrder = () => {
        navigate('/order', { state: { basketData: selectedBasketList, isDirectOrder: true } })
    }

    return (
        <Stack p={{ base: '40px 0', md: "80px 0" }} px={{ base: '15px', md: "layoutX" }} width={{ base: 'full', md: "6xl" }} margin="auto" gap="6">
            <Heading size="2xl">장바구니</Heading>
            <Stack direction={{ base: 'column', md: "row" }}>
                <Box borderWidth="1px" rounded="md" p="10px" width={{ base: 'full', md: "3/4" }}>
                    {orderBasketList.length > 0 ? (
                        <Stack gap="4" separator={<StackSeparator />}>
                            {orderBasketList.map((orderBasket) => {
                                const checked = selectedBasketList.some(selectedBasket => selectedBasket.order_basket_code === orderBasket.order_basket_code);

                                return (
                                    <OrderBasketProduct
                                        key={orderBasket.order_basket_code}
                                        orderBasket={orderBasket}
                                        checked={checked}
                                        changeSelectBasket={changeSelectBasket}
                                        removeBasket={removeBasket}
                                        changeQuantity={onChangeQuantity}
                                    />
                                )
                            })}
                        </Stack>
                    ) : (
                        <EmptyState.Root>
                            <EmptyState.Content>
                                <EmptyState.Indicator><LuShoppingCart /></EmptyState.Indicator>
                                <Stack textAlign="center">
                                    <EmptyState.Title>장바구니에 담은 상품이 없습니다.</EmptyState.Title>
                                </Stack>
                            </EmptyState.Content>
                        </EmptyState.Root>
                    )}
                </Box>
                <Box width={{ base: 'full', md: "1/4" }} position={{ base: 'fixed', md: "relative" }} left="0" bg="white" bottom="0" zIndex="2">
                    <Stack gap="4" position="sticky" top="10px" borderWidth="1px" rounded="md" p={{ base: '15px', md: "10px" }}>
                        <Heading>주문 금액</Heading>
                        <DataList.Root orientation="horizontal" >
                            <DataList.Item>
                                <DataList.ItemLabel>총 상품 금액</DataList.ItemLabel>
                                <DataList.ItemValue justifyContent="end">{formatNumber(totalProductPrice)}원</DataList.ItemValue>
                            </DataList.Item>
                            <DataList.Item>
                                <DataList.ItemLabel>배송비</DataList.ItemLabel>
                                <DataList.ItemValue justifyContent="end">{deliveryCost}</DataList.ItemValue>
                            </DataList.Item>
                        </DataList.Root>
                        <Separator />
                        <Text fontWeight="medium" textAlign="right">{formatNumber(totalProductPrice + (typeof deliveryCost === 'string' ? 0 : deliveryCost))}원</Text>
                        <Button disabled={selectedProductCount > 0 ? false : true} onClick={onOrder}>
                            {selectedProductCount > 0 ? `총 ${formatNumber(selectedBasketList.length)}개 구매하기` : `구매할 제품을 선택해주세요.`}
                        </Button>
                    </Stack>
                </Box>
            </Stack>
            <HStack gap="6">
                <Checkbox.Root checked={allChecked} onCheckedChange={(e) => handleAllChekced(!!e.checked)}>
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Checkbox.Label>전체 선택</Checkbox.Label>
                </Checkbox.Root>
                <Button variant="outline" onClick={removeSelectedBasket}>선택 삭제</Button>
            </HStack>
        </Stack>
    )
}

export default Cart;