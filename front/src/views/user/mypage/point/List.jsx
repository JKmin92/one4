import { Box, Button, Checkbox, CloseButton, Dialog, Field, Heading, HStack, Icon, IconButton, Input, InputGroup, Link, NativeSelect, NumberInput, RadioCard, Span, Stack, Table, Tabs, Text } from "@chakra-ui/react";
import { LuChevronRight, LuEllipsis, LuMinus, LuPlus, LuTrash2 } from "react-icons/lu";
import { formatDate, formatNumber, getBankList } from "../../../../utils/simpleUtils";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../utils/api";
import { toaster } from "../../../../components/ui/toaster";

function AccountDialog({ position = 'post', userAccountList = [], setUserAccountList, selectedAccountCode, setSelectedAccountCode }) {
    const [bank, setBank] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountHolder, setAccountHolder] = useState('');
    const [isBasic, setIsBasic] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectAccountCode, setSelectAccountCode] = useState(selectedAccountCode);

    useEffect(() => {
        if (userAccountList.length == 0) setIsBasic(true);
    }, [userAccountList]);

    const addUserAccount = async () => {
        try {
            if (bank === '') return toaster.create({ title: '은행을 선택해주세요.', type: 'error' });
            if (accountNumber === '') return toaster.create({ title: '계좌번호를 입력해주세요.', type: 'error' });
            if (accountHolder === '') return toaster.create({ title: '예금주를 입력해주세요.', type: 'error' });

            const user_account = { bank, number: accountNumber, holder: accountHolder, is_basic: isBasic };
            const result = await axiosInstance.post('/user/account', user_account);
            if (result.status === 200) {
                setUserAccountList([...userAccountList, result.data]);
                setOpen(false);
                toaster.create({ title: '계좌가 등록되었습니다.', type: 'success' });
            }
        } catch {
            toaster.create({ title: '계좌 등록에 오류가 발생했습니다.', type: 'error' });
        }
    }

    useEffect(() => {
        if (!open) {
            setBank('');
            setAccountNumber('');
            setAccountHolder('');
            setIsBasic(false);
        }
    }, [open]);

    const selectAccount = () => {
        setSelectedAccountCode(selectAccountCode);
        setOpen(false);
    }

    return (
        <Dialog.Root open={open} onOpenChange={e => setOpen(e.open)}>
            <Dialog.Trigger asChild>
                {position === 'post' ? (
                    <Button asChild variant="ghost" color="gray.500">
                        <Box border="2px dashed #ddd" p="10" rounded="md" alignItems="center" w="full">
                            <Icon size="xs"><LuPlus /></Icon>계좌추가
                        </Box>
                    </Button>
                ) : position === 'select' ? (
                    <Button w="full">계좌 추가/변경</Button>
                ) : null}
            </Dialog.Trigger>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>
                            {position === 'post' && '계좌 추가'}
                            {position === 'select' && '계좌 선택'}
                        </Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        {position === 'post' && (
                            <Stack gap="4">
                                <NativeSelect.Root >
                                    <NativeSelect.Field placeholder="은행을 선택해주세요." value={bank} onChange={(e) => setBank(e.currentTarget.value)}>
                                        {getBankList().map(b => (
                                            <option key={b.value} value={b.value}>{b.text}</option>
                                        ))}
                                    </NativeSelect.Field>
                                    <NativeSelect.Indicator />
                                </NativeSelect.Root>
                                <Input placeholder="- 없이 계좌번호를 입력해주세요." value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
                                <Input placeholder="예금주를 입력해주세요." value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)} />
                                <Checkbox.Root checked={isBasic} onCheckedChange={(e) => setIsBasic(!!e.checked)} disabled={userAccountList.length == 0 ? true : false}>
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                    <Checkbox.Label>기본 계좌로 설정</Checkbox.Label>
                                </Checkbox.Root>
                                <Button onClick={() => addUserAccount()}>등록하기</Button>
                            </Stack>
                        )}

                        {position === 'select' && (
                            <Stack>
                                <RadioCard.Root value={selectAccountCode} onValueChange={(e) => setSelectAccountCode(e.value)}>
                                    <RadioCard.Label>계좌 리스트</RadioCard.Label>
                                    <Stack>
                                        {userAccountList.map(userAccount => (
                                            <RadioCard.Item key={userAccount.account_code} value={userAccount.account_code}>
                                                <RadioCard.ItemHiddenInput />
                                                <RadioCard.ItemControl>
                                                    <RadioCard.ItemIndicator />
                                                    <RadioCard.ItemContent>
                                                        <RadioCard.ItemText w="full">
                                                            <HStack justifyContent="space-between" position="relative">
                                                                {userAccount.holder}
                                                                <DeleteAccountDialog setUserAccountList={setUserAccountList} selectUserAccount={userAccount} />
                                                            </HStack>
                                                        </RadioCard.ItemText>
                                                        <RadioCard.ItemDescription>{userAccount.bank} {userAccount.number}</RadioCard.ItemDescription>
                                                    </RadioCard.ItemContent>
                                                </RadioCard.ItemControl>
                                            </RadioCard.Item>
                                        ))}
                                    </Stack>
                                </RadioCard.Root>
                                <Button onClick={() => selectAccount()}>계좌 변경하기</Button>
                            </Stack>
                        )}
                    </Dialog.Body>
                    <Dialog.CloseTrigger asChild>
                        <CloseButton />
                    </Dialog.CloseTrigger>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root >
    )
}

function DeleteAccountDialog({ setUserAccountList, selectUserAccount }) {
    const [open, setOpen] = useState(false);

    const deleteUserAccount = async () => {
        try {
            await axiosInstance.delete(`/user/account/${selectUserAccount.account_code}`);
            setUserAccountList(prev => prev.filter(userAccount => userAccount.account_code !== selectUserAccount.account_code));
            setOpen(false);
            toaster.create({ title: '계좌가 삭제되었습니다.', type: 'success' });
        } catch {
            toaster.create({ title: '계좌 삭제에 실패했습니다.', type: 'error' });
        }
    }

    return (
        <Dialog.Root open={open} onOpenChange={e => setOpen(e.open)}>
            <Dialog.Trigger asChild>
                <IconButton size="xs" variant="ghost" color="red.500" position="absolute" top="-2" right="0"><LuTrash2 /></IconButton >
            </Dialog.Trigger>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>계좌 삭제</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        <Stack textAlign="center">
                            <Heading size="sm">[{selectUserAccount.bank}] {selectUserAccount.number} ({selectUserAccount.holder})</Heading>
                            <Text>위 계좌를 <Span color="red.500">삭제</Span>하시겠습니까?</Text>
                        </Stack>
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Dialog.Trigger asChild>
                            <Button variant="outline">아니요</Button>
                        </Dialog.Trigger>
                        <Button bg="red" onClick={deleteUserAccount}>삭제</Button>
                    </Dialog.Footer>
                    <Dialog.CloseTrigger asChild>
                        <CloseButton />
                    </Dialog.CloseTrigger>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}

function List() {

    const [userAccountList, setUserAccountList] = useState([]);
    const [payoutAmount, setPayoutAmount] = useState('');
    const [userPointHistoryList, setUserPointHistoryList] = useState([]);
    const [userPoint, setUserPoint] = useState();

    const [payoutAmountErrorMsg, setPayoutAmountErrorMsg] = useState('');
    const [isPayoutAmountError, setIsPayoutAmountError] = useState(false);

    const [userPointPayoutList, setUserPointPayoutList] = useState([]);
    const [selectedAccountCode, setSelectedAccountCode] = useState('');
    const [payoutCheckbox, setPayoutCheckbox] = useState(false);

    useEffect(() => {
        getAccountList();
        getUserPointHistory();
        getUserPoint();
        getUserPointPayoutList();
    }, []);

    const getAccountList = async () => {
        try {
            const result = await axiosInstance.get('/user/account');
            if (result.status === 200) {
                setSelectedAccountCode(result.data.find(account => account.is_basic).account_code);
                setUserAccountList(result.data);
            }
        } catch {
            toaster.create({ title: '계좌 목록을 불러오는데 오류가 발생했습니다.', type: 'error' });
        }
    }

    const getUserPointHistory = async () => {
        try {
            const result = await axiosInstance.get('/user/point/history');
            if (result.status === 200) setUserPointHistoryList(result.data);
        } catch {
            toaster.create({ title: '포인트 내역을 불러오는데 오류가 발생했습니다.', type: 'error' });
        }
    }

    const getUserPoint = async () => {
        try {
            const result = await axiosInstance.get('/user/point');
            if (result.status === 200) setUserPoint(result.data);
        } catch {
            toaster.create({ title: '포인트를 불러오는데 오류가 발생했습니다.', type: 'error' });
        }
    }

    const getUserPointPayoutList = async () => {
        try {
            const result = await axiosInstance.get('/user/point/payout/list');
            if (result.status === 200) setUserPointPayoutList(result.data);
        } catch {
            toaster.create({ title: '출금 신청 내역을 불러오는데 오류가 발생했습니다.', type: 'error' });
        }
    }

    useEffect(() => {
        if (!payoutAmount) {
            setIsPayoutAmountError(false);
            setPayoutAmountErrorMsg('');
        } else if (payoutAmount > userPoint?.current_point) {
            setIsPayoutAmountError(true);
            setPayoutAmountErrorMsg('보유 포인트보다 많은 금액을 출금할 수 없습니다.');
        } else if (payoutAmount < 10000) {
            setIsPayoutAmountError(true);
            setPayoutAmountErrorMsg('출금 신청 최소 금액은 10,000p입니다.');
        } else {
            setIsPayoutAmountError(false);
            setPayoutAmountErrorMsg('');
        }
    }, [payoutAmount, userPoint]);

    const payoutSubmit = async () => {
        try {
            const data = { account_code: selectedAccountCode, amount: payoutAmount };
            const result = await axiosInstance.post('/user/point/payout', data);
            if (result.status === 200) {
                toaster.create({ title: '출금 신청이 완료되었습니다.', type: 'success' });
                setPayoutAmount('');
                setPayoutCheckbox(false);
                getUserPointPayoutList();
                getUserPointHistory();
                getUserPoint();
            }
        } catch {
            toaster.create({ title: '출금 신청에 에러가 발생했습니다.', type: 'error' });
        }
    }

    return (
        <Stack w="full" rounded="md" border="1px solid #eee" p="20px" gap="6" textAlign="left">

            <Box display="flex" justifyContent="space-between" p="5" bg="blue.solid" w="full" color="#fff" rounded="md">
                <HStack>
                    <Text fontSize="xs">보유 포인트</Text>
                    <Text fontSize="lg">{formatNumber(userPoint?.current_point ?? 0)}</Text>
                    <Text fontSize="xs">p</Text>
                </HStack>
            </Box>

            <Tabs.Root defaultValue="history">
                <Tabs.List>
                    <Tabs.Trigger value="history">포인트 내역</Tabs.Trigger>
                    <Tabs.Trigger value="payout">출금 신청</Tabs.Trigger>
                    <Tabs.Trigger value="payoutList">출금 신청 내역</Tabs.Trigger>
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
                                        {userPointHistory.type == 'EARN' ? '지급' : userPointHistory.type == 'PAYOUT' ? '출금' : userPointHistory.type == 'PAYOUT_CANCEL' ? '출금 반려' : '출금'}
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
                    <Stack m="auto" w="sm" gap="4">
                        {userAccountList.length === 0 ? (
                            <AccountDialog position="post" userAccountList={userAccountList} setUserAccountList={setUserAccountList} selectedAccountCode={selectedAccountCode} setSelectedAccountCode={setSelectedAccountCode} />
                        ) : (
                            <RadioCard.Root value={selectedAccountCode} onValueChange={(e) => setSelectedAccountCode(e.value)}>
                                <AccountDialog position="select" userAccountList={userAccountList} setUserAccountList={setUserAccountList} selectedAccountCode={selectedAccountCode} setSelectedAccountCode={setSelectedAccountCode} />
                                <Stack>
                                    {userAccountList.filter(userAccount => userAccount.account_code === selectedAccountCode).map(userAccount => (
                                        <RadioCard.Item key={userAccount.account_code} value={userAccount.account_code}>
                                            <RadioCard.ItemHiddenInput />
                                            <RadioCard.ItemControl>
                                                <RadioCard.ItemIndicator />
                                                <RadioCard.ItemContent>
                                                    <RadioCard.ItemText w="full">
                                                        <HStack justifyContent="space-between" position="relative">
                                                            {userAccount.holder}
                                                            <DeleteAccountDialog setUserAccountList={setUserAccountList} selectUserAccount={userAccount} />
                                                        </HStack>
                                                    </RadioCard.ItemText>
                                                    <RadioCard.ItemDescription>{userAccount.bank} {userAccount.number}</RadioCard.ItemDescription>
                                                </RadioCard.ItemContent>
                                            </RadioCard.ItemControl>
                                        </RadioCard.Item>
                                    ))}
                                </Stack>
                            </RadioCard.Root>
                        )}

                        <Field.Root w="full" invalid={isPayoutAmountError}>
                            <InputGroup endElement="P">
                                <NumberInput.Root w="full" value={payoutAmount} onValueChange={e => { setPayoutAmount((e.value || '').replace(/,/g, '')) }} formatOptions={{ style: 'decimal', useGrouping: true }}>
                                    <NumberInput.Input />
                                </NumberInput.Root>
                            </InputGroup>
                            <Field.ErrorText>{payoutAmountErrorMsg}</Field.ErrorText>
                        </Field.Root>
                        <Checkbox.Root checked={payoutCheckbox} onCheckedChange={e => setPayoutCheckbox(!!e.checked)}>
                            <Checkbox.HiddenInput />
                            <Checkbox.Control />
                            <Checkbox.Label fontSize="sm">출금 계좌 정보를 확인했으며, 위 정보로 출금 신청합니다. </Checkbox.Label>
                        </Checkbox.Root>
                        <Stack fontSize="xs" gap="0">
                            <Text>• 출금 신청 최소 금액은 10,000p입니다.</Text>
                            <Text>• 월 1회 신청 가능하며, 매월 마지막 영업일에 지급됩니다.</Text>
                            <Text>• 잘못된 계좌로 출금 신청 시 발생하는 책임은 본인에게 있습니다.</Text>
                        </Stack>
                        <Dialog.Root>
                            <Dialog.Trigger asChild>
                                <Button disabled={isPayoutAmountError || !payoutCheckbox}>출금 신청</Button>
                            </Dialog.Trigger>
                            <Dialog.Backdrop />
                            <Dialog.Positioner>
                                <Dialog.Content>
                                    <Dialog.Header>
                                        <Dialog.Title>출금 신청</Dialog.Title>
                                    </Dialog.Header>
                                    <Dialog.Body>
                                        <Stack>
                                            <Text>[{userAccountList.find(a => a.account_code === selectedAccountCode)?.bank}] {userAccountList.find(a => a.account_code === selectedAccountCode)?.number} ({userAccountList.find(a => a.account_code === selectedAccountCode)?.holder})으로</Text>
                                            <Text>{formatNumber(payoutAmount || 0)}p 출금 하시겠습니까?</Text>
                                        </Stack>
                                    </Dialog.Body>
                                    <Dialog.Footer>
                                        <Dialog.ActionTrigger asChild>
                                            <Button variant="outline">취소</Button>
                                        </Dialog.ActionTrigger>
                                        <Dialog.ActionTrigger asChild>
                                            <Button onClick={payoutSubmit}>출금 신청 하기</Button>
                                        </Dialog.ActionTrigger>
                                    </Dialog.Footer>
                                    <Dialog.CloseTrigger asChild>
                                        <CloseButton />
                                    </Dialog.CloseTrigger>
                                </Dialog.Content>
                            </Dialog.Positioner>
                        </Dialog.Root>

                    </Stack>
                </Tabs.Content>
                <Tabs.Content value="payoutList">
                    <Table.Root>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader textAlign="center">신청 일시</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center">상태</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center">지급 일시</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center">계좌</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center">금액</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {userPointPayoutList.map((userPointPayout) => (
                                <Table.Row key={userPointPayout.payout_code}>
                                    <Table.Cell textAlign="center">{formatDate(userPointPayout.created_at)}</Table.Cell>
                                    <Table.Cell textAlign="center">
                                        {userPointPayout.status === 'REQUEST' ? '출금 신청' : userPointPayout.status === 'COMPLETED' ? '지급 완료' : '지급 반려'}
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">{userPointPayout.processed_at ? formatDate(userPointPayout.processed_at) : '-'}</Table.Cell>
                                    <Table.Cell textAlign="center">[{userPointPayout.bank}] {userPointPayout.number} ({userPointPayout.holder})</Table.Cell>
                                    <Table.Cell textAlign="center">{formatNumber(userPointPayout.amount)}</Table.Cell>
                                </Table.Row>
                            ))}
                            {userPointPayoutList.length === 0 && (
                                <Table.Row>
                                    <Table.Cell colSpan={5} textAlign="center">포인트 출금 신청 내역이 없습니다.</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table.Root>
                </Tabs.Content>
            </Tabs.Root>
        </Stack>
    )
}

export default List;