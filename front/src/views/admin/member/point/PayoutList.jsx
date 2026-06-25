import { Button, Checkbox, CloseButton, Dialog, Group, Heading, HStack, IconButton, Input, Stack, Table, Text, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../utils/api";
import { toaster } from "../../../../components/ui/toaster";
import { formatDate, formatNumber } from "../../../../utils/simpleUtils";
import { LuArrowLeft } from "react-icons/lu";

function PointPayout({ payout }) {
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
            const data = { status: payoutStatus, payout_code: payout.payout_code, reject_description: reason };
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
                                <Text>은행 : {payout.bank}</Text>
                                <Text>계좌번호 : {payout.number}</Text>
                                <Text>예금주 : {payout.holder}</Text>
                                <Text>출금 금액 : {formatNumber(payout.amount)}원</Text>
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

function PayoutList() {

    const [selected, setSelected] = useState([]);
    const [payoutList, setPayoutList] = useState([]);

    useEffect(() => {
        getPayoutList();
    }, []);

    const getPayoutList = async () => {
        try {
            const res = await axiosInstance.get('/admin/member/user/point/payout/list');
            setPayoutList(res.data);
        } catch (e) {
            console.log(e);
            toaster.create({ title: '오류가 발생했습니다.', type: 'error' });
        }
    }

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelected(payoutList.map(p => p.payout_code));
        } else {
            setSelected([]);
        }
    }

    const handleSelectOne = (payout_code, checked) => {
        if (checked) {
            setSelected(prev => [...prev, payout_code]);
        } else {
            setSelected(prev => prev.filter(code => code !== payout_code));
        }
    }

    const allChecked = payoutList.length > 0 && selected.length === payoutList.length;

    return (
        <Stack p="30px" px="layoutX" gap="6">
            <Heading>출금 신청 목록</Heading>

            <Group attached w="full">
                <Input placeholder="검색어" />
                <Button>검색</Button>
            </Group>

            <Stack>
                <Group>
                    <Button size="xs">선택 승인</Button>
                    <Button size="xs" bg="red">선택 거절</Button>
                </Group>
                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader textAlign="center">
                                <Checkbox.Root checked={allChecked} onCheckedChange={(e) => handleSelectAll(!!e.checked)}>
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                </Checkbox.Root>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center">신청자</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center">출금 금액</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center">은행</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center">계좌번호</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center">예금주</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center">신청 일시</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center">상태</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center">처리</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {payoutList.map((payout) => (
                            <Table.Row key={payout.payout_code}>
                                <Table.Cell textAlign="center">
                                    <Checkbox.Root checked={selected.includes(payout.payout_code)} onCheckedChange={(e) => handleSelectOne(payout.payout_code, !!e.checked)}>
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control />
                                    </Checkbox.Root>
                                </Table.Cell>
                                <Table.Cell textAlign="center">{payout.name}</Table.Cell>
                                <Table.Cell textAlign="center">{formatNumber(payout.amount)}</Table.Cell>
                                <Table.Cell textAlign="center">{payout.bank}</Table.Cell>
                                <Table.Cell textAlign="center">{payout.number}</Table.Cell>
                                <Table.Cell textAlign="center">{payout.holder}</Table.Cell>
                                <Table.Cell textAlign="center">{formatDate(payout.created_at)}</Table.Cell>
                                <Table.Cell textAlign="center">
                                    {payout.status == 'REQUEST' ? '신청' : payout.status == 'COMPLETED' ? '완료' : '거절'}
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    {payout.status === 'REQUEST' ? (<PointPayout payout={payout} />) : (
                                        `처리일 : ${formatDate(payout.processed_at)}`
                                    )}
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Stack>
        </Stack>
    )
}

export default PayoutList;