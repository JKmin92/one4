import { Button, Dialog, Field, Input, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../utils/api";
import { toaster } from "../../../../components/ui/toaster";

function DepositNameChangeDialog({ open, setOpen, orderCode, currentDepositName, onUpdateSuccess }) {
    const [depositName, setDepositName] = useState('');

    useEffect(() => {
        if (open) {
            setDepositName(currentDepositName || '');
        }
    }, [open, currentDepositName]);

    const handleUpdate = async () => {
        if (!depositName.trim()) {
            toaster.create({ title: "입금자명을 입력해주세요.", type: "warning" });
            return;
        }

        try {
            await axiosInstance.put(`/shop/product/order/${orderCode}/deposit-name`, { deposit_name: depositName });
            toaster.create({ title: "입금자명이 변경되었습니다.", type: "success" });
            setOpen(false);
            onUpdateSuccess();
        } catch {
            toaster.create({ title: "입금자명 변경에 실패했습니다.", type: "error" });
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>입금자명 변경</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        <Stack gap="4">
                            <Field.Root>
                                <Field.Label>입금자명</Field.Label>
                                <Input
                                    placeholder="입금자명을 입력해주세요"
                                    value={depositName}
                                    onChange={(e) => setDepositName(e.target.value)}
                                />
                            </Field.Root>
                        </Stack>
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Dialog.ActionTrigger asChild>
                            <Button variant="outline">취소</Button>
                        </Dialog.ActionTrigger>
                        <Button onClick={handleUpdate}>변경하기</Button>
                    </Dialog.Footer>
                    <Dialog.CloseTrigger />
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}

export default DepositNameChangeDialog;
