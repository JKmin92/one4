import { Box, Button, CloseButton, Dialog, Heading, HStack, Icon, IconButton, InputGroup, NativeSelect, NumberInput, Span, Stack, Table, Tabs, Text, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { formatDate, formatNumber } from "../../../../../utils/simpleUtils";
import axiosInstance from "../../../../../utils/api";
import { toaster } from "../../../../../components/ui/toaster";
import { LuArrowLeft, LuMinus, LuPlus } from "react-icons/lu";

function PointPayout({ userPointPayout }) {
    const [payoutDialogOpen, setPayoutDialogOpen] = useState(false);
    const [payoutStatus, setPayoutStatus] = useState(null);
    const [reason, setReason] = useState('');

    const changePayoutStatus = (status) => {
        setPayoutStatus(status);
        setReason('');
    }

    useEffect(() => {
        if (!payoutDialogOpen) setPayoutStatus(null);
    }, [payoutDialogOpen]);

    const onSubmit = async () => {
        try {
            const data = { status: payoutStatus, payout_code: userPointPayout.payout_code, reject_description: reason };
            const req = await axiosInstance.put(`/admin/member/user/point/payout/${data.payout_code}`, data);
            if (req.status === 200) {
                toaster.create({ title: '포인트 지급/차감이 완료되었습니다.', type: 'success' });
                setPayoutDialogOpen(false);
                setPayoutStatus(null);
                setReason('');
            } else {
                toaster.create({ title: '포인트 지급/차감에 오류가 생겼습니다.', type: 'error' });
            }
        } catch (e) {
            console.log(e);
            toaster.create({ title: '포인트 지급/차감에 오류가 생겼습니다.', type: 'error' });
        }
    }

    return (
        <Dialog.Root open={payoutDialogOpen} onOpenChange={(e) => setPayoutDialogOpen(e.open)}>
            <Dialog.Trigger asChild>
                <Button size="xs">처리하기</Button>
            </Dialog.Trigger>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title><HStack>{payoutStatus && (<IconButton variant="ghost" size="xs" onClick={() => setPayoutStatus(null)}><LuArrowLeft /></IconButton>)}포인트 출금 신청 처리</HStack></Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        {!payoutStatus ? (
                            <Stack>
                                <Text>은행 : {userPointPayout.bank}</Text>
                                <Text>계좌번호 : {userPointPayout.number}</Text>
                                <Text>예금주 : {userPointPayout.holder}</Text>
                                <Text>출금 금액 : {formatNumber(userPointPayout.amount)}원</Text>
                            </Stack>
                        ) : payoutStatus === 'REJECTED' ? (
                            <Stack gap="6">
                                <Heading size="md" color="red">요청된 출금을 반려하시겠습니까?</Heading>
                                <Textarea placeholder="반려 사유를 입력해주세요." value={reason} onChange={(e) => setReason(e.currentTarget.value)} />
                            </Stack>
                        ) : (
                            <Heading size="md">요청된 출금을 승인하시겠습니까?</Heading>
                        )}
                    </Dialog.Body>
                    <Dialog.Footer>
                        {!payoutStatus ? (
                            <Stack w="full">
                                <Button w="full" onClick={() => changePayoutStatus('COMPLETED')}>지급 완료</Button>
                                <Button w="full" bg="red" onClick={() => changePayoutStatus('REJECTED')}>반려</Button>
                            </Stack>
                        ) : payoutStatus === 'REJECTED' ? (
                            <Button w="full" bg="red" onClick={onSubmit}>반려</Button>
                        ) : (
                            <Button w="full" onClick={onSubmit}>지급 완료</Button>
                        )}
                    </Dialog.Footer>
                    <Dialog.CloseTrigger asChild>
                        <CloseButton />
                    </Dialog.CloseTrigger>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}

function Point({ user_code, name, email, phone }) {
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [type, setType] = useState('');

    const [userPointHistoryList, setUserPointHistoryList] = useState([]);
    const [userPointPayoutList, setUserPointPayoutList] = useState([]);
    const [userPoint, setUserPoint] = useState();

    const getUserPointHistory = async () => {
        const result = await axiosInstance.get(`/admin/member/user/point/history/${user_code}`);
        setUserPointHistoryList(result.data);
    }

    const getUserPointPayout = async () => {
        const result = await axiosInstance.get(`/admin/member/user/point/payout/${user_code}`);
        setUserPointPayoutList(result.data);
    }

    const getUserPoint = async () => {
        const result = await axiosInstance.get(`/admin/member/user/point/${user_code}`);
        setUserPoint(result.data);
    }

    useEffect(() => {
        getUserPoint();
        getUserPointHistory();
        getUserPointPayout();
    }, []);

    const onSubmit = async () => {
        try {
            const cleanAmount = String(amount).replace(/,/g, '');
            const data = { amount: cleanAmount, reason, type }
            console.log(cleanAmount)
            await axiosInstance.put(`/admin/member/user/point/${user_code}`, data);
            toaster.create({ title: '포인트 지급/차감이 완료되었습니다.', type: 'success' });
            setAmount('');
            setReason('');
            setType('');
            getUserPoint();
            getUserPointHistory();
        } catch (error) {
            toaster.create({ title: '포인트 지급/차감에 오류가 생겼습니다.', type: 'error' });
            console.log(error);
        }

    }

    return (
        <Stack>
            <Box w="96" m="auto" mt="20" mb="20">
                <Stack>
                    <Box display="flex" justifyContent="space-between" p="5" bg="blue.solid" w="full" color="#fff" rounded="md">
                        <HStack>
                            <Text fontSize="xs">보유 포인트</Text>
                            <Text fontSize="lg">{formatNumber(userPoint?.current_point ?? 0)}</Text>
                            <Text fontSize="xs">p</Text>
                        </HStack>
                    </Box>
                    <HStack>
                        <NativeSelect.Root fontSize="sm">
                            <NativeSelect.Field placeholder="적립/차감" value={type} onChange={(e) => setType(e.currentTarget.value)}>
                                <option value="EARN">(+)적립</option>
                                <option value="MINUS">(-)차감</option>
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                        <InputGroup endElement="P">
                            <NumberInput.Root value={amount} onValueChange={(e) => setAmount(e.value)} formatOptions={{ style: 'decimal', useGrouping: true }} w="full">
                                <NumberInput.Input />
                            </NumberInput.Root>
                        </InputGroup>
                    </HStack>
                    <Textarea placeholder="사유를 입력해주세요." resize="none" value={reason} onChange={(e) => setReason(e.target.value)} />
                    <Dialog.Root>
                        <Dialog.Trigger asChild><Button>포인트 지급/차감 하기</Button></Dialog.Trigger>
                        <Dialog.Backdrop />
                        <Dialog.Positioner>
                            <Dialog.Content>
                                <Dialog.Header>
                                    <Dialog.Title>포인트 지급/차감</Dialog.Title>
                                </Dialog.Header>
                                <Dialog.Body>
                                    <Text><Span fontWeight="medium">{name}</Span>({phone}, {email})에게<br></br>{formatNumber(String(amount).replace(/,/g, ''))}p {type === 'EARN' ? '지급' : '차감'} 하시겠습니까?</Text>
                                </Dialog.Body>
                                <Dialog.Footer>
                                    <Dialog.ActionTrigger asChild><Button variant="outline">취소</Button></Dialog.ActionTrigger>
                                    <Dialog.ActionTrigger asChild><Button colorPalette="danger" onClick={() => onSubmit()}>지급/차감 하기</Button></Dialog.ActionTrigger>
                                </Dialog.Footer>
                                <Dialog.CloseTrigger asChild>
                                    <CloseButton />
                                </Dialog.CloseTrigger>
                            </Dialog.Content>
                        </Dialog.Positioner>
                    </Dialog.Root>

                </Stack>
            </Box>

            <Tabs.Root defaultValue="history">
                <Tabs.List>
                    <Tabs.Trigger value="history">포인트 내역</Tabs.Trigger>
                    <Tabs.Trigger value="payout">출금 신청</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="history">
                    <Table.Root>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader textAlign="center">일시</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center">타입</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center">내용</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center">포인트</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {userPointHistoryList.map((userPointHistory) => (
                                <Table.Row key={userPointHistory.history_code}>
                                    <Table.Cell textAlign="center">{formatDate(userPointHistory.created_at)}</Table.Cell>
                                    <Table.Cell textAlign="center">
                                        {userPointHistory.type == 'EARN' ? '지급' : userPointHistory.type == 'PAYOUT' ? '출금' : userPointHistory.type === 'PAYOUT_CANCEL' ? '출금 반려로 인한 지급' : '출금'}
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">{userPointHistory.descript}</Table.Cell>
                                    <Table.Cell textAlign="center">
                                        <HStack justify="center">
                                            <Icon size="xs">
                                                {userPointHistory.type === 'EARN' ? (<LuPlus />) : (<LuMinus />)}
                                            </Icon>
                                            {formatNumber(userPointHistory.amount)}
                                        </HStack>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                            {userPointHistoryList.length === 0 && (
                                <Table.Row>
                                    <Table.Cell colSpan={4} textAlign="center">포인트 내역이 없습니다.</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table.Root>
                </Tabs.Content>
                <Tabs.Content value="payout">
                    <Table.Root>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader textAlign="center">신청일시</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center">은행</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center">계좌번호</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center">예금주</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center">출금 금액</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center">상태</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center">처리</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {userPointPayoutList.map((userPointPayout) => (
                                <Table.Row key={userPointPayout.payout_code}>
                                    <Table.Cell textAlign="center">{formatDate(userPointPayout.created_at)}</Table.Cell>
                                    <Table.Cell textAlign="center">{userPointPayout.bank}</Table.Cell>
                                    <Table.Cell textAlign="center">{userPointPayout.number}</Table.Cell>
                                    <Table.Cell textAlign="center">{userPointPayout.holder}</Table.Cell>
                                    <Table.Cell textAlign="center">{formatNumber(userPointPayout.amount)}</Table.Cell>
                                    <Table.Cell textAlign="center">
                                        {userPointPayout.status === 'REQUEST' ? '신청' : userPointPayout.status === 'COMPLETED' ? '완료' : '반려'}
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                        {userPointPayout.status === 'REQUEST' ? (<PointPayout userPointPayout={userPointPayout} />) : (
                                            `처리일 : ${formatDate(userPointPayout.processed_at)}`
                                        )}
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                            {userPointPayoutList.length === 0 && (
                                <Table.Row>
                                    <Table.Cell colSpan={7} textAlign="center">출금 신청 내역이 없습니다.</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table.Root>
                </Tabs.Content>
            </Tabs.Root>
        </Stack>
    )

}

export default Point;