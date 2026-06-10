import { Badge, Button, Checkbox, CloseButton, Dialog, Heading, HStack, IconButton, Input, NativeSelect, Stack, Table, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { toaster } from "../../../../components/ui/toaster";
import { LuChevronDown, LuChevronsDown, LuChevronsUp, LuChevronUp, LuPlus } from "react-icons/lu";
import axiosInstance from "../../../../utils/api";

function AddAccount({ account, setChangeAccount }) {

    const [open, setOpen] = useState(false);
    const [bank, setBank] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountHolder, setAccountHolder] = useState('');
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (open && account) {
            setBank(account.bank || '');
            setAccountNumber(account.account_number || '');
            setAccountHolder(account.account_holder || '');
            setIsActive(!!account.is_active);
        } else if (!open) {
            setBank('');
            setAccountNumber('');
            setAccountHolder('');
            setIsActive(false);
        }
    }, [open, account]);

    const saveAccount = async () => {
        try {
            if (!bank || !accountNumber || !accountHolder) {
                toaster.create({ title: '모든 정보를 입력해주세요.', type: 'error' });
                return;
            }

            const data = {
                account_code: account ? account.account_code : null,
                bank: bank,
                account_number: accountNumber,
                account_holder: accountHolder,
                is_active: isActive
            };

            if (account) {
                await axiosInstance.put('/admin/shop/setting/account', data);
            } else {
                await axiosInstance.post('/admin/shop/setting/account', data);
            }

            toaster.create({ title: '계좌가 저장되었습니다.', type: 'success' });
            setOpen(false);
            setChangeAccount(true);
        } catch (error) {
            console.error('Error saving account:', error);
            toaster.create({ title: '오류가 발생했습니다.', type: 'error' });
        }
    }

    return (
        <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
            <Dialog.Trigger asChild><Button colorPalette="blue" size={!account ? "sm" : "xs"}>{!account && (<LuPlus />)}{!account ? '계좌 추가' : '수정'}</Button></Dialog.Trigger>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>{!account ? '계좌 추가' : '계좌 수정'}</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        <Table.Root>
                            <Table.Body>
                                <Table.Row>
                                    <Table.ColumnHeader>은행</Table.ColumnHeader>
                                    <Table.Cell>
                                        <NativeSelect.Root>
                                            <NativeSelect.Field value={bank} onChange={(e) => setBank(e.target.value)} placeholder="은행을 선택해주세요.">
                                                <option value="국민은행">국민은행</option>
                                                <option value="신한은행">신한은행</option>
                                                <option value="우리은행">우리은행</option>
                                                <option value="KEB하나은행">KEB하나은행</option>
                                                <option value="기업은행">기업은행</option>
                                                <option value="농협은행">농협은행</option>
                                                <option value="부산은행">부산은행</option>
                                                <option value="대구은행">대구은행</option>
                                                <option value="경남은행">경남은행</option>
                                                <option value="전북은행">전북은행</option>
                                                <option value="광주은행">광주은행</option>
                                                <option value="제주은행">제주은행</option>
                                                <option value="카카오뱅크">카카오뱅크</option>
                                                <option value="케이뱅크">케이뱅크</option>
                                                <option value="토스뱅크">토스뱅크</option>
                                                <option value="산업은행">산업은행</option>
                                                <option value="수협은행">수협은행</option>
                                            </NativeSelect.Field>
                                            <NativeSelect.Indicator />
                                        </NativeSelect.Root>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.ColumnHeader>계좌번호</Table.ColumnHeader>
                                    <Table.Cell><Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="계좌번호를 입력해주세요" /></Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.ColumnHeader>예금주</Table.ColumnHeader>
                                    <Table.Cell><Input value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)} placeholder="예금주를 입력해주세요" /></Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.ColumnHeader>활성화</Table.ColumnHeader>
                                    <Table.Cell>
                                        <Checkbox.Root checked={isActive} onCheckedChange={(e) => setIsActive(!!e.checked)}>
                                            <Checkbox.HiddenInput />
                                            <Checkbox.Control />
                                            <Checkbox.Label>활성화</Checkbox.Label>
                                        </Checkbox.Root>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table.Root>
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Button variant="outline" onClick={() => setOpen(false)}>취소</Button>
                        <Button onClick={saveAccount}>저장</Button>
                    </Dialog.Footer>
                    <Dialog.CloseTrigger asChild>
                        <CloseButton />
                    </Dialog.CloseTrigger>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}

function DeleteAccount({ account, setChangeAccount }) {

    const [open, setOpen] = useState(false);

    const deleteAccount = async (accountCode) => {
        try {
            await axiosInstance.delete(`/admin/shop/setting/account/${accountCode}`);
            toaster.create({ title: '계좌가 삭제되었습니다.', type: 'success' });
            setOpen(false);
            setChangeAccount(true);
        } catch (e) {
            console.error(e);
            toaster.create({ title: '오류가 발생했습니다.', type: 'error' });
        }
    }

    return (
        <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
            <Dialog.Trigger asChild>
                <Button size="xs" bg="red">삭제</Button>
            </Dialog.Trigger>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>계좌 삭제</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        <Stack>
                            <HStack>
                                <Text>은행</Text>
                                <Text>{account.bank}</Text>
                            </HStack>
                            <HStack>
                                <Text>계좌번호</Text>
                                <Text>{account.account_number}</Text>
                            </HStack>
                            <HStack>
                                <Text>예금주</Text>
                                <Text>{account.account_holder}</Text>
                            </HStack>
                            <Text textAlign="left">정말 삭제하시겠습니까?</Text>
                        </Stack>

                    </Dialog.Body>
                    <Dialog.Footer>
                        <Button variant="outline" onClick={() => setOpen(false)}>취소</Button>
                        <Button onClick={() => deleteAccount(account.account_code)} bg="red">삭제</Button>
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

    const [accountList, setAccountList] = useState([]);
    const [changeAccount, setChangeAccount] = useState(false);
    const [selectedItemList, setSelectedItemList] = useState([]);
    const [allChecked, setAllChecked] = useState(false);

    useEffect(() => {
        getAccountList();
    }, []);

    const getAccountList = async () => {
        try {
            const res = await axiosInstance.get('/admin/shop/setting/account');
            setAccountList(res.data);
            setSelectedItemList([]);
        } catch (e) {
            console.error(e);
            toaster.create({ title: '오류가 발생했습니다.', type: 'error' });
        }
    }

    useEffect(() => {
        if (changeAccount) {
            getAccountList();
            setChangeAccount(false);
        }
    }, [changeAccount])

    const handleCheckboxChange = (e, accountCode) => {
        if (e.checked) {
            setSelectedItemList(prev => [...prev, accountCode]);
        } else {
            setSelectedItemList(prev => prev.filter(code => code !== accountCode));
        }
    }

    const handleAllCheckedChange = (e) => {
        if (e.checked) {
            setSelectedItemList(accountList.map(account => account.account_code));
        } else {
            setSelectedItemList([]);
        }
        setAllChecked(!!e.checked);
    }

    useEffect(() => {
        setAllChecked(accountList.length > 0 && accountList.every(account => selectedItemList.includes(account.account_code)));
    }, [selectedItemList, accountList]);

    const handleMove = (direction) => {
        if (selectedItemList.length === 0) {
            toaster.create({ title: '선택된 계좌가 없습니다.', type: 'warning' });
            return;
        }

        let newAccountList = [...accountList];

        if (direction === 'top') {
            const selected = newAccountList.filter(item => selectedItemList.includes(item.account_code));
            const unselected = newAccountList.filter(item => !selectedItemList.includes(item.account_code));
            newAccountList = [...selected, ...unselected];
        } else if (direction === 'bottom') {
            const selected = newAccountList.filter(item => selectedItemList.includes(item.account_code));
            const unselected = newAccountList.filter(item => !selectedItemList.includes(item.account_code));
            newAccountList = [...unselected, ...selected];
        } else if (direction === 'up') {
            for (let i = 0; i < newAccountList.length; i++) {
                if (selectedItemList.includes(newAccountList[i].account_code)) {
                    if (i > 0 && !selectedItemList.includes(newAccountList[i - 1].account_code)) {
                        const temp = newAccountList[i];
                        newAccountList[i] = newAccountList[i - 1];
                        newAccountList[i - 1] = temp;
                    }
                }
            }
        } else if (direction === 'down') {
            for (let i = newAccountList.length - 1; i >= 0; i--) {
                if (selectedItemList.includes(newAccountList[i].account_code)) {
                    if (i < newAccountList.length - 1 && !selectedItemList.includes(newAccountList[i + 1].account_code)) {
                        const temp = newAccountList[i];
                        newAccountList[i] = newAccountList[i + 1];
                        newAccountList[i + 1] = temp;
                    }
                }
            }
        }

        const updatedList = newAccountList.map((item, index) => ({
            ...item,
            order: index + 1
        }));

        setAccountList(updatedList);
    }

    const saveAccountOrder = async () => {
        try {
            const orders = accountList.map(account => ({
                account_code: account.account_code,
                order: account.order
            }));
            await axiosInstance.put('/admin/shop/setting/account/order', orders);
            toaster.create({ title: '순서가 저장되었습니다.', type: 'success' });
            getAccountList();
        } catch (e) {
            console.error(e);
            toaster.create({ title: '순서 저장 중 오류가 발생했습니다.', type: 'error' });
        }
    }

    return (
        <Stack p="30px" px="layoutX" gap="6">
            <HStack justifyContent="space-between">
                <Heading>계좌 관리</Heading>
                <AddAccount account={null} setChangeAccount={setChangeAccount} />
            </HStack>

            <Stack gap="4">
                <HStack>
                    <HStack>
                        <IconButton size="xs" variant="outline" onClick={() => handleMove('top')}>
                            <LuChevronsUp />
                        </IconButton>
                        <IconButton size="xs" variant="outline" onClick={() => handleMove('up')}>
                            <LuChevronUp />
                        </IconButton>
                        <IconButton size="xs" variant="outline" onClick={() => handleMove('down')}>
                            <LuChevronDown />
                        </IconButton>
                        <IconButton size="xs" variant="outline" onClick={() => handleMove('bottom')}>
                            <LuChevronsDown />
                        </IconButton>
                    </HStack>
                    <Button size="sm" onClick={saveAccountOrder}>순서 저장</Button>
                </HStack>
                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>
                                <Checkbox.Root checked={allChecked} onCheckedChange={(e) => handleAllCheckedChange(e)}>
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                </Checkbox.Root>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center">순서</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center">은행</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center">계좌번호</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center">예금주</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center">활성화</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center"></Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {accountList.length == 0 && (
                            <Table.Row>
                                <Table.Cell colSpan={7} textAlign="center">등록된 계좌가 없습니다</Table.Cell>
                            </Table.Row>
                        )}

                        {accountList.map((account) => (
                            <Table.Row key={account.account_code}>
                                <Table.Cell>
                                    <Checkbox.Root checked={selectedItemList.includes(account.account_code)} onCheckedChange={(e) => handleCheckboxChange(e, account.account_code)}>
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control />
                                    </Checkbox.Root>
                                </Table.Cell>
                                <Table.Cell textAlign="center">{account.order}</Table.Cell>
                                <Table.Cell textAlign="center">{account.bank}</Table.Cell>
                                <Table.Cell textAlign="center">{account.account_number}</Table.Cell>
                                <Table.Cell textAlign="center">{account.account_holder}</Table.Cell>
                                <Table.Cell textAlign="center">
                                    {account.is_active ? (
                                        <Badge colorPalette="green">활성화</Badge>
                                    ) : (
                                        <Badge colorPalette="red">비활성화</Badge>
                                    )}
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <HStack justifyContent="center">
                                        <AddAccount account={account} setChangeAccount={setChangeAccount} />
                                        <DeleteAccount setChangeAccount={setChangeAccount} account={account} />
                                    </HStack>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Stack>
        </Stack>
    )

}

export default Account;