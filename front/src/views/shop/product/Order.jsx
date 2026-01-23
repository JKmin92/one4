import { Accordion, Box, Button, Flex, Heading, HStack, RadioGroup, Stack, StackSeparator, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { formatNumber } from "../../../utils/simpleUtils";

function ProductList({productList, optionList, productQuantity}) {

    return (
        <Box borderWidth="1px" rounded="md">
            <Flex bg="gray.subtle" p="10px" alignItems="center">
                <Heading>상품</Heading>
            </Flex>
            <Stack separator={<StackSeparator />} p="10px 0">
                {productList.map((product, index) => {
                    const options = optionList.filter((option) => option.id === product.id);
                    const quantity = productQuantity.filter((quantity) => quantity.id === product.id);

                    return(
                        <Flex key={index} p="0 10px" justifyContent="space-between" alignItems="center">
                            <Stack  gap="0">
                                <Text fontSize="md">{product.name}</Text>
                                <HStack fontSize="xs">
                                    {options.length > 0 && (
                                        <HStack>
                                            {options.map((option, index) => (
                                                <Text key={index}>{option.label}</Text>
                                            ))}
                                        </HStack>
                                    )}
                                    <Text>수량 {quantity[0]?.quantity}개</Text>
                                </HStack>
                            </Stack>
                            <Text>{formatNumber(product.price)}</Text>
                        </Flex>
                    )
                })}
            </Stack>
        </Box>
    )
}

function Delivery({deliveryList}) {
    const delivery = deliveryList.filter((d) => d.selected == true);

    return (
        <Box borderWidth="1px" rounded="md">
            <Flex bg="gray.subtle" p="10px" justifyContent="space-between" alignItems="center">
                <Heading>배송지</Heading>
                <Button variant="outline" borderColor="gray.fg">배송지 변경</Button>
            </Flex>
            {delivery.length > 0 ? (
                <Stack gap="0" p="10px">
                    <Text fontSize="md">{delivery[0].address}</Text>
                    <Text fontSize="sm">{delivery[0].phone}</Text>
                </Stack>
            ) : (
                <Button>배송지 추가</Button>
            )}
            
        </Box>
    )
}

function Payment() {

    const paymentKinds = [
        {
            value:'card',
            label:'신용/체크카드',
            content:'신용/체크카드 결제 관련 내용 들어갈 예정'
        },
        {
            value:'bank',
            label:'무통장 결제',
            content:'무통장 결제 관련 내용 들어갈 예정'
        },
        {
            value:'escrow',
            label:'에스크로',
            content:'에스크로 결제 관련 내용 들어갈 예정'
        },
    ]

    return (
        <Box borderWidth="1px" rounded="md">
            <Flex bg="gray.subtle" p="10px" alignItems="center">
                <Heading>결제</Heading>
            </Flex>
            <Stack>
                <Accordion.Root collapsible defaultValue={['card']} >
                    {paymentKinds.map((kind) => (
                        <Accordion.Item key={kind.value} value={kind.value} p="10px">
                            <Accordion.ItemTrigger>
                                {kind.label}
                                {/** 
                                <RadioGroup.Item value={kind.value}>
                                    <RadioGroup.ItemHiddenInput />
                                    <RadioGroup.ItemIndicator />
                                    <RadioGroup.ItemText></RadioGroup.ItemText>
                                </RadioGroup.Item>
                                */}
                                <Accordion.ItemIndicator />
                            </Accordion.ItemTrigger>
                            <Accordion.ItemContent>
                                <Accordion.ItemBody>
                                    {kind.content}
                                </Accordion.ItemBody>
                            </Accordion.ItemContent>
                        </Accordion.Item>
                    ))}
                </Accordion.Root>
            </Stack>
        </Box>
    )
}

function Order() {

    const [productList, setProductList] = useState([]);
    const [optionList, setOptionList] = useState([]);
    const [productQuantity, setProductQuantity] = useState([]);
    const [deliveryList, setDeliveryList] = useState([]);

    useEffect(() => {
        
        const products = [
            {id:1, name:'상품 1', price:10000},
            {id:2, name:'상품 2', price:10000},
            {id:3, name:'상품 3', price:10000}
        ]

        const options = [
            {id:1, label:'블루', value:'blue'},
            {id:1, label:'M(medium)', value:'medium'},
            {id:2, label:'블루', value:'blug'}
        ]

        const quantitys = [
            {id:1, quantity:1},
            {id:2, quantity:2},
            {id:3, quantity:1},
        ]

        const deliverys = [
            {id:1, name:'에이민', address:'인천광역시 계양구 오조산로 57번길 15, 명동빌딩 721호', phone:'070-5147-1560', selected:true}
        ]

        setProductList(products);
        setOptionList(options);
        setProductQuantity(quantitys);
        setDeliveryList(deliverys);
    }, []);

    return (
        <Stack p="80px 0" px="layoutX" width="6xl" margin="auto" gap="6">
            <Heading>주문/결제</Heading>
            <Stack direction="row">
                <Box width="3/4">
                    <Stack>
                        <ProductList productList={productList} optionList={optionList} productQuantity={productQuantity} />
                        <Delivery deliveryList={deliveryList} />
                        <Payment />
                    </Stack>
                </Box>
                <Box width="1/4" position="relative">
                    <Stack gap="4" position="sticky" top="10px" borderWidth="1px" rounded="md" p="10px">

                    </Stack>
                </Box>
            </Stack>
        </Stack>
    )
}

export default Order;