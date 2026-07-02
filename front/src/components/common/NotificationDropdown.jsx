import { Box, Text, VStack, Button, Badge, Menu } from "@chakra-ui/react";
import { LuBell } from "react-icons/lu";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/useAuth";

export default function NotificationDropdown() {
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
            fetchNotifications();
            if (link) {
                navigate(link);
            }
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;
    const latestNotifications = notifications.slice(0, 5);

    return (
        <Menu.Root>
            <Menu.Trigger asChild>
                <Box position="relative" cursor="pointer" p={2}>
                    <LuBell size={24} />
                    {unreadCount > 0 && (
                        <Badge 
                            position="absolute" 
                            top="0" 
                            right="0" 
                            colorPalette="red" 
                            borderRadius="full" 
                            px={1} 
                            fontSize="xs"
                        >
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                    )}
                </Box>
            </Menu.Trigger>
            <Menu.Positioner>
                <Menu.Content width="320px" p={2} zIndex={100} right={0}>
                    <Text fontWeight="bold" p={2} borderBottom="1px solid #eee">알림</Text>
                    {latestNotifications.length > 0 ? (
                        <VStack align="stretch" gap={0} mt={2}>
                            {latestNotifications.map(notification => (
                                <Menu.Item 
                                    key={notification.notification_code} 
                                    value={notification.notification_code}
                                    onClick={() => handleRead(notification.notification_code, notification.link)}
                                    bg={notification.is_read ? 'transparent' : 'blue.50'}
                                    p={3}
                                    _hover={{ bg: 'gray.100' }}
                                    cursor="pointer"
                                    whiteSpace="normal"
                                >
                                    <Text fontSize="sm" color={notification.is_read ? 'gray.500' : 'black'}>
                                        {notification.message}
                                    </Text>
                                </Menu.Item>
                            ))}
                        </VStack>
                    ) : (
                        <Text p={4} textAlign="center" fontSize="sm" color="gray.500">새로운 알림이 없습니다.</Text>
                    )}
                    
                    <Button 
                        mt={2} 
                        w="full" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => navigate('/mypage/notifications')}
                    >
                        전체 알림 보기
                    </Button>
                </Menu.Content>
            </Menu.Positioner>
        </Menu.Root>
    );
}
