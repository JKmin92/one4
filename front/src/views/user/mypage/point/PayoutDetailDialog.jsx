import { Button, CloseButton, Dialog, HStack, Stack, Text } from "@chakra-ui/react";
import { formatDateYMD, formatNumber } from "../../../../utils/simpleUtils";
import { useState } from "react";

function PayoutDetailDialog({ userPointPayout }) {

    const [open, setOpen] = useState(false);

    return (
        <Dialog.Root open={open} onOpenChange={e => setOpen(e.open)}>
            <Dialog.Trigger asChild>
                <Button size="xs" variant="outline">자세히보기</Button>
            </Dialog.Trigger>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>{formatDateYMD(userPointPayout.created_at)} 출금 신청</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        <Stack gap="4">
                            <HStack justifyContent="space-between">
                                <Text>신청 일시</Text>
                                <Text>{formatDateYMD(userPointPayout.created_at)}</Text>
                            </HStack>
                            <HStack justifyContent="space-between">
                                <Text>상태</Text>
                                <Text>{userPointPayout.status === 'REQUEST' ? '출금 신청' : userPointPayout.status === 'COMPLETED' ? '지급 완료' : '지급 반려'}</Text>
                            </HStack>
                            {userPointPayout.status === 'COMPLETED' && (
                                <HStack justifyContent="space-between">
                                    <Text>지급 일시</Text>
                                    <Text>{userPointPayout.processed_at ? formatDateYMD(userPointPayout.processed_at) : '-'}</Text>
                                </HStack>
                            )}
                            <HStack justifyContent="space-between">
                                <Text>계좌</Text>
                                <Text>[{userPointPayout.bank}] {userPointPayout.number} ({userPointPayout.holder})</Text>
                            </HStack>
                            <HStack justifyContent="space-between">
                                <Text>금액</Text>
                                <Text>{formatNumber(userPointPayout.amount)}원</Text>
                            </HStack>
                        </Stack>
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Button variant="outline" w="full" onClick={() => setOpen(false)}>확인</Button>
                    </Dialog.Footer>
                    <Dialog.CloseTrigger asChild>
                        <CloseButton />
                    </Dialog.CloseTrigger>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )

}

export default PayoutDetailDialog;