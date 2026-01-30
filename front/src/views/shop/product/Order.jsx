import { Accordion, Box, Button, Checkbox, CloseButton, Collapsible, DataList, Dialog, Field, Flex, Heading, HStack, Icon, Input, InputGroup, RadioCard, RadioGroup, Separator, Stack, StackSeparator, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { formatNumber } from "../../../utils/simpleUtils";
import { LuSearch } from "react-icons/lu";
import { toaster } from "../../../components/ui/toaster";

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
                            <Stack gap="0">
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

function AddDelivery({deliveryList, setDeliveryList, setAddDeliveryStatus}) {

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

                    if(data?.userSelectedType === 'R') addr = data?.roadAddress; 
                    else addr = data?.jibunAddress; 

                    if(data.userSelectedType === 'R') {
                        if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)) extraAddr += data.bname;
                        if (data.buildingName !== "") extraAddr += extraAddr !== "" ? ", " + data.buildingName : data.buildingName;
                        if (extraAddr !== "") extraAddr = `(${extraAddr})`;
                    }

                    setPostcode(data.zonecode);
                    setAddress(addr + extraAddr);
                    setIsSearch(false);
                    window.scrollTo(0, currentScroll);
                }, onresize : (size) => {
                    if(searchAddressRef.current) searchAddressRef.current.style.height = size.height + 'px'
                }, width:'100%', height:'100%',
            }).embed(searchAddressRef.current);
        }, 0);
    }

    const addAddress = () => {
        /** TODO : 별도 address Id 생성 */
        const id = deliveryList.reduce((max,cur) => cur.id > max ? cur.id : max, 0) + 1;
        const phone = phoneRef.current.value.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
        const newAddress = {id:id, name:nameRef.current.value, postcode:postcode, address:address, detailAddress:detailAddressRef.current.value, phone:phone};
        
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

function Delivery({deliveryList, setDeliveryList}) {
    const [addDeliveryStatus, setAddDeliveryStatus] = useState(false);
    const [delivery, setDelivery] = useState(null);
    const [selectedId, setSelectedId] = useState(0);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if(!deliveryList) return;

        const selected = deliveryList.find(d => d.selected === true);
        if(selected) {
            setDelivery(selected);
            setSelectedId(selected.id);
        }
        
        
    }, [deliveryList]);

    const selectAddress = () => {
        const selected = deliveryList.find(d => d.id === selectedId);
        if(selected) {
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
                                        <RadioCard.Root value={selectedId} onValueChange={(e) => setSelectedId(e.value)}>
                                            <Stack gap="4">
                                                {deliveryList.map((del) => (
                                                    <RadioCard.Item key={del.id} value={del.id}>
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

function Payment() {

    const [paymentType, setPaymentType] = useState('card');

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
            <Stack >
                <RadioGroup.Root defaultValue={paymentType} value={paymentType} onValueChange={(e) =>setPaymentType(e.value)}>
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
            {id:1, name:'에이민', postcode:'21069', address:'인천광역시 계양구 오조산로 57번길 15, 명동빌딩', detailAddress:'721호', phone:'070-5147-1560', selected:true},
            {id:2, name:'에이민2', postcode:'21069', address:'인천광역시 계양구 오조산로 57번길 15, 명동빌딩', detailAddress:'721호', phone:'070-5147-1560', selected:false}
        ]

        setProductList(products);
        setOptionList(options);
        setProductQuantity(quantitys);
        setDeliveryList(deliverys);
    }, []);

    return (
        <Stack p={{base:'40px 0', md:"80px 0"}} px={{base:'15px', md:"layoutX"}} width={{base:'full', md:"6xl"}} margin="auto" gap="6">
            <Heading size='2xl'>주문/결제</Heading>
            <Stack direction={{base:'column', md:"row"}}>
                <Box width={{base:'full', md:"3/4"}}>
                    <Stack gap="6">
                        <ProductList productList={productList} optionList={optionList} productQuantity={productQuantity} />
                        <Delivery deliveryList={deliveryList} setDeliveryList={setDeliveryList} />
                        <Payment />
                    </Stack>
                </Box>
                <Box width={{base:'full', md:"1/4"}} position="relative">
                    <Stack gap="6" position="sticky" top="10px" borderWidth="1px" rounded="md" p="10px">
                        <Heading>최종 결제 금액</Heading>
                        <DataList.Root orientation="horizontal">
                            <DataList.Item>
                                <DataList.ItemLabel>총 상품 가격</DataList.ItemLabel>
                                <DataList.ItemValue justifyContent="end">{formatNumber(10000)}</DataList.ItemValue>
                            </DataList.Item>
                            <DataList.Item>
                                <DataList.ItemLabel>배송비</DataList.ItemLabel>
                                <DataList.ItemValue justifyContent="end">{formatNumber(3500)}</DataList.ItemValue>
                            </DataList.Item>
                        </DataList.Root>
                        <Separator/>
                        <DataList.Root orientation="horizontal">
                            <DataList.Item fontWeight="medium">
                                <DataList.ItemLabel>총 결제 금액</DataList.ItemLabel>
                                <DataList.ItemValue justifyContent="end" fontSize="xl">{formatNumber(13500)}</DataList.ItemValue>
                            </DataList.Item>
                        </DataList.Root>
                        <Button>결제하기</Button>
                    </Stack>
                </Box>
            </Stack>
        </Stack>
    )
}

export default Order;