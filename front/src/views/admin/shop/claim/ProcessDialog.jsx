import { Accordion, Badge, Box, Button, CloseButton, DataList, Dialog, Heading, HStack, Image, Input, InputGroup, NativeSelect, Span, Stack, StackSeparator, Table, Text } from "@chakra-ui/react";
import { toaster } from "../../../../components/ui/toaster";
import axiosInstance from "../../../../utils/api";
import { useState } from "react";
import { formatNumber } from "../../../../utils/simpleUtils";

function ProcessDialog({ id, claim_items = [], claim, setChangeStatus, payment_type }) {

    const [open, setOpen] = useState(false);
    const [accordionOpen, setAccordionOpen] = useState([]);
    const totalRefundableAmount = claim_items.reduce((acc, item) => acc + (item.product_amount || 0), 0);
    const title = id === 'cancel' ? '취소' : id === 'exchange' ? '교환' : id === 'return' ? '반품' : id === 'refund' ? '환불' : '자동 취소';

    const [refundDeliveryPrice, setRefundDeliveryPrice] = useState(0);
    const [refundChargePrice, setRefundChargePrice] = useState(0);
    const [refundAmount, setRefundAmount] = useState(0);
    const [refundMethod, setRefundMethod] = useState('');

    const getPaymentMethod = (payment_type) => {
        const boxStyle = { fontSize: "xs", p: "1", color: "fg.inverted", rounded: "sm", w: "auto" };

        switch (payment_type) {
            case 'CARD':
                return (<Box {...boxStyle} bg="blue" >신용카드</Box>);
            case 'BANK':
                return (<Box {...boxStyle} bg="green">계좌이체</Box>);
            case 'ESCROW':
                return (<Box {...boxStyle} bg="orange">에스크로</Box>);
            default:
                return (<Box {...boxStyle} bg="gray">알 수 없음</Box>);
        }
    }

    const claimCategory = (category) => {
        switch (category) {
            case 'MIND':
                return '단순변심';
            case 'DEFECTIVE':
                return '상품 불량';
            case 'WRONG':
                return '주문한 상품과 상이';
            case 'OPTION':
                return '상품 옵션 변경';
            case 'DELAYED':
                return '배송 지연';
            case 'OTHER':
                return '기타';
            default:
                return '-';
        }
    }

    const gotoProcessing = async (order_claim_code) => {
        try {
            const response = await axiosInstance.put(`/admin/shop/order/claim/processing`, { order_claim_code });
            if (response.data.success) {
                toaster.create({ title: '처리되었습니다.', type: 'success' });
                setChangeStatus(true);
                setOpen(false);
            } else {
                toaster.create({ title: '오류가 발생했습니다.', type: 'error' })
            }
        } catch (e) {
            console.error(e);
            toaster.create({ title: '오류가 발생했습니다.', type: 'error' })
        }
    }

    const refundComplete = async () => {
        try {

            const data = {
                order_claim_code: claim.order_claim_code,
                deducted_delivery_fee: refundDeliveryPrice,
                refund_charge_amount: refundChargePrice,
                total_refund_amount: refundAmount,
                refund_method: refundMethod,
                total_product_amount: totalRefundableAmount
            }

            const canRefundPrice = totalRefundableAmount + refundDeliveryPrice - refundChargePrice;

            if (!refundMethod) {
                toaster.create({ title: '환불 수단이 선택되지 않았습니다.', type: 'error' });
                return;
            }

            if (refundAmount > canRefundPrice) {
                toaster.create({ title: '환불할 금액이 환불 가능금액보다 클 수 없습니다.', type: 'error' });
                return;
            } else if (refundAmount < canRefundPrice) {
                toaster.create({ title: '환불 가능금액과 환불할 금액이 일치해야합니다.', type: 'error' })
                return;
            }

            const res = await axiosInstance.put('/admin/shop/order/claim/refund', data);
            if (res.data.success) {
                toaster.create({ title: '환불되었습니다.', type: 'success' });
                setChangeStatus(true);
                setOpen(false);
            } else {
                toaster.create({ title: '오류가 발생했습니다.', type: 'error' })
            }

        } catch (e) {
            console.error(e);
            toaster.create({ title: '오류가 발생했습니다.', type: 'error' })
        }

    }

    return (
        <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
            <Dialog.Trigger asChild>
                <Button size='xs' rounded="sm">확인</Button>
            </Dialog.Trigger>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>{title} 처리</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        <Stack gap="6">
                            <Stack>
                                <Heading fontSize="sm" textAlign="left">{title} 상품</Heading>
                                <Stack separator={<StackSeparator />}>
                                    {claim_items.map(item => {
                                        return (
                                            <HStack key={item.order_claim_item_code} justifyContent="space-between">
                                                <HStack gap="4">
                                                    <Image src={item.product_image_url} w="12" rounded="md" />
                                                    <Stack textAlign="left" gap="0">
                                                        <Text whiteSpace="pre-line">{item.product_name}</Text>
                                                        {item.product_option_value && (<Text fontSize="sm">{item.product_option_value}</Text>)}
                                                    </Stack>
                                                </HStack>
                                                <Stack gap="0" textAlign="right">
                                                    <Text>수량 : {item.quantity}개</Text>
                                                    <Text>구매 금액 : {formatNumber(item.product_amount)}원</Text>
                                                </Stack>

                                            </HStack>
                                        )
                                    })}
                                </Stack>
                            </Stack>

                            <Stack>
                                <Accordion.Root collapsible value={accordionOpen} onValueChange={e => setAccordionOpen(e.value)}>
                                    <Accordion.Item value="buyer">
                                        <Accordion.ItemTrigger>
                                            <Span flex="1" fontSize="sm" textAlign="left" fontWeight="semibold">주문자 {!(accordionOpen.includes('buyer')) ? `${claim.user.name} (${claim.user.phone})` : ''} </Span>
                                            <Accordion.ItemIndicator />
                                        </Accordion.ItemTrigger>
                                        <Accordion.ItemContent>
                                            <Accordion.ItemBody>
                                                <DataList.Root orientation="horizontal" gap="2">
                                                    <DataList.Item>
                                                        <DataList.ItemLabel>이름</DataList.ItemLabel>
                                                        <DataList.ItemValue>{claim.user.name}</DataList.ItemValue>
                                                    </DataList.Item>
                                                    <DataList.Item>
                                                        <DataList.ItemLabel>연락처</DataList.ItemLabel>
                                                        <DataList.ItemValue>{claim.user.phone}</DataList.ItemValue>
                                                    </DataList.Item>
                                                    <DataList.Item>
                                                        <DataList.ItemLabel>이메일</DataList.ItemLabel>
                                                        <DataList.ItemValue>{claim.user.email}</DataList.ItemValue>
                                                    </DataList.Item>
                                                </DataList.Root>
                                            </Accordion.ItemBody>

                                        </Accordion.ItemContent>
                                    </Accordion.Item>
                                    <Accordion.Item value="recipient">
                                        <Accordion.ItemTrigger>
                                            <Span flex="1" fontSize="sm" textAlign="left" fontWeight="semibold">수령자 {!(accordionOpen.includes('recipient')) ? `${claim.address.name} (${claim.address.phone})` : ''} </Span>
                                            <Accordion.ItemIndicator />
                                        </Accordion.ItemTrigger>
                                        <Accordion.ItemContent>
                                            <Accordion.ItemBody>
                                                <DataList.Root orientation="horizontal" gap="2">
                                                    <DataList.Item>
                                                        <DataList.ItemLabel>이름</DataList.ItemLabel>
                                                        <DataList.ItemValue>{claim.address.name}</DataList.ItemValue>
                                                    </DataList.Item>
                                                    <DataList.Item>
                                                        <DataList.ItemLabel>연락처</DataList.ItemLabel>
                                                        <DataList.ItemValue>{claim.address.phone}</DataList.ItemValue>
                                                    </DataList.Item>
                                                    <DataList.Item>
                                                        <DataList.ItemLabel>주소</DataList.ItemLabel>
                                                        <DataList.ItemValue whiteSpace="pre-wrap" textAlign="left">[{claim.address.postcode}] {claim.address.address} {claim.address.detailAddress}</DataList.ItemValue>
                                                    </DataList.Item>
                                                </DataList.Root>
                                            </Accordion.ItemBody>
                                        </Accordion.ItemContent>
                                    </Accordion.Item>
                                </Accordion.Root>
                            </Stack>

                            <Stack justifyContent="start">
                                <Box textAlign="left">
                                    <Badge>{claimCategory(claim.reason_category)}</Badge>
                                </Box>
                                <Text textAlign="left">{claim.reason_detail}</Text>
                            </Stack>

                            {claim.refund_bank && (
                                <Stack>
                                    <DataList.Root orientation="horizontal" gap="2">
                                        <DataList.Item>
                                            <DataList.ItemLabel>은행</DataList.ItemLabel>
                                            <DataList.ItemValue>{claim.refund_bank}</DataList.ItemValue>
                                        </DataList.Item>
                                        <DataList.Item>
                                            <DataList.ItemLabel>계좌번호</DataList.ItemLabel>
                                            <DataList.ItemValue>{claim.refund_account_number}</DataList.ItemValue>
                                        </DataList.Item>
                                        <DataList.Item>
                                            <DataList.ItemLabel>예금주</DataList.ItemLabel>
                                            <DataList.ItemValue>{claim.refund_account_holder}</DataList.ItemValue>
                                        </DataList.Item>
                                        <DataList.Item>
                                            <DataList.ItemLabel>결제 방법</DataList.ItemLabel>
                                            <DataList.ItemValue>{getPaymentMethod(payment_type)}</DataList.ItemValue>
                                        </DataList.Item>
                                    </DataList.Root>
                                </Stack>
                            )}

                            {id === 'refund' && claim.claim_status == 'PROCESSING' && (
                                <Stack>
                                    <Table.Root>
                                        <Table.Body>
                                            <Table.Row>
                                                <Table.ColumnHeader>총 제품 금액</Table.ColumnHeader>
                                                <Table.Cell>{formatNumber(totalRefundableAmount)}원</Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.ColumnHeader>택배비 환불</Table.ColumnHeader>
                                                <Table.Cell>
                                                    <InputGroup endElement="원">
                                                        <Input value={refundDeliveryPrice} onChange={e => setRefundDeliveryPrice(e.target.value)} />
                                                    </InputGroup>
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.ColumnHeader>환불 수수료</Table.ColumnHeader>
                                                <Table.Cell>
                                                    <InputGroup endElement="원">
                                                        <Input value={refundChargePrice} onChange={e => setRefundChargePrice(e.target.value)} />
                                                    </InputGroup>
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.ColumnHeader>총 환불 가능 금액</Table.ColumnHeader>
                                                <Table.Cell>{formatNumber((totalRefundableAmount + Number(refundDeliveryPrice) - Number(refundChargePrice)))}원</Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.ColumnHeader>환불 수단</Table.ColumnHeader>
                                                <Table.Cell>
                                                    <NativeSelect.Root>
                                                        <NativeSelect.Field placeholder="환불 수단을 선택해주세요" onChange={e => setRefundMethod(e.target.value)} value={refundMethod}>
                                                            <option value="BANK">계좌이체</option>
                                                            <option value="MILEAGE">마일리지</option>
                                                            {payment_type != 'BANK' && (
                                                                <option value="PG">PG환불</option>
                                                            )}
                                                        </NativeSelect.Field>
                                                        <NativeSelect.Indicator />
                                                    </NativeSelect.Root>
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.ColumnHeader>환불할 금액</Table.ColumnHeader>
                                                <Table.Cell>
                                                    <InputGroup endElement="원">
                                                        <Input onChange={e => setRefundAmount(e.target.value)} value={refundAmount} placeholder="환불할 금액을 입력해주세요" />
                                                    </InputGroup>
                                                </Table.Cell>
                                            </Table.Row>
                                        </Table.Body>
                                    </Table.Root>
                                </Stack>
                            )}

                            {id === 'exchange' && claim.claim_status === 'REQUESTED' ? (
                                <Button onClick={() => gotoProcessing(claim.order_claim_code)}>교환 신청 승인</Button>
                            ) : id === 'exchange' && claim.claim_status === 'PROCESSING' ? (
                                <Button>교환 완료 처리</Button>
                            ) : id === 'return' && claim.claim_status == 'REQUESTED' ? (
                                <Button onClick={() => gotoProcessing(claim.order_claim_code)}>반품 신청 승인</Button>
                            ) : id === 'return' && claim.claim_status === 'PROCESSING' ? (
                                <Button>반품 완료 처리</Button>
                            ) : id === 'refund' && claim.claim_status === 'PROCESSING' ? (
                                <Button onClick={refundComplete}>환불하기</Button>
                            ) : null}
                        </Stack>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton />
                        </Dialog.CloseTrigger>
                    </Dialog.Body>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}

export default ProcessDialog;