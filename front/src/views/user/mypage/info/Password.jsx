import { Button, CloseButton, Dialog, Field, Input, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuChevronRight } from "react-icons/lu";
import { PasswordInput } from "../../../../components/ui/password-input";

import axiosInstance from "../../../../utils/api";
import { toaster } from "../../../../components/ui/toaster";

function Password() {

    const [open, setOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');

    const isConfirmPasswordError = confirmNewPassword.length > 0 && newPassword !== confirmNewPassword;

    const updatePassword = async () => {
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            return;
        }
        if (isConfirmPasswordError) {
            return;
        }

        try {
            const res = await axiosInstance.put('/user/password', { currentPassword, newPassword });
            if (res.data.result) {
                toaster.create({ title: '비밀번호가 성공적으로 변경되었습니다.', type: 'success' });
                setOpen(false);
                initPasswordForm();
            } else {
                if (res.data.code === '001') {
                    setError('현재 비밀번호가 일치하지 않습니다.');
                }
            }
        } catch (err) {
            toaster.create({ title: '비밀번호 변경 중 오류가 발생했습니다.', type: 'error' });
        }
    }

    const initPasswordForm = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setError('');
    }

    return (
        <Dialog.Root open={open} onOpenChange={(e) => {
            setOpen(e.open);
            if (!e.open) initPasswordForm();
        }}>
            <Dialog.Trigger asChild>
                <Button variant="ghost" justifyContent="space-between">비밀번호 변경<LuChevronRight /></Button>
            </Dialog.Trigger>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>비밀번호 변경</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        <Stack gap="4">
                            <Field.Root invalid={!!error}>
                                <Field.Label>현재 비밀번호<Field.RequiredIndicator /></Field.Label>
                                <PasswordInput
                                    placeholder="현재 비밀번호를 입력해주세요."
                                    value={currentPassword}
                                    onChange={(e) => {
                                        setCurrentPassword(e.target.value);
                                        setError('');
                                    }}
                                />
                                {error && <Field.ErrorText>{error}</Field.ErrorText>}
                            </Field.Root>
                            <Field.Root>
                                <Field.Label>새 비밀번호<Field.RequiredIndicator /></Field.Label>
                                <PasswordInput
                                    placeholder="새 비밀번호를 입력해주세요."
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </Field.Root>
                            <Field.Root invalid={isConfirmPasswordError}>
                                <Field.Label>새 비밀번호 확인<Field.RequiredIndicator /></Field.Label>
                                <PasswordInput
                                    placeholder="새 비밀번호를 다시 한번 입력해주세요."
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                />
                                {isConfirmPasswordError && (
                                    <Field.ErrorText>새 비밀번호가 일치하지 않습니다.</Field.ErrorText>
                                )}
                            </Field.Root>
                        </Stack>
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Button variant="ghost" onClick={() => setOpen(false)}>취소</Button>
                        <Button
                            onClick={updatePassword}
                            disabled={!currentPassword || !newPassword || !confirmNewPassword || isConfirmPasswordError}
                        >
                            저장
                        </Button>
                    </Dialog.Footer>
                    <Dialog.CloseTrigger asChild>
                        <CloseButton size="sm" />
                    </Dialog.CloseTrigger>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )

}

export default Password;