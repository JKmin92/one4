import { Button, Checkbox, CloseButton, Dialog, HStack, Image, NativeSelect, RadioGroup, Stack, Table, Text, Textarea } from "@chakra-ui/react";
import { useState, useEffect } from "react";

const LocalTextarea = ({ value, onChange, ...props }) => {
    const [localValue, setLocalValue] = useState(value || "");
    useEffect(() => {
        setLocalValue(value || "");
    }, [value]);
    return (
        <Textarea
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={(e) => {
                if (onChange) onChange(e);
            }}
            {...props}
        />
    );
};

function ExchangeDialog({ open, onOpenChange, orderItemList = [], submitClaim }) {
    const [selectedItems, setSelectedItems] = useState([]);
    const [allChecked, setAllChecked] = useState(false);
    const [selectedType, setSelectedType] = useState('');
    const [reasonCategory, setReasonCategory] = useState('MIND');
    const [reasonDetail, setReasonDetail] = useState('');
    const [isSubmitChecked, setIsSubmitChecked] = useState(false);
    const [selectedQuantities, setSelectedQuantities] = useState({});
    const [isAgree, setIsAgree] = useState(false);

    const confirmAction = async () => {
        const claimItems = selectedItems.map(code => {
            const item = orderItemList.find(i => i.order_item_code === code);
            const quantity = selectedQuantities[code] ?? (item ? item.quantity : 0);
            return {
                order_item_code: code,
                quantity: quantity
            };
        });

        await submitClaim({
            reason_type: reasonCategory,
            reason_detail: reasonDetail,
            product_order_items: claimItems,
            claim_type: selectedType === '교환' ? 'EXCHANGE' : 'RETURN'
        });

        onOpenChange({ open: false });
        setReasonCategory('MIND');
        setReasonDetail('');
        setSelectedItems([]);
        setAllChecked(false);
        setSelectedType('');
        setSelectedQuantities({});
        setIsAgree(false);
    }

    useEffect(() => {
        if (!open) {
            onOpenChange({ open: false });
            setReasonCategory('MIND');
            setReasonDetail('');
            setSelectedItems([]);
            setAllChecked(false);
            setSelectedType('');
            setSelectedQuantities({});
            setIsAgree(false);
        }
    }, [open]);

    useEffect(() => {
        setIsSubmitChecked(!!reasonCategory && !!reasonDetail && !!isAgree && selectedItems.length > 0);
    }, [reasonCategory, reasonDetail, isAgree, selectedItems]);

    const handleAllCheck = (e) => {
        const isChecked = !!e.checked;
        setAllChecked(isChecked);
        if (isChecked) {
            setSelectedItems(orderItemList.map(item => item.order_item_code));
        } else {
            setSelectedItems([]);
        }
    }

    const handleSingleCheck = (e, order_item_code) => {
        const isChecked = !!e.checked;
        if (isChecked) {
            setSelectedItems(prev => [...prev, order_item_code]);
        } else {
            setSelectedItems(prev => prev.filter(code => code !== order_item_code));
        }
    }

    useEffect(() => {
        if (orderItemList.length > 0 && selectedItems.length === orderItemList.length) {
            setAllChecked(true);
        } else {
            setAllChecked(false);
        }
    }, [selectedItems, orderItemList]);


    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange} size="lg">
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>제품 교환/반품 신청</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        <Stack gap="10">
                            <Table.Root>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeader textAlign="center">
                                            <Checkbox.Root checked={allChecked} onCheckedChange={handleAllCheck}>
                                                <Checkbox.HiddenInput />
                                                <Checkbox.Control />
                                            </Checkbox.Root>
                                        </Table.ColumnHeader>
                                        <Table.ColumnHeader textAlign="center">상품</Table.ColumnHeader>
                                        <Table.ColumnHeader textAlign="center">수량</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {orderItemList?.map(item => {
                                        const itemKey = item.order_item_code || item.product_item_code || item.id;
                                        return (
                                            <Table.Row key={itemKey}>
                                                <Table.Cell textAlign="center">
                                                    <Checkbox.Root checked={selectedItems.includes(item.order_item_code)} onCheckedChange={(e) => handleSingleCheck(e, item.order_item_code)}>
                                                        <Checkbox.HiddenInput />
                                                        <Checkbox.Control />
                                                    </Checkbox.Root>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <HStack>
                                                        <Image src={item.image_url} width="12" rounded="md" />
                                                        <Stack gap="0">
                                                            <Text fontWeight="medium">{item.product_name}</Text>
                                                            {item.product_option_code && (
                                                                <Text fontSize="xs" color="fg.muted">{item.product_option_label} : {item.product_option_value}</Text>
                                                            )}
                                                        </Stack>
                                                    </HStack>

                                                </Table.Cell>
                                                <Table.Cell textAlign="center">
                                                    <NativeSelect.Root size="sm" width="60px" margin="auto">
                                                        <NativeSelect.Field
                                                            value={selectedQuantities[item.order_item_code] ?? item.quantity}
                                                            onChange={(e) => {
                                                                const val = Number(e.target.value);
                                                                setSelectedQuantities(prev => ({
                                                                    ...prev,
                                                                    [item.order_item_code]: val
                                                                }));
                                                            }}
                                                        >
                                                            {Array.from({ length: Number(item.quantity) || 0 }, (_, i) => i + 1).map((val) => (
                                                                <option key={val} value={val}>
                                                                    {val}
                                                                </option>
                                                            ))}
                                                        </NativeSelect.Field>
                                                    </NativeSelect.Root>
                                                </Table.Cell>
                                            </Table.Row>
                                        );
                                    })}
                                </Table.Body>
                            </Table.Root>

                            {selectedItems.length > 0 && (
                                <HStack justifyContent="center" alignItems="center" gap="8">
                                    <Text>선택한 제품을</Text>
                                    <RadioGroup.Root value={selectedType} onValueChange={(e) => setSelectedType(e.value)}>
                                        <HStack gap="6">
                                            <RadioGroup.Item value='교환'>
                                                <RadioGroup.ItemHiddenInput />
                                                <RadioGroup.ItemIndicator />
                                                <RadioGroup.ItemText>교환</RadioGroup.ItemText>
                                            </RadioGroup.Item>
                                            <RadioGroup.Item value='반품'>
                                                <RadioGroup.ItemHiddenInput />
                                                <RadioGroup.ItemIndicator />
                                                <RadioGroup.ItemText>반품</RadioGroup.ItemText>
                                            </RadioGroup.Item>
                                        </HStack>
                                    </RadioGroup.Root>
                                </HStack>
                            )}

                            {(selectedType === '교환' || selectedType === '반품') && (
                                <Table.Root>
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.ColumnHeader>{selectedType} 사유</Table.ColumnHeader>
                                            <Table.Cell>
                                                <NativeSelect.Root value={reasonCategory} onChange={(e) => setReasonCategory(e.target.value)}>
                                                    <NativeSelect.Field>
                                                        <option value='MIND'>단순 변심</option>
                                                        <option value='DEFECTIVE'>상품 불량</option>
                                                        <option value='WRONG'>주문한 상품과 상이</option>
                                                        {selectedType === '교환' && <option value='OPTION'>상품 옵션 변경</option>}
                                                        {selectedType === '반품' && <option value='DELAYED'>배송 지연</option>}
                                                        <option value='OTHER'>기타</option>
                                                    </NativeSelect.Field>
                                                </NativeSelect.Root>
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.ColumnHeader>상세 내용</Table.ColumnHeader>
                                            <Table.Cell>
                                                <LocalTextarea value={reasonDetail} onChange={(e) => setReasonDetail(e.target.value)} placeholder={selectedType === '교환' ? "자세한 사유와 함께 어떤 상품과 교환이 필요하신지 상세히 적어주세요." : "자세한 사유를 상세히 적어주세요."} fontSize="xs" height="48" />
                                            </Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table.Root>
                            )}

                            {selectedType != null && selectedType != '' && (
                                <Stack justifyContent="center" gap="4">
                                    <Checkbox.Root checked={isAgree} onCheckedChange={(e) => setIsAgree(!!e.checked)}>
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control />
                                        <Checkbox.Label>단순 변심, 옵션 변경 등의 경우 왕복 배송비가 추가로 발생할 수 있습니다.</Checkbox.Label>
                                    </Checkbox.Root>
                                    <Button w="full" onClick={confirmAction} disabled={!isSubmitChecked}>{selectedType} 신청</Button>
                                </Stack>
                            )}
                        </Stack>
                    </Dialog.Body>
                    <Dialog.CloseTrigger asChild>
                        <CloseButton size="sm" />
                    </Dialog.CloseTrigger>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
}

export default ExchangeDialog;