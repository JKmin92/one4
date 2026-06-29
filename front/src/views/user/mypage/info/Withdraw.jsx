import { Box, Button, Checkbox, CloseButton, Dialog, HStack, Span, Stack, Text } from "@chakra-ui/react";
import { LuChevronRight } from "react-icons/lu";
import { PasswordInput } from "../../../../components/ui/password-input";
import { useEffect, useState } from "react";
import { formatNumber } from "../../../../utils/simpleUtils";
import { toaster } from "../../../../components/ui/toaster";
import axiosInstance from "../../../../utils/api";
import { useAuth } from "../../../../utils/useAuth";
import { useNavigate } from "react-router-dom";

function Withdraw() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState('password');

    const [userPoint, setUserPoint] = useState();

    const [isAgree, setIsAgree] = useState(false);
    const [password, setPassword] = useState('');
    const [checkPassword, setCheckPassword] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(true);

    useEffect(() => {
        if (checkPassword.length > 0 && isAgree) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [checkPassword, isAgree]);

    useEffect(() => {
        if (!open) {
            setMode('password');
            setPassword('');
            setCheckPassword('');
            setIsAgree(false);
            setButtonDisabled(true);
        }
    }, [open]);

    const usePasswordCheck = async () => {
        try {
            const res = await axiosInstance.post(`/user/password/check`, { password: password });
            if (res.data) {
                setMode('withdraw');
            } else {
                toaster.create({ title: '비밀번호가 일치하지 않습니다.', type: 'error' });
            }
        } catch (e) {
            console.error(e);
            toaster.create({ title: '비밀번호 확인에 오류가 발생했습니다.', type: 'error' });
        }
    }

    const userWithdraw = async () => {
        try {
            const res = await axiosInstance.delete(`/user`, { data: { password: checkPassword } });
            if (res.data) {
                if (res.data.result == false) {
                    toaster.create({ title: '비밀번호가 틀렸습니다.', type: 'error' });
                } else {
                    toaster.create({ title: '회원탈퇴가 완료되었습니다.', type: 'success' });
                    setOpen(false);
                    await logout();
                    navigate('/');
                }
            }
        } catch (e) {
            console.error(e);
            toaster.create({ title: '회원탈퇴에 오류가 발생했습니다.', type: 'error' });
        }
    }

    return (
        <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
            <Dialog.Trigger asChild>
                <Button variant="ghost" justifyContent="space-between">회원탈퇴<LuChevronRight /></Button>
            </Dialog.Trigger>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>회원 탈퇴</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        {mode === 'password' ? (
                            <Stack>
                                <Text>회원 탈퇴를 하시려면 비밀번호를 입력해주세요</Text>
                                <PasswordInput placeholder="비밀번호를 입력해주세요" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') usePasswordCheck(); }} />
                                <Button onClick={usePasswordCheck}>회원 탈퇴 진행하기</Button>
                            </Stack>
                        ) : (
                            <Stack gap="4">
                                <Box display="flex" justifyContent="space-between" p="5" bg="blue.solid" w="full" color="#fff" rounded="md">
                                    <HStack>
                                        <Text fontSize="xs">보유 포인트</Text>
                                        <Text fontSize="lg">{formatNumber(userPoint?.current_point ?? 0)}</Text>
                                        <Text fontSize="xs">p</Text>
                                    </HStack>
                                </Box>
                                <Text>회원탈퇴 시 <Span fontWeight="bold">{formatNumber(userPoint?.current_point ?? 0)}p</Span>는 삭제되며 <Span color="red">복구가 불가</Span>합니다.</Text>
                                <Checkbox.Root checked={isAgree} onCheckedChange={(e) => setIsAgree(!!e.checked)}>
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                    <Checkbox.Label>위 내용을 확인하였으며, 회원탈퇴를 진행할 것에 동의합니다.</Checkbox.Label>
                                </Checkbox.Root>
                                <PasswordInput placeholder="비밀번호를 입력해주세요" value={checkPassword} onChange={(e) => setCheckPassword(e.target.value)} />
                                <Button variant="solid" onClick={userWithdraw} disabled={buttonDisabled} bg="red.500">회원 탈퇴하기</Button>
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

export default Withdraw;