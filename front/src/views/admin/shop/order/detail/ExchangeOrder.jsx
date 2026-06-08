import { Badge, Box, Button, CloseButton, Dialog, Image, Stack, Table, Text } from "@chakra-ui/react";
import { formatDate } from "../../../../../utils/simpleUtils";

function ExchangeOrder({ exchangeOrderItemList = [], productOrderClaim }) {

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

    const getClaimStatus = (status) => {
        const statusStyle = { fontSize: 'xs', p: '1', color: 'fg.inverted', rounded: 'sm', textAlign: 'center' }
        switch (status) {
            case 'REQUESTED':
                return (<Box {...statusStyle} bg="gray">접수</Box>);
            case 'PROCESSING':
                return (<Box {...statusStyle} bg="orange">처리중</Box>);
            case 'COMPLETED':
                return (<Box {...statusStyle} bg="green">완료</Box>);
            case 'REJECTED':
                return (<Box {...statusStyle} bg="red">거절</Box>);
            default:
                return (<Box {...statusStyle} bg="gray">알 수 없음</Box>);
        }
    }

    return (
        <Table.Root>
            <Table.Header>
                <Table.Row bg="gray.subtle">
                    <Table.ColumnHeader textAlign="center">요청일시</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">처리상태</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">이미지</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">상품</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">교환수량</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">교환사유</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">교환사유(상세)</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">차액</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">처리일시</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {exchangeOrderItemList.length > 0 ? (
                    exchangeOrderItemList.map((item, index) => {
                        return (
                            <Table.Row key={item.order_item_claim_id}>
                                <Table.Cell textAlign="center">{formatDate(productOrderClaim.created_at)}</Table.Cell>
                                <Table.Cell textAlign="center">{getClaimStatus(productOrderClaim.claim_status)}</Table.Cell>
                                <Table.Cell textAlign="center">
                                    <Image src={item.product_image_url} w="12" rounded="md" margin="auto" />
                                </Table.Cell>
                                <Table.Cell>{item.product_name}</Table.Cell>
                                <Table.Cell textAlign="center">{item.quantity}</Table.Cell>
                                {index === 0 && (
                                    <Table.Cell rowSpan={exchangeOrderItemList.length + 1} textAlign="center">{claimCategory(productOrderClaim.reason_category)}</Table.Cell>
                                )}
                                {index === 0 && (
                                    <Table.Cell rowSpan={exchangeOrderItemList.length + 1} textAlign="center">
                                        <Dialog.Root>
                                            <Dialog.Trigger asChild><Button size="xs">상세 사유</Button></Dialog.Trigger>
                                            <Dialog.Backdrop />
                                            <Dialog.Positioner>
                                                <Dialog.Content>
                                                    <Dialog.Header>
                                                        <Dialog.Title>교환 사유</Dialog.Title>
                                                    </Dialog.Header>
                                                    <Dialog.Body>
                                                        <Stack>
                                                            <Box textAlign="left">
                                                                <Badge w="auto">{claimCategory(productOrderClaim.reason_category)}</Badge>
                                                            </Box>
                                                            <Text textAlign="left">{productOrderClaim.reason_detail}</Text>
                                                        </Stack>
                                                    </Dialog.Body>
                                                    <Dialog.CloseTrigger asChild>
                                                        <CloseButton size="sm" />
                                                    </Dialog.CloseTrigger>
                                                </Dialog.Content>
                                            </Dialog.Positioner>
                                        </Dialog.Root>
                                    </Table.Cell>
                                )}
                                <Table.Cell textAlign="center">0</Table.Cell>
                                <Table.Cell textAlign="center">{productOrderClaim.claim_status === 'COMPLETED' ? formatDate(productOrderClaim.completed_at) : '-'}</Table.Cell>
                            </Table.Row>
                        )
                    })
                ) : (
                    <Table.Row>
                        <Table.Cell colSpan="9" textAlign="center">교환정보가 없습니다.</Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>
        </Table.Root>
    )
}

export default ExchangeOrder;