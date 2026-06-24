import { Avatar, Button, CloseButton, Dialog, Input, Stack, Switch, Table } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuChevronRight, LuUserRound } from "react-icons/lu";
import { toaster } from "../../../../components/ui/toaster";
import axiosInstance from "../../../../utils/api";

function PrivateInfo({ user }) {

    const [open, setOpen] = useState(false);
    const [activeUser, setActiveUser] = useState(user);
    const [marketingAgree, setMarketingAgree] = useState(false);

    const getUser = async () => {
        try {
            const resource = await axiosInstance.get(`/user/profile`);
            if (resource.status === 200) {
                setActiveUser(resource.data);
                setMarketingAgree(resource.data.marketingAgree);
            }
        } catch {
            toaster.create({ title: '오류가 발생했습니다.', type: 'error' });
        }
    }

    useEffect(() => {
        getUser();
    }, [])

    return (
        <Dialog.Root open={open} onOpenChange={e => setOpen(e.open)}>
            <Dialog.Trigger asChild>
                <Button variant="ghost" justifyContent="space-between">개인정보 수정<LuChevronRight /></Button>
            </Dialog.Trigger>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>개인정보 수정</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        <Stack alignItems="center" gap="4">
                            <Avatar.Root size="2xl">
                                {activeUser.profile ? (
                                    <Avatar.Image src={activeUser.profile} />
                                ) : (<LuUserRound />)}
                            </Avatar.Root>
                            <Table.Root>
                                <Table.Body>
                                    <Table.Row>
                                        <Table.ColumnHeader>이메일</Table.ColumnHeader>
                                        <Table.Cell>{activeUser.email}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.ColumnHeader>성함</Table.ColumnHeader>
                                        <Table.Cell><Input value={activeUser.name} /></Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.ColumnHeader>연락처</Table.ColumnHeader>
                                        <Table.Cell><Input value={activeUser.phone} /></Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.ColumnHeader>마케팅 수신동의</Table.ColumnHeader>
                                        <Table.Cell>
                                            <Switch.Root checked={marketingAgree} onCheckedChange={(e) => setMarketingAgree(e.checked)}>
                                                <Switch.HiddenInput />
                                                <Switch.Control />
                                                <Switch.Label>{marketingAgree ? '동의' : '미동의'}</Switch.Label>
                                            </Switch.Root>
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table.Root>
                        </Stack>
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Button>수정</Button>
                    </Dialog.Footer>
                    <Dialog.CloseTrigger>
                        <CloseButton />
                    </Dialog.CloseTrigger>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}

export default PrivateInfo;