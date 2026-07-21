import { Button, Field, Input, Stack, Text, Box, Heading } from "@chakra-ui/react";
import { PasswordInput } from "../../components/ui/password-input";
import { useState } from "react";
import axiosInstance from "../../utils/api";
import { toaster } from "../../components/ui/toaster";
import { useNavigate } from "react-router-dom";

export default function FindAccount() {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [account, setAccount] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
    const navigate = useNavigate();

    const handlePhoneChange = (e) => {
        let val = e.target.value.replace(/[^0-9]/g, '');
        if (val.length > 3 && val.length <= 7) {
            val = val.slice(0, 3) + '-' + val.slice(3);
        } else if (val.length > 7) {
            val = val.slice(0, 3) + '-' + val.slice(3, 7) + '-' + val.slice(7, 11);
        }
        setPhone(val);
    };

    const handleFindAccount = async () => {
        if (!name || phone.length < 13) {
            toaster.create({ title: '이름과 핸드폰 번호(11자리)를 정확히 입력해주세요.', type: 'warning' });
            return;
        }
        try {
            const res = await axiosInstance.post('/user/find-account', { name, phone });
            setAccount(res.data);
            setStep(2);
        } catch {
            toaster.create({ title: '계정을 찾을 수 없습니다.', type: 'error' });
        }
    };

    const handleResetPassword = async () => {
        if (!newPassword || newPassword !== newPasswordConfirm) {
            toaster.create({ title: '비밀번호가 일치하지 않습니다.', type: 'warning' });
            return;
        }
        try {
            await axiosInstance.put('/user/reset-password', {
                user_code: account.user_code,
                name: name,
                phone: phone,
                newPassword: newPassword
            });
            toaster.create({ title: '비밀번호가 성공적으로 변경되었습니다.', type: 'success' });
            navigate('/login');
        } catch {
            toaster.create({ title: '비밀번호 변경에 실패했습니다.', type: 'error' });
        }
    };

    return (
        <Stack p={{ base: '100px 0', md: "200px 0" }} px={{ base: '15px', md: 'layoutX' }} width={{ base: 'full', md: "lg" }} margin="auto">
            <Heading textAlign="center">계정 찾기</Heading>
            <Box>
                {step === 1 && (
                    <Stack gap="6">
                        <Text fontSize="sm" color="gray.600" textAlign="center">
                            가입 시 등록한 이름과 핸드폰 번호를 입력해 주세요.
                        </Text>
                        <Field.Root>
                            <Text fontSize="sm" fontWeight="bold" mb="1">이름</Text>
                            <Input placeholder="홍길동" value={name} onChange={(e) => setName(e.target.value)} />
                        </Field.Root>
                        <Field.Root>
                            <Text fontSize="sm" fontWeight="bold" mb="1">핸드폰 번호</Text>
                            <Input placeholder="010-1234-5678" maxLength={13} value={phone} onChange={handlePhoneChange} />
                        </Field.Root>
                        <Button width="full" onClick={handleFindAccount} mt={4}>계정 찾기</Button>
                    </Stack>
                )}
                {step === 2 && account && (
                    <Stack gap="6">
                        <Box p="6" bg="gray.50" borderRadius="md" textAlign="center" borderWidth="1px">
                            <Text fontSize="sm" color="gray.600">고객님의 아이디(이메일)는</Text>
                            <Text fontSize="xl" fontWeight="bold" mt="4" mb="4" color="blue.600">{account.email}</Text>
                            <Text fontSize="sm" color="gray.600">입니다.</Text>
                        </Box>
                        <Stack gap="3">
                            <Button width="full" onClick={() => navigate('/login')}>로그인하러 가기</Button>
                            <Button width="full" variant="outline" onClick={() => setStep(3)}>비밀번호 재설정</Button>
                        </Stack>
                    </Stack>
                )}
                {step === 3 && (
                    <Stack gap="6">
                        <Text fontSize="sm" color="gray.600" textAlign="center">
                            새로운 비밀번호를 입력해 주세요.
                        </Text>
                        <Field.Root>
                            <Text fontSize="sm" fontWeight="bold" mb="1">새 비밀번호</Text>
                            <PasswordInput placeholder="새 비밀번호 입력" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </Field.Root>
                        <Field.Root>
                            <Text fontSize="sm" fontWeight="bold" mb="1">새 비밀번호 확인</Text>
                            <PasswordInput placeholder="새 비밀번호 확인" value={newPasswordConfirm} onChange={(e) => setNewPasswordConfirm(e.target.value)} />
                        </Field.Root>
                        <Button width="full" onClick={handleResetPassword} mt={4}>비밀번호 변경</Button>
                    </Stack>
                )}
            </Box>
        </Stack>
    );
}
