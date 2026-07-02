import { Container, Heading, Box, VStack, Text, Button, Badge, HStack, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../utils/useAuth";


export default function NotificationList() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const response = await axiosInstance.get('/user/notifications');
            setNotifications(response.data);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    const handleRead = async (notification_code, link) => {
        try {
            await axiosInstance.put(`/user/notifications/${notification_code}/read`);
            if (link) {
                navigate(link);
            } else {
                fetchNotifications();
            }
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const handleReadAll = async () => {
        try {
            await axiosInstance.put('/user/notifications/read-all');
            fetchNotifications();
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    return (
        <Stack w="full" rounded="md" border="1px solid #eee" p="20px" gap="6" textAlign="left">
            <HStack alignItems="center" justifyContent="space-between">
                <Heading size="lg">전체 알림</Heading>
                <Button size="sm" onClick={handleReadAll} variant="outline">모두 읽음 처리</Button>
            </HStack>
            <VStack align="stretch" gap={4}>
                {notifications.length > 0 ? (
                    notifications.map(notification => (
                        <Box
                            key={notification.notification_code}
                            p={4}
                            borderWidth="1px"
                            borderRadius="md"
                            bg={notification.is_read ? 'white' : 'blue.50'}
                            cursor="pointer"
                            onClick={() => handleRead(notification.notification_code, notification.link)}
                            _hover={{ bg: 'gray.50' }}
                        >
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Badge colorPalette={notification.type === 'SHOP' ? 'green' : 'purple'}>
                                    {notification.type === 'SHOP' ? '쇼핑' : notification.type === 'REVIEW' ? '리뷰' : '공지'}
                                </Badge>
                                <Text fontSize="xs" color="gray.500">
                                    {new Date(notification.created_at).toLocaleString()}
                                </Text>
                            </Box>
                            <Text color={notification.is_read ? 'gray.600' : 'black'} fontWeight={notification.is_read ? 'normal' : 'bold'}>
                                {notification.message}
                            </Text>
                        </Box>
                    ))
                ) : (
                    <Box p={8} textAlign="center" borderWidth="1px" borderRadius="md" bg="gray.50">
                        <Text color="gray.500">알림이 없습니다.</Text>
                    </Box>
                )}
            </VStack>
        </Stack>
    );
}
