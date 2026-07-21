import { Dialog, Box, Text, Button, Stack, HStack, Icon, Badge, Spinner, Center, CloseButton } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuChevronRight, LuMonitor, LuSmartphone, LuTablet } from "react-icons/lu";
import { FiHelpCircle } from "react-icons/fi";
import { toaster } from "../../../../components/ui/toaster";
import axiosInstance from "../../../../utils/api";

function DeviceManagement() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get('/user/sessions');
            setSessions(res.data);
        } catch {
            toaster.create({ title: '기기 목록을 불러오지 못했습니다.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchSessions();
        }
    }, [open]);

    const handleRevoke = async (device_code) => {
        try {
            await axiosInstance.delete(`/user/sessions/${device_code}`);
            toaster.create({ title: '해당 기기를 로그아웃했습니다.', type: 'success' });
            fetchSessions();
        } catch {
            toaster.create({ title: '로그아웃 처리에 실패했습니다.', type: 'error' });
        }
    };

    const getDeviceIcon = (type) => {
        switch (type) {
            case 'PC': return (<LuMonitor />);
            case 'MOBILE': return (<LuSmartphone />);
            case 'TABLET': return (<LuTablet />);
            default: return (<FiHelpCircle />);
        }
    };

    const formatDate = (dateString) => {
        const d = new Date(dateString);
        return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    };

    return (
        <Dialog.Root open={open} onOpenChange={e => setOpen(e.open)}>
            <Dialog.Trigger asChild>
                <Button variant="ghost" justifyContent="space-between">
                    로그인된 기기 관리
                    <LuChevronRight />
                </Button>
            </Dialog.Trigger>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>로그인된 기기 관리</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        <Text fontSize="sm" color="gray.500" mb={4}>
                            현재 자동 로그인 상태인 기기 목록입니다. 본인이 접속하지 않은 기기가 있다면 로그아웃해주세요.
                        </Text>

                        {loading ? (
                            <Center py={10}>
                                <Spinner />
                            </Center>
                        ) : (
                            <Stack gap={4}>
                                {sessions.map(session => (
                                    <Box key={session.device_code} p={4} borderWidth="1px" borderRadius="md" bg={session.isCurrent ? "blue.50" : "white"}>
                                        <HStack justify="space-between">
                                            <HStack gap={4}>
                                                <Icon boxSize={6} color="gray.600">
                                                    {getDeviceIcon(session.device_type)}
                                                </Icon>
                                                <Box>
                                                    <HStack>
                                                        <Text fontWeight="bold">{session.device_name || '알 수 없는 기기'}</Text>
                                                        {session.isCurrent && <Badge colorPalette="blue">현재 기기</Badge>}
                                                    </HStack>
                                                    <Text fontSize="sm" color="gray.500">
                                                        {session.browser_info} • {session.ip_address}
                                                    </Text>
                                                    <Text fontSize="xs" color="gray.400">
                                                        접속일시: {formatDate(session.createdAt)}
                                                    </Text>
                                                </Box>
                                            </HStack>
                                            <Button
                                                size="sm"
                                                colorPalette="red"
                                                variant={session.isCurrent ? "subtle" : "solid"}
                                                disabled={session.isCurrent}
                                                onClick={() => handleRevoke(session.device_code)}
                                            >
                                                로그아웃
                                            </Button>
                                        </HStack>
                                    </Box>
                                ))}
                                {sessions.length === 0 && (
                                    <Center py={10}>
                                        <Text color="gray.500">로그인된 다른 기기가 없습니다.</Text>
                                    </Center>
                                )}
                            </Stack>
                        )}
                    </Dialog.Body>
                    <Dialog.CloseTrigger asChild>
                        <CloseButton />
                    </Dialog.CloseTrigger>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
}

export default DeviceManagement;
