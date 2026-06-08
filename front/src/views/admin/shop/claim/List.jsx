import { Box, Button, Checkbox, Heading, HStack, Icon, Image, Link, NativeSelect, Stack, StackSeparator, Status, Table, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../../utils/api";
import { formatDate, formatNumber } from "../../../../utils/simpleUtils";
import { LuCheck, LuExternalLink } from "react-icons/lu";
import ProcessDialog from "./ProcessDialog";
import { toaster } from "../../../../components/ui/toaster";

function List() {
    const { id } = useParams();
    const [claimList, setClaimList] = useState([]);
    const [changeStatus, setChangeStatus] = useState(false);
    const [detailStatus, setDetailStatus] = useState(null);

    const [allChecked, setAllChecked] = useState(false);
    const [checkedItems, setCheckedItems] = useState([]);

    const title = id === 'cancel' ? '취소' : id === 'exchange' ? '교환' : id === 'return' ? '반품' : id === 'refund' ? '환불' : '자동 취소';

    useEffect(() => {
        getClaimData();
    }, [id]);

    const getClaimData = async () => {
        try {
            const res = await axiosInstance.get(`/admin/shop/order/claim/${id}`);
            setClaimList(res.data || []);
        } catch (e) {
            console.error(e);
            toaster.create({ title: '오류가 발생했습니다.', type: 'error' });
        }
    }

    useEffect(() => {
        if (changeStatus) {
            getClaimData();
            setChangeStatus(false);
        }
    }, [changeStatus]);

    const handleAllCheck = (e) => {
        const isChecked = !!e.checked;
        setAllChecked(isChecked);
        if (isChecked) {
            setCheckedItems(claimList.map(claim => claim.order_claim_code));
        } else {
            setCheckedItems([]);
        }
    }

    const handleSingleCheck = (e, order_claim_code) => {
        const isChecked = !!e.checked;
        if (isChecked) {
            setCheckedItems(prev => [...prev, order_claim_code]);
        } else {
            setCheckedItems(prev => prev.filter(code => code !== order_claim_code));
        }
    }

    useEffect(() => {
        if (claimList.length > 0 && checkedItems.length === claimList.length) {
            setAllChecked(true);
        } else {
            setAllChecked(false);
        }
    }, [checkedItems, claimList]);

    const changeDetailStatus = async () => {
        try {
            if (detailStatus === null) {
                toaster.create({ title: '상태를 선택해주세요.', type: 'error' })
                return;
            }

            if (checkedItems.length === 0) {
                toaster.create({ title: '선택한 상품이 없습니다.', type: 'error' })
                return;
            }

            const res = await axiosInstance.put(`/admin/shop/order/claim/detailStatus`, {
                order_claim_codes: checkedItems, status: detailStatus
            });

            if (res.data.success) {
                toaster.create({ title: '처리되었습니다.', type: 'success' });
                setChangeStatus(true);
            } else {
                toaster.create({ title: '오류가 발생했습니다.', type: 'error' })
            }
        } catch (e) {
            console.error(e);
            toaster.create({ title: '오류가 발생했습니다.', type: 'error' });
        }
    }

    const gotoProcessing = async () => {
        try {
            if (checkedItems.length === 0) {
                toaster.create({ title: '선택한 상품이 없습니다.', type: 'error' })
                return;
            }

            const res = await axiosInstance.put(`/admin/shop/order/claims/processing`, {
                order_claim_codes: checkedItems
            });

            if (res.data.success) {
                toaster.create({ title: '처리되었습니다.', type: 'success' });
                setChangeStatus(true);
            } else {
                toaster.create({ title: '오류가 발생했습니다.', type: 'error' })
            }
        } catch (e) {
            console.error(e);
            toaster.create({ title: '오류가 발생했습니다.', type: 'error' });
        }
    }

    const gotoRejecting = async () => {
        try {
            if (checkedItems.length === 0) {
                toaster.create({ title: '선택한 상품이 없습니다.', type: 'error' })
                return;
            }

            const res = await axiosInstance.put(`/admin/shop/order/claims/rejected`, {
                order_claim_codes: checkedItems
            });

            if (res.data.success) {
                toaster.create({ title: '처리되었습니다.', type: 'success' });
                setChangeStatus(true);
            } else {
                toaster.create({ title: '오류가 발생했습니다.', type: 'error' })
            }
        } catch (e) {
            console.error(e);
            toaster.create({ title: '오류가 발생했습니다.', type: 'error' });
        }
    }

    const gotoCompleted = async () => {
        try {
            const res = await axiosInstance.put(`/admin/shop/order/claims/completed`, {
                order_claim_codes: checkedItems
            });

            if (res.data.success) {
                toaster.create({ title: '처리되었습니다.', type: 'success' });
                setChangeStatus(true);
            } else {
                toaster.create({ title: '오류가 발생했습니다.', type: 'error' })
            }
        } catch (e) {
            console.error(e);
            toaster.create({ title: '오류가 발생했습니다.', type: 'error' });
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

    const claimStatus = (status, detail_status) => {
        switch (status) {
            case 'REQUESTED':
                return { title: `${title} 접수`, color: 'orange' };
            case 'PROCESSING':
                switch (detail_status) {
                    case 'RETURN_REQUEST': return { title: '반송 접수', color: 'blue' };
                    case 'RETURN_SHIPPING': return { title: '반송중', color: 'blue' };
                    case 'RETURN_RECEIVED': return { title: '반송 완료', color: 'blue' };
                    case 'RETURN_HOLD': return { title: '반송 보류', color: 'red' };
                    case 'RESEND_HOLD': return { title: '재발송 보류', color: 'red' };
                    case 'RESEND_SHIPPING': return { title: '재발송중', color: 'blue' };
                    case 'RESEND_COMPLETED': return { title: '재발송 완료', color: 'green' };
                    default: return { title: '처리 중', color: 'blue' };
                }
            case 'COMPLETED':
                return { title: `${title} 완료`, color: 'green' };
            case 'REJECTED':
                return { title: `${title} 거절`, color: 'red' };
            default:
                return { title: '-', color: 'red' };
        }
    }

    return (
        <Stack p="30px" px="layoutX" gap="6">
            <Heading fontSize='2xl'>{title} 리스트</Heading>

            <Stack gap="4">
                <HStack>
                    <Button size="xs" bg="blue" onClick={gotoProcessing}>선택한 {title} 신청 승인</Button>
                    <Button size="xs" bg="red" onClick={gotoRejecting}>선택한 {title} 반려</Button>
                    {(id === 'exchange' || id === 'cancel') && <Button size="xs" bg="green" onClick={gotoCompleted}>선택한 {title} 완료</Button>}
                </HStack>
                {(id === 'exchange' || id === 'return') && (
                    <Box>


                        <HStack fontSize="sm">
                            <LuCheck />
                            <Text>선택한 상품을</Text>

                            <NativeSelect.Root size="xs" rounded="md" w="200px" value={detailStatus} onChange={(e) => setDetailStatus(e.target.value)}>
                                <NativeSelect.Field placeholder="상태를 선택해주세요.">
                                    {id === 'exchange' || id === 'return' ? (
                                        <>
                                            <option value="RETURN_REQUEST">반송 접수</option>
                                            <option value="RETURN_SHIPPING">반송중</option>
                                            <option value="RETURN_RECEIVED">반송 완료</option>
                                            <option value="RETURN_HOLD">반송 보류</option>
                                            {id === 'exchange' && (
                                                <>
                                                    <option value="RESEND_SHIPPING">재발송중</option>
                                                    <option value="RESEND_COMPLETED">재발송 완료</option>
                                                    <option value="RESEND_HOLD">재발송 보류</option>
                                                </>
                                            )}
                                            {id === 'return' && (
                                                <option value="REFUND_ACTIVE">환불 승인</option>
                                            )}
                                        </>
                                    ) : null}
                                </NativeSelect.Field>
                            </NativeSelect.Root>
                            <Button size="xs" onClick={changeDetailStatus}>변경</Button>
                        </HStack>
                    </Box>
                )}

                <Table.ScrollArea maxW="full">
                    <Table.Root>
                        <Table.ColumnGroup>
                            <Table.Column w="50px" />
                            <Table.Column w="50px" />
                            <Table.Column w="50px" />
                            <Table.Column w="50px" />
                            <Table.Column w="50px" />
                            <Table.Column w="120px" />
                            <Table.Column w="auto" minW="250px" />
                            <Table.Column w="50px" />
                            <Table.Column w="120px" />
                            <Table.Column w="120px" />
                            <Table.Column w="120px" />
                            <Table.Column w="120px" />
                            <Table.Column w="120px" />
                            <Table.Column w="120px" />
                        </Table.ColumnGroup>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader textAlign="center">
                                    <Checkbox.Root checked={allChecked} onCheckedChange={handleAllCheck}>
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control />
                                    </Checkbox.Root>
                                </Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center">주문 일시</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center">{id === 'cancel' ? '취소' : id === 'exchange' ? '교환' : id === 'return' ? '반품' : id === 'refund' ? '환불' : ''} 신청일</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center">완료 일시</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center">주문번호</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center">주문자</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center">주문 상품</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center">수량</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center">상품 금액</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center">총 상품금액</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center">결제된 배송비</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center">결제방법</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center">사유</Table.ColumnHeader>
                                {id === 'refund' ? (
                                    <>
                                        <Table.ColumnHeader textAlign="center">환불수단</Table.ColumnHeader>
                                        <Table.ColumnHeader textAlign="center">환불처리</Table.ColumnHeader>
                                    </>
                                ) : (
                                    <>
                                        <Table.ColumnHeader textAlign="center">처리상태</Table.ColumnHeader>
                                        <Table.ColumnHeader textAlign="center">처리</Table.ColumnHeader>
                                    </>
                                )}
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {claimList.map((claim) => {
                                const totalPrice = claim.claim_items.reduce((acc, item) => acc + item.each_price * item.quantity, 0);
                                const claimStatusResult = claimStatus(claim.claim_status, claim.detail_status);

                                return claim.claim_items.map((item, index) => {
                                    return (
                                        <Table.Row key={item.order_claim_item_code}>
                                            {index === 0 && (
                                                <>
                                                    <Table.Cell textAlign="center" rowSpan={claim.claim_items.length}>
                                                        <Checkbox.Root checked={checkedItems.includes(claim.order_claim_code)} onCheckedChange={(e) => handleSingleCheck(e, claim.order_claim_code)}>
                                                            <Checkbox.HiddenInput />
                                                            <Checkbox.Control />
                                                        </Checkbox.Root>
                                                    </Table.Cell>
                                                    <Table.Cell textAlign="center" rowSpan={claim.claim_items.length} fontSize="xs">{formatDate(claim.order_created_at)}</Table.Cell>
                                                    <Table.Cell textAlign="center" rowSpan={claim.claim_items.length} fontSize="xs">{formatDate(claim.created_at)}</Table.Cell>
                                                    <Table.Cell textAlign="center" rowSpan={claim.claim_items.length} fontSize="xs">{claim.claim_status === 'COMPLETED' ? formatDate(claim.completed_at) : '-'}</Table.Cell>
                                                    <Table.Cell textAlign="center" rowSpan={claim.claim_items.length}>
                                                        <HStack fontSize="xs">
                                                            <Link href={`/admin/shop/order/${claim.order_code}`} target="_blank" color="fg.info">
                                                                {claim.order_code}
                                                                <Icon size="xs"><LuExternalLink /></Icon>
                                                            </Link>
                                                        </HStack>
                                                    </Table.Cell>
                                                    <Table.Cell textAlign="center" rowSpan={claim.claim_items.length}>
                                                        <Stack gap="0">
                                                            <Text>{claim.user_name}</Text>
                                                            <Text fontSize='xs' color='gray.600'>{claim.user_email}</Text>
                                                        </Stack>
                                                    </Table.Cell>
                                                </>
                                            )}

                                            <Table.Cell>
                                                <HStack>
                                                    <Image src={item.product_image_url} w="12" rounded="md" />
                                                    <Stack gap="0">
                                                        <Text whiteSpace="pre-line" fontSize="sm">{item.product_name}</Text>
                                                        {item.product_option_value && (<Text fontSize="xs">{item.product_option_value}</Text>)}
                                                    </Stack>
                                                </HStack>
                                            </Table.Cell>

                                            <Table.Cell textAlign="center">
                                                <Text>{item.quantity}</Text>
                                            </Table.Cell>

                                            <Table.Cell textAlign="center">
                                                <Text>{formatNumber(item.each_price * item.quantity)}원</Text>
                                            </Table.Cell>

                                            {index === 0 && (
                                                <>
                                                    <Table.Cell textAlign="center" rowSpan={claim.claim_items.length}>{formatNumber(totalPrice)}원</Table.Cell>
                                                    <Table.Cell textAlign="center" rowSpan={claim.claim_items.length}>{formatNumber(claim.delivery_price)}원</Table.Cell>
                                                    <Table.Cell rowSpan={claim.claim_items.length}>{getPaymentMethod(claim.payment_type)}</Table.Cell>
                                                    <Table.Cell rowSpan={claim.claim_items.length}>{claimCategory(claim.reason_category)}</Table.Cell>
                                                    <Table.Cell textAlign="center" rowSpan={claim.claim_items.length}>
                                                        <Status.Root colorPalette={claimStatusResult.color}>
                                                            <Status.Indicator /> {claimStatusResult.title}
                                                        </Status.Root>
                                                    </Table.Cell>
                                                    <Table.Cell textAlign="center" rowSpan={claim.claim_items.length}>
                                                        <ProcessDialog id={id} claim_items={claim.claim_items} claim={claim} setChangeStatus={setChangeStatus} payment_type={claim.payment_type} />
                                                    </Table.Cell>
                                                </>
                                            )}
                                        </Table.Row>
                                    )
                                })
                            })}
                        </Table.Body>
                    </Table.Root>
                </Table.ScrollArea>
            </Stack>
        </Stack>
    )
}

export default List;