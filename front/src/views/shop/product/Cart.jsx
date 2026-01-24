import { Box, Button, Checkbox, CloseButton, DataList, EmptyState, Flex, Heading, HStack, Icon, IconButton, Link, NumberInput, Separator, Stack, StackSeparator, Text } from "@chakra-ui/react";
import { calcDiscountPercent, formatNumber } from "../../../utils/simpleUtils";
import { LuMinus, LuPlus, LuShoppingCart } from "react-icons/lu";
import { useState } from "react";
import { HiX } from "react-icons/hi";

function CartProduct({product, discountPrice, selectedOptions, removeProduct, checked, changeSelectProduct, quantity, changeQuantity}) {

    const price = product.price * quantity
    const discount = discountPrice.length > 0 ? discountPrice[0].price * quantity : 0;
    const totalPrice = price - discount;

    
    return (
        <Flex justifyContent="space-between" alignItems="start">
            <Stack direction="row" gap="6" alignItems="center">
                <Checkbox.Root checked={checked} onCheckedChange={({checked}) => changeSelectProduct(product.id, checked===true)}>
                    <Checkbox.HiddenInput value={product.id} />
                    <Checkbox.Control />
                </Checkbox.Root>
                
                <Box bg="bg.emphasized" aspectRatio="square" rounded="md" width="32"></Box>
                <Stack gap="6">
                    <Stack gap="4">
                        <Stack gap="0">
                            <Text fontSize="lg" fontWeight="medium">{product.name}</Text>
                            {selectedOptions.length > 0 && (
                                <HStack fontSize="sm">
                                    <Text>옵션 : </Text>
                                    {selectedOptions.map((option) => (
                                        <Text key={option.id}>{option.label}</Text>
                                    ))}
                                </HStack>
                            )}
                        </Stack>
                                                
                        {discountPrice.length > 0 ? (
                            <Stack gap="0">
                                <Text fontSize="xs" textDecoration="line-through">{formatNumber(price)}</Text>
                                <HStack alignItems="end">
                                    <Text fontSize="sm" fontWeight="medium">{calcDiscountPercent(price, discount)}%</Text>
                                    <Text fontWeight="medium">{formatNumber(totalPrice)}</Text>
                                </HStack>
                            </Stack>
                        ) : (
                            <Text fontWeight="medium">{formatNumber(totalPrice)}</Text>
                        )}
                    </Stack>

                    <NumberInput.Root min="1" unstyled spinOnPress={false} value={quantity} onValueChange={(e) => changeQuantity(product.id, Number(e.value))}>
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
            <CloseButton size="0" rounded="full" variant="solid" bg="gray.focusRing" onClick={() => removeProduct(product.id)}><Icon size="sm"><HiX /></Icon></CloseButton>
        </Flex>
    )
}

function Cart() {

    const [productList, setProductList] = useState([
        {id:1, name:'상품명 1', price:10000},
        {id:2, name:'상품명 2', price:15000},
        {id:3, name:'상품명 3', price:20000},
        {id:4, name:'상품명 4', price:20000},
        {id:5, name:'상품명 5', price:20000},
        {id:6, name:'상품명 6', price:20000},
        {id:7, name:'상품명 7', price:20000},
        {id:8, name:'상품명 8', price:20000},
        {id:9, name:'상품명 9', price:20000},
    ]);

    const [allChecked, setAllChecked] = useState(false);

    const selectOptions = [
        {id:1, matchId:1, label:'블루', value:'blue'},
        {id:2, matchId:1, label:'M(medium)', value:'medium'},
        {id:3, matchId:2, label:'블루', value:'blue'}
    ]

    const discountPrices = [
        {id:1, matchId:1, price:5000}
    ]

    const [selectedProducts, setSelectedProducts] = useState([{id:1}, {id:2}]);
    const [productQuantitys, setProductQuantitys] = useState([
        {id:1, quantity:1},
        {id:2, quantity:1},
        {id:3, quantity:1},
        {id:4, quantity:1},
        {id:5, quantity:1},
        {id:6, quantity:1},
        {id:7, quantity:1},
        {id:8, quantity:1},
        {id:9, quantity:1}
    ]);

    const removeProduct = (id) => {
        setProductList(prev => prev.filter((product) => product.id !== id));
        setSelectedProducts(prev => prev.filter((product) => product.id !== id));
    }

    const changeSelectProduct = (id, status) => {
        
        if(status) {
            setSelectedProducts(prev => {
                const product = productList.find((pro) => pro.id === id);
                if(!product) return prev;
                if(prev.some(p => p.id === id)) return prev;
                return [...prev, {id:id}];
            });
        } else {
            setSelectedProducts(prev => prev.filter((product) => product.id !== id));
        }
        const allCheck = selectedProducts.length + 1 == productList.length ? true : false;
        setAllChecked(allCheck);
    }

    const onChangeQuantity = (id, quantity) => {
        setProductQuantitys(prev =>
            prev.map(p => p.id === id ? {...p, quantity} : p)
        )
    }

    const totalProductPrice = selectedProducts.reduce((sum, selected) => {
        const product = productList.find(p => p.id === selected.id);
        if(!product) return sum;

        const discount = discountPrices.find(d => d.matchId === product.id);
        const unitPrice = product.price - (discount?.price || 0);
        const quantity = productQuantitys.find(q => q.id === product.id)?.quantity;
        return sum + unitPrice * quantity;
    }, 0);

    const deliveryCost = totalProductPrice >= 50000 ? 0 : 3500;
    const selectedProductCount = selectedProducts.length;

    
    const handleAllChekced = (allCheck) => {
        if(allCheck) {
            setAllChecked(true);
            productList.map((product) => {
                const id = product.id;
                setSelectedProducts(prev => {
                    if(prev.some(p => p.id === id)) return prev;
                    return [...prev, {id}]
                })
            })
        } else {
            setAllChecked(false);
            setSelectedProducts([]);
        }
    }

    const removeSelectedProduct = () => {
        selectedProducts.map((selectProduct) => {
            setProductList(prev => prev.filter((product) => product.id !== selectProduct.id));
            setSelectedProducts(prev => prev.filter((product) => product.id !== selectProduct.id));
        });
    }

    return (
        <Stack p="80px 0" px="layoutX" width="6xl" margin="auto" gap="6">
            <Heading size="2xl">장바구니</Heading>
            <Stack direction="row">
                <Box borderWidth="1px" rounded="md" p="10px" width="3/4">
                    {productList.length > 0 ? (
                        <Stack gap="4" separator={<StackSeparator />}>
                            {productList.map((product) => {
                                
                                const discountPrice = discountPrices.filter((option) => option.matchId === product.id);
                                const selectedOptions = selectOptions.filter((option) => option.matchId === product.id);
                                const checked = selectedProducts.some(p => p.id == product.id);
                                const productQuantity = productQuantitys.filter(p => p.id === product.id);
                                const quantity = productQuantity[0] ? productQuantity[0]?.quantity : 1;

                                
                                return(
                                    <CartProduct 
                                        key={product.id} 
                                        product={product} 
                                        discountPrice={discountPrice} 
                                        selectedOptions={selectedOptions} 
                                        removeProduct={removeProduct} 
                                        checked={checked} 
                                        changeSelectProduct={changeSelectProduct}
                                        quantity={quantity}
                                        changeQuantity={onChangeQuantity} />
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
                <Box width="1/4" position="relative">
                    <Stack gap="4" position="sticky" top="10px" borderWidth="1px" rounded="md" p="10px">
                        <Heading>주문 금액</Heading>
                        <DataList.Root orientation="horizontal" >
                            <DataList.Item>
                                <DataList.ItemLabel>총 상품 금액</DataList.ItemLabel>
                                <DataList.ItemValue justifyContent="end">{formatNumber(totalProductPrice)}원</DataList.ItemValue>
                            </DataList.Item>
                            <DataList.Item>
                                <DataList.ItemLabel>배송비</DataList.ItemLabel>
                                <DataList.ItemValue justifyContent="end">{formatNumber(deliveryCost)}원</DataList.ItemValue>
                            </DataList.Item>
                        </DataList.Root>
                        <Separator />
                        <Text fontWeight="medium" textAlign="right">{formatNumber(totalProductPrice + deliveryCost)}원</Text>
                        <Button disabled={selectedProductCount > 0 ? false : true} asChild>
                            <Link href="/order" onClick={(e) => selectedProductCount <= 0 && e.preventDefault()}>
                            {selectedProductCount > 0 ? `총 ${formatNumber(selectedProducts.length)}개 구매하기` : `구매할 제품을 선택해주세요.`}
                            </Link>
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
                <Button variant="outline" onClick={removeSelectedProduct}>선택 삭제</Button>
            </HStack>
        </Stack>
    )
}

export default Cart;