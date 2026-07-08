import { Box, Circle, Flex, Float, HStack, Icon, IconButton, Image, Stack, Text, Popover, Button } from "@chakra-ui/react";
import { LuEye, LuX } from "react-icons/lu";
import { useEffect, useState } from "react";
import { useAuth } from "../../utils/useAuth";
import axiosInstance from "../../utils/api";
import { getLocalRecentCampaigns, clearLocalRecentCampaigns } from "../../utils/recentCampaigns";
import { useNavigate } from "react-router-dom";

export default function CampaignActivityPopover() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activity, setActivity] = useState({ viewed: [], active: [] });
    const [isOpen, setIsOpen] = useState(false);

    const fetchActivity = async () => {
        try {
            const localCodes = getLocalRecentCampaigns();
            const res = await axiosInstance.post('/review/campaign/user/activity', { local_campaign_codes: localCodes });
            setActivity(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        const syncAndFetch = async () => {
            if (user) {
                const localCodes = getLocalRecentCampaigns();
                if (localCodes.length > 0) {
                    try {
                        await axiosInstance.post('/review/campaign/sync', { campaign_codes: localCodes });
                        clearLocalRecentCampaigns();
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
            fetchActivity();
        };
        syncAndFetch();
    }, [user]);

    const handleOpen = () => {
        setIsOpen(true);
        fetchActivity();
    };

    const count = activity.viewed.length + activity.active.length;

    const renderCampaign = (campaign, isActive = false) => (
        <HStack key={campaign.campaign_code} p="2" _hover={{ bg: "gray.50" }} cursor="pointer" onClick={() => { setIsOpen(false); navigate(`/review/campaign/${campaign.campaign_code}`); }}>
            <Image src={campaign.main_image} w="12" h="12" rounded="md" objectFit="cover" />
            <Stack gap="0" flex="1">
                <Text fontSize="sm" fontWeight="bold" noOfLines={1}>{campaign.title}</Text>
                <Text fontSize="xs" color="gray.500" noOfLines={1}>{campaign.short_description}</Text>
                {isActive && (
                    <Text fontSize="xs" color="main" fontWeight="medium">{campaign.status === 'APPLIED' ? '신청완료' : '선정됨'}</Text>
                )}
            </Stack>
        </HStack>
    );

    return (
        <Popover.Root open={isOpen} onOpenChange={(e) => { if (e.open) handleOpen(); else setIsOpen(false); }} positioning={{ placement: "bottom-end" }}>
            <Popover.Trigger asChild>
                <IconButton variant="ghost" rounded="full" position="relative" aria-label="Campaign Activity">
                    <Icon size="md"><LuEye /></Icon>
                    {count > 0 && (
                        <Float>
                            <Circle size="4" bg="red" color="white" fontSize="xs">{count}</Circle>
                        </Float>
                    )}
                </IconButton>
            </Popover.Trigger>
            <Popover.Positioner>
                <Popover.Content width="320px" p="0" overflow="hidden" shadow="lg" rounded="md" bg="white" zIndex={1400}>
                    <Popover.Arrow bg="white" />
                    <Popover.Body p="0">
                        <Flex justify="space-between" align="center" p="3" borderBottom="1px solid" borderColor="gray.100" bg="gray.50">
                            <Text fontSize="sm" fontWeight="bold">캠페인 활동</Text>
                            <IconButton size="xs" variant="ghost" onClick={() => setIsOpen(false)}><LuX /></IconButton>
                        </Flex>
                        <Box maxH="300px" overflowY="auto">
                            {activity.active.length > 0 && (
                                <Box>
                                    <Text fontSize="xs" fontWeight="bold" color="gray.500" p="2" bg="gray.50">진행 중인 캠페인</Text>
                                    {activity.active.map(c => renderCampaign(c, true))}
                                </Box>
                            )}
                            {activity.viewed.length > 0 && (
                                <Box>
                                    <Text fontSize="xs" fontWeight="bold" color="gray.500" p="2" bg="gray.50">최근 본 캠페인</Text>
                                    {activity.viewed.map(c => renderCampaign(c, false))}
                                </Box>
                            )}
                            {count === 0 && (
                                <Text fontSize="sm" color="gray.500" textAlign="center" py="6">조회하거나 진행 중인 캠페인이 없습니다.</Text>
                            )}
                        </Box>
                        <Box p="2" borderTop="1px solid" borderColor="gray.100">
                            <Button variant="ghost" w="full" size="sm" onClick={() => { setIsOpen(false); navigate('/review/viewed'); }}>자세히 보기 (전체보기)</Button>
                        </Box>
                    </Popover.Body>
                </Popover.Content>
            </Popover.Positioner>
        </Popover.Root>
    );
}
