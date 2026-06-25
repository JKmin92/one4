import { Avatar, Box, Button, CloseButton, Dialog, FileUpload, Icon, Input, Stack, Switch, Table, Image, Float, IconButton } from "@chakra-ui/react";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../../utils/AuthProvider";
import { LuChevronRight, LuUserRound, LuX } from "react-icons/lu";
import { toaster } from "../../../../components/ui/toaster";
import axiosInstance from "../../../../utils/api";

function PrivateInfo({ user }) {

    const [open, setOpen] = useState(false);
    const [profile, setProfile] = useState();
    const [previewImage, setPreviewImage] = useState(null);
    const [name, setName] = useState();
    const [phone, setPhone] = useState();
    const [marketingAgree, setMarketingAgree] = useState(false);
    const { setUser, setAccessToken } = useContext(AuthContext);

    const getUser = async () => {
        try {
            const resource = await axiosInstance.get(`/user/profile`);
            if (resource.status === 200) {
                setName(resource.data.name);
                setPhone(resource.data.phone);
                setProfile(resource.data.profile);
                setMarketingAgree(resource.data.marketingAgree);
            }
        } catch {
            toaster.create({ title: '오류가 발생했습니다.', type: 'error' });
        }
    }

    useEffect(() => {
        getUser();
    }, [])

    const handleImageSelect = (e) => {
        // FileUpload 컴포넌트가 파일을 누적할 수 있으므로 항상 가장 마지막(최신) 파일을 선택합니다.
        const file = e.acceptedFiles[e.acceptedFiles.length - 1];
        if (file) {
            setProfile(file); // 백엔드 전송용 File 객체
            setPreviewImage(URL.createObjectURL(file)); // 화면 미리보기용 URL
        }
    }

    const onSubmit = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('marketingAgree', marketingAgree);

        // 새로 선택한 이미지가 File 객체일 때만 전송
        if (profile instanceof File) {
            formData.append('profileImage', profile);
        } else if (profile === null) {
            formData.append('profileImage', 'DELETED');
        }

        try {
            const res = await axiosInstance.put('/user/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const { accessToken: newAccessToken, ...userData } = res.data;
            setUser(userData);
            setAccessToken(newAccessToken);

            toaster.create({ title: '개인정보가 수정되었습니다.', type: 'success' });
            setOpen(false);
            // 필요하다면 프로필 변경 이벤트를 발생시켜 상단 헤더 등을 업데이트
            window.dispatchEvent(new Event('profile_updated'));
        } catch (e) {
            toaster.create({ title: '오류가 발생했습니다.', type: 'error' });
        }
    }

    const removeProfileImage = () => {
        setProfile(null);
        setPreviewImage(null);
    }

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
                            <Box w="85px" h="85px" rounded="full" bg="gray.200" margin="auto" position="relative">
                                <FileUpload.Root accept="image/*" onFileChange={handleImageSelect}>
                                    <FileUpload.HiddenInput />
                                    <FileUpload.Trigger asChild>
                                        <Box w="85px" h="85px" objectFit="cover" display="flex" alignItems="center" justifyContent="center" cursor="pointer">
                                            {previewImage || (typeof profile === 'string' && profile) ? (
                                                <Image src={previewImage || profile} w="full" h="full" objectFit="cover" rounded="full" />
                                            ) : (
                                                <Icon color="black" size="md"><LuUserRound /></Icon>
                                            )}
                                        </Box>
                                    </FileUpload.Trigger>
                                    {(previewImage || (typeof profile === 'string' && profile)) && (
                                        <Float placement="top-end">
                                            {previewImage ? (
                                                <FileUpload.ClearTrigger asChild>
                                                    <IconButton variant="ghost" color="red" size="sm" rounded="full" onClick={removeProfileImage}><LuX /></IconButton>
                                                </FileUpload.ClearTrigger>
                                            ) : (
                                                <IconButton variant="ghost" color="red" size="sm" rounded="full" onClick={removeProfileImage}><LuX /></IconButton>
                                            )}
                                        </Float>
                                    )}
                                </FileUpload.Root>
                            </Box>
                            <Table.Root>
                                <Table.Body>
                                    <Table.Row>
                                        <Table.ColumnHeader>이메일</Table.ColumnHeader>
                                        <Table.Cell>{user.email}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.ColumnHeader>성함</Table.ColumnHeader>
                                        <Table.Cell><Input value={name} onChange={(e) => setName(e.target.value)} /></Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.ColumnHeader>연락처</Table.ColumnHeader>
                                        <Table.Cell><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></Table.Cell>
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
                        <Button onClick={onSubmit}>수정</Button>
                    </Dialog.Footer>
                    <Dialog.CloseTrigger>
                        <CloseButton />
                    </Dialog.CloseTrigger>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root >
    )
}

export default PrivateInfo;