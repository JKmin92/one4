import { Box, Button, Checkbox, Heading, HStack, Icon, Image, Link, Stack, Table, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../../utils/api";
import { formatDate, formatNumber } from "../../../../utils/simpleUtils";
import { LuExternalLink } from "react-icons/lu";

function List() {
    const { id } = useParams();
    const [claimList, setClaimList] = useState([]);

    useEffect(() => {
        const getClaimData = async () => {
            const res = await axiosInstance.get(`/admin/shop/order/claim/${id}`);
            console.log(res.data);
            setClaimList(res.data || []);
        }
        getClaimData();
    }, [id]);

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

    const claimStatus = (status) => {
        switch (status) {
            case 'REQUESTED':
                return '접수';
            case 'PROCESSING':
                return '처리 중';
            case 'COMPLETED':
                return '완료';
            case 'REJECTED':
                return '거절';
            default:
                return '-';
        }
    }

    return (
        <Stack p="30px" px="layoutX" gap="6">
            <Heading fontSize='2xl'>{id === 'cancel' ? '취소 리스트' : id === 'exchange' ? '교환 리스트' : id === 'return' ? '반품 리스트' : id === 'refund' ? '환불 리스트' : '자동 취소 리스트'}</Heading>

            <Table.ScrollArea maxW="full">
                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader textAlign="center">
                                <Checkbox.Root>
                                    <Checkbox.Indicator />
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
                            <Table.ColumnHeader textAlign="center">총 배송비</Table.ColumnHeader>
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

                            return (
                                <Table.Row key={claim.order_claim_code}>
                                    <Table.Cell textAlign="center" rowSpan={claim.claim_items.length}>
                                        <Checkbox.Root>
                                            <Checkbox.Indicator />
                                            <Checkbox.Control />
                                        </Checkbox.Root>
                                    </Table.Cell>
                                    <Table.Cell textAlign="center" rowSpan={claim.claim_items.length} fontSize="xs">{formatDate(claim.order_created_at)}</Table.Cell>
                                    <Table.Cell textAlign="center" rowSpan={claim.claim_items.length} fontSize="xs">{formatDate(claim.created_at)}</Table.Cell>
                                    <Table.Cell textAlign="center" rowSpan={claim.claim_items.length} fontSize="xs">{claim.claim_status === 'complete' ? formatDate(claim.completed_at) : '-'}</Table.Cell>
                                    <Table.Cell textAlign="center" rowSpan={claim.claim_items.length}>
                                        <HStack fontSize="xs">
                                            <Link href={`/admin/shop/order/${claim.order_code}`} target="_blank" color="fg.info">
                                                {claim.order_code}
                                                <Icon size="xs"><LuExternalLink /></Icon>
                                            </Link>
                                        </HStack>
                                    </Table.Cell>
                                    <Table.Cell textAlign="center" rowSpan={claim.claim_items.length}><Stack gap="0"><Text>{claim.user_name}</Text><Text fontSize='xs' color='gray.600'>{claim.user_email}</Text></Stack></Table.Cell>
                                    <Table.Cell>
                                        {claim.claim_items.map(item => {
                                            return (
                                                <HStack key={item.order_claim_item_code}>
                                                    <Image src={item.product_image_url} w="12" rounded="md" />
                                                    <Stack>
                                                        <Text whiteSpace="pre-line">{item.product_name}</Text>
                                                        {item.product_option_value && (<Text fontSize="sm">{item.product_option_value}</Text>)}
                                                    </Stack>
                                                </HStack>
                                            )
                                        })}
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                        {claim.claim_items.map(item => (
                                            <Text key={item.order_claim_item_code}>{item.quantity}</Text>
                                        ))}
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                        {claim.claim_items.map(item => (
                                            <Text key={item.order_claim_item_code}>{formatNumber(item.each_price)}원</Text>
                                        ))}
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">{formatNumber(totalPrice)}원</Table.Cell>
                                    <Table.Cell textAlign="center">{formatNumber(claim.delivery_price)}원</Table.Cell>
                                    <Table.Cell>{getPaymentMethod(claim.payment_type)}</Table.Cell>
                                    <Table.Cell>{claimCategory(claim.reason_category)}</Table.Cell>
                                    <Table.Cell textAlign="center">{claimStatus(claim.claim_status)}</Table.Cell>
                                    <Table.Cell textAlign="center"><Button size='xs' rounded="sm">확인</Button></Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table.Root>
            </Table.ScrollArea>
        </Stack>
    )
}

export default List;