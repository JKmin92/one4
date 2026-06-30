import { Box, Button, Checkbox, Dialog, Field, Flex, Icon, Input, Stack, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { LuSearch } from "react-icons/lu";
import axiosInstance from "../../../../utils/api";
import { toaster } from "../../../../components/ui/toaster";

function AddressChangeDialog({ open, setOpen, orderCode, currentAddress, onUpdateSuccess }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [postcode, setPostcode] = useState('');
    const [address, setAddress] = useState('');
    const [detailAddress, setDetailAddress] = useState('');
    const [updateDefaultAddress, setUpdateDefaultAddress] = useState(false);

    const searchAddressRef = useRef(null);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    useEffect(() => {
        if (open && currentAddress) {
            setName(currentAddress.name || '');
            setPhone(currentAddress.phone || '');
            setPostcode(currentAddress.postcode || '');
            setAddress(currentAddress.address || '');
            setDetailAddress(currentAddress.detailAddress || '');
            setUpdateDefaultAddress(false);
            setIsSearching(false);
        }
    }, [open, currentAddress]);

    const handleSearchAddress = () => {
        setIsSearching(true);
        setTimeout(() => {
            if (window.daum && window.daum.Postcode) {
                new window.daum.Postcode({
                    oncomplete: function (data) {
                        let addr = '';
                        let extraAddr = '';

                        if (data.userSelectedType === 'R') {
                            addr = data.roadAddress;
                        } else {
                            addr = data.jibunAddress;
                        }

                        if (data.userSelectedType === 'R') {
                            if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                                extraAddr += data.bname;
                            }
                            if (data.buildingName !== '' && data.apartment === 'Y') {
                                extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                            }
                            if (extraAddr !== '') {
                                extraAddr = ' (' + extraAddr + ')';
                            }
                        }

                        setPostcode(data.zonecode);
                        setAddress(addr + extraAddr);
                        setIsSearching(false);
                    },
                    onresize: (size) => {
                        if (searchAddressRef.current) searchAddressRef.current.style.height = size.height + 'px'
                    },
                    width: '100%',
                    height: '100%',
                    maxSuggestItems: 5
                }).embed(searchAddressRef.current);
            }
        }, 0);
    };

    const handleUpdate = async () => {
        if (!name || !phone || !postcode || !address || !detailAddress) {
            toaster.create({ title: "모든 정보를 입력해주세요.", type: "warning" });
            return;
        }

        try {
            const payload = {
                name,
                phone,
                postcode,
                address,
                detailAddress,
                updateDefaultAddress
            };
            await axiosInstance.put(`/shop/product/order/${orderCode}/address`, payload);
            toaster.create({ title: "배송지가 변경되었습니다.", type: "success" });
            setOpen(false);
            onUpdateSuccess();
        } catch {
            toaster.create({ title: "배송지 변경에 실패했습니다.", type: "error" });
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>배송지 변경</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        <Stack gap="4">
                            <Box ref={searchAddressRef} display={isSearching ? 'block' : 'none'} w="full" h="400px" border="1px solid" borderColor="gray.200" rounded="md" overflow="hidden"></Box>

                            <Stack gap="4" display={!isSearching ? 'flex' : 'none'}>
                                <Field.Root>
                                    <Field.Label>성함</Field.Label>
                                    <Input placeholder="수령자 성함을 입력해주세요." value={name} onChange={(e) => setName(e.target.value)} />
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label>주소</Field.Label>
                                    <Button variant="ghost" w="100%" p="0" onClick={handleSearchAddress}>
                                        <Flex justifyContent="space-between" w="100%" borderColor="bg.emphasized" borderWidth="1px" p="10px" rounded="sm">
                                            <Text whiteSpace="pre-line" textAlign="left" pr="10px">{postcode ? `[${postcode}] ${address}` : '주소검색'}</Text>
                                            <Icon size="md"><LuSearch /></Icon>
                                        </Flex>
                                    </Button>
                                    <Input placeholder="상세 주소" value={detailAddress} onChange={(e) => setDetailAddress(e.target.value)} />
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label>연락처</Field.Label>
                                    <Input placeholder="'-'를 제외하고 입력해주세요." value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </Field.Root>

                                <Field.Root>
                                    <Checkbox.Root checked={updateDefaultAddress} onCheckedChange={(e) => setUpdateDefaultAddress(!!e.checked)}>
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control />
                                        <Checkbox.Label>이 주소를 기본 주소지로 업데이트</Checkbox.Label>
                                    </Checkbox.Root>
                                </Field.Root>
                            </Stack>
                        </Stack>
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Dialog.ActionTrigger asChild>
                            <Button variant="outline">취소</Button>
                        </Dialog.ActionTrigger>
                        <Button onClick={handleUpdate}>변경하기</Button>
                    </Dialog.Footer>
                    <Dialog.CloseTrigger />
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}

export default AddressChangeDialog;
