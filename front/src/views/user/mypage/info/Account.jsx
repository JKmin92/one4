import { Button, Checkbox, CloseButton, Dialog, EmptyState, Group, Heading, HStack, IconButton, Input, NativeSelect, RadioCard, Span, Stack, Text, VStack } from "@chakra-ui/react";
import { LuChevronRight, LuTrash2 } from "react-icons/lu";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../utils/api";
import { toaster } from "../../../../components/ui/toaster";
import { PiSmileySad } from "react-icons/pi";
import { getBankList } from "../../../../utils/simpleUtils";

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

function Account() {

    const [open, setOpen] = useState(false);
    const [userAccountList, setUserAccountList] = useState([]);
    const [mode, setMode] = useState('list');

    const [bank, setBank] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountHolder, setAccountHolder] = useState('');
    const [isBasic, setIsBasic] = useState(false);

    const [selectAccountCode, setSelectAccountCode] = useState('');

    useEffect(() => {
        getUserAccountList();
    }, []);

    const getUserAccountList = async () => {
        try {
            const response = await axiosInstance.get('/user/account');
            setUserAccountList(response.data);
        } catch {
            toaster.create({ title: '환불 계좌 목록을 불러오는데 실패했습니다.', type: 'error' });
        }
    }

    const addUserAccount = async () => {
        try {
            if (bank === '') return toaster.create({ title: '은행을 선택해주세요.', type: 'error' });
            if (accountNumber === '') return toaster.create({ title: '계좌번호를 입력해주세요.', type: 'error' });
            if (accountHolder === '') return toaster.create({ title: '예금주를 입력해주세요.', type: 'error' });

            const user_account = { bank, number: accountNumber, holder: accountHolder, is_basic: isBasic };
            const result = await axiosInstance.post('/user/account', user_account);
            if (result.status === 200) {
                setUserAccountList([...userAccountList, result.data]);
                setMode('list');
                toaster.create({ title: '계좌가 등록되었습니다.', type: 'success' });
            }
        } catch {
            toaster.create({ title: '계좌 등록에 오류가 발생했습니다.', type: 'error' });
        }
    }

    useEffect(() => {
        if (!open) {
            setMode('list');
            setBank('');
            setAccountNumber('');
            setAccountHolder('');
            setIsBasic(false);
        }
    }, [open]);

    const updateUserAccountBasic = async () => {
        try {
            const result = await axiosInstance.put(`/user/account/${selectAccountCode}/basic`);
            if (result.status === 200) {
                setUserAccountList(prev => prev.map(userAccount => userAccount.account_code === selectAccountCode ? { ...userAccount, is_basic: true } : { ...userAccount, is_basic: false }));
                toaster.create({ title: '기본 계좌가 변경되었습니다.', type: 'success' });
            }
        } catch {
            toaster.create({ title: '기본 계좌 변경에 오류가 발생했습니다.', type: 'error' });
        }
    }

    return (
        <Dialog.Root open={open} onOpenChange={e => setOpen(e.open)}>
            <Dialog.Trigger asChild>
                <Button variant="ghost" justifyContent="space-between">환불 계좌 관리<LuChevronRight /></Button>
            </Dialog.Trigger>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>환불 계좌 관리</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        {mode === 'add' ? (
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
                        )
                            : userAccountList.length == 0 ?
                                <EmptyState.Root>
                                    <EmptyState.Content>
                                        <EmptyState.Indicator>
                                            <PiSmileySad />
                                        </EmptyState.Indicator>
                                        <Stack textAlign="center">
                                            <EmptyState.Title>등록된 계좌가 없습니다.</EmptyState.Title>
                                            <EmptyState.Description>환불받을 계좌를 등록해주세요.</EmptyState.Description>
                                        </Stack>
                                        <Button onClick={() => setMode('add')}>계좌 추가</Button>
                                    </EmptyState.Content>
                                </EmptyState.Root>
                                : (
                                    <Stack gap="4">
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
                                        <Group grow>
                                            <Button onClick={() => setMode('add')} variant="outline">계좌 추가</Button>
                                            <Button onClick={() => updateUserAccountBasic()} disabled={selectAccountCode === ''}>기본 계좌로 설정</Button>
                                        </Group>
                                    </Stack>
                                )}
                    </Dialog.Body>
                    <Dialog.CloseTrigger asChild>
                        <CloseButton />
                    </Dialog.CloseTrigger>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )

}

export default Account;