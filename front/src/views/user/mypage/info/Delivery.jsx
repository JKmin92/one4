import { Box, Button, Checkbox, CloseButton, Dialog, Field, Flex, HStack, Icon, Input, RadioCard, Stack, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { LuChevronRight, LuSearch } from "react-icons/lu";

function AddDelivery({ deliveryList, setDeliveryList, setAddDeliveryStatus, delivery }) {

    const [isSearch, setIsSearch] = useState(false);
    const searchAddressRef = useRef(null);
    const nameRef = useRef(null)
    const [postcode, setPostcode] = useState(delivery && delivery.postcode);
    const [address, setAddress] = useState(delivery && delivery.address);
    const detailAddressRef = useRef(null);
    const phoneRef = useRef(null);

    const openPostcode = () => {
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
        const newAddress = {
            id: id,
            name: nameRef.current.value,
            postcode: postcode,
            address: address,
            detailAddress: detailAddressRef.current.value,
            phone: phone
        };

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
                        <Input placeholder="수령자 성함을 입력해주세요." ref={nameRef} value={delivery && delivery.name} />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>주소</Field.Label>
                        <Button variant="ghost" w="100%" p="0" onClick={openPostcode}>
                            <Flex justifyContent="space-between" w="100%" borderColor="bg.emphasized" borderWidth="1px" p="10px" rounded="sm">
                                <Text whiteSpace="pre-line" textAlign="left" pr="10px">{postcode ? `[${postcode}] ${address}` : '주소검색'}</Text>
                                <Icon size="md"><LuSearch /></Icon>
                            </Flex>
                        </Button>
                        <Input placeholder="상세 주소" ref={detailAddressRef} value={delivery && delivery.detailAddress} />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>연락처</Field.Label>
                        <Input placeholder="'-'를 제외하고 입력해주세요." ref={phoneRef} value={delivery && delivery.phone} />
                    </Field.Root>

                    <Field.Root>
                        <Checkbox.Root>
                            <Checkbox.HiddenInput />
                            <Checkbox.Control />
                            <Checkbox.Label>기본 배송지로 설정</Checkbox.Label>
                        </Checkbox.Root>
                    </Field.Root>
                </Stack>
                {delivery ? (
                    <Stack direction="row">
                        <Button onClick={addAddress} w="1/2" bg="red">삭제</Button>
                        <Button onClick={addAddress} w="1/2">배송지 수정</Button>
                    </Stack>
                ) : (
                    <Button onClick={addAddress}>배송지 추가</Button>
                )}
            </Stack>
        </Stack>
    )
}


function Delivery({ deliveryList, setDeliveryList }) {

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const [addDeliveryStatus, setAddDeliveryStatus] = useState(false);
    const [delivery, setDelivery] = useState(null);
    const [selectedId, setSelectedId] = useState(0);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!deliveryList) return;

        const selected = deliveryList.find(d => d.selected === true);
        if (selected) {
            setDelivery(selected);
            setSelectedId(selected.id);
        }


    }, [deliveryList]);

    const selectAddress = () => {
        const selected = deliveryList.find(d => d.id === selectedId);
        if (selected) {
            setDelivery(selected);
            setOpen(false);
        }
    }

    const editAddress = () => {
        const address = deliveryList.find(d => d.id === selectedId);
        if (address) {
            setAddDeliveryStatus(true);
            setDelivery(address);
            setOpen(false);
        }
    }

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <Button variant="ghost" justifyContent="space-between">배송지 관리<LuChevronRight /></Button>
            </Dialog.Trigger>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>배송지 관리</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        {addDeliveryStatus ? (
                            <AddDelivery deliveryList={deliveryList} setDeliveryList={setDeliveryList} setAddDeliveryStatus={setAddDeliveryStatus} delivery={delivery} />
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
                                    <Button width="1/2" onClick={editAddress}>배송지 수정</Button>
                                </HStack>
                            ) : (
                                <Button variant="outline" w="full" onClick={() => setAddDeliveryStatus(true)}>배송지 추가</Button>
                            )
                        )}
                    </Dialog.Footer>
                    <Dialog.CloseTrigger asChild>
                        <CloseButton size="sm" />
                    </Dialog.CloseTrigger>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}

export default Delivery;