import { Box, Heading, Stack, Text, SimpleGrid, Image, Badge, Link, Flex, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/api";
import { getLocalRecentCampaigns } from "../../utils/recentCampaigns";
import { useNavigate } from "react-router-dom";
import { getDDay } from "../../utils/simpleUtils";

export default function Viewed() {
    const [activity, setActivity] = useState({ viewed: [], active: [] });
    const navigate = useNavigate();
    const [reviewCampaignChannelView, setReviewCampaignChannelView] = useState([]);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const localCodes = getLocalRecentCampaigns();
                const res = await axiosInstance.post('/review/campaign/user/activity', { local_campaign_codes: localCodes });
                setActivity(res.data);
            } catch (e) {
                console.error(e);
            }
        };
        const fetchReviewCampaignChannelView = async () => {
            try {
                const resources = await axiosInstance.get('/review/campaign/channel');
                setReviewCampaignChannelView(resources.data);
            } catch {
                toaster.create({ title: '오류가 발생되었습니다.', type: 'error' });
            }
        };

        fetchActivity();
        fetchReviewCampaignChannelView();
    }, []);

    const count = activity.viewed.length + activity.active.length;

    const renderCampaignCard = (campaign, isActive = false) => (
        <Box>
            <Stack gap="2" p="0 10px">
                <Link href={`/review/detail/${campaign.campaign_code}`}>
                    <Image src={campaign.main_image} aspectRatio="square" rounded="md" w="full" />
                </Link>
                <HStack>
                    <HStack>
                        {campaign.channels.map((channel, index) => {
                            const channelView = reviewCampaignChannelView.find((channelView) => channelView.channel_code === channel.channel_code);
                            return channelView ? (<Image key={channelView.id} src={`/public/resources/img/logo/${channelView.icon}`} w="5" rounded="md" />) : '';
                        })}
                    </HStack>
                    <Text>
                        {getDDay(campaign.end_application_date) === '0' ? '오늘 마감' : `D-${getDDay(campaign.end_application_date)}`}
                    </Text>
                    {isActive && (
                        <Badge colorScheme="blue" ml="2">{campaign.status === 'APPLIED' ? '신청완료' : '선정됨'}</Badge>
                    )}
                </HStack>
                <Text>{campaign.title}</Text>
                <Text fontSize="xs" color="fg.muted">{campaign.offer}</Text>
                <Text fontSize="xs">신청 {campaign.application_count}명&#47;{campaign.max_applicants}명</Text>
            </Stack>
        </Box>
    );

    return (
        <Stack p={{ base: '40px 0', md: "80px 0" }} px={{ base: '15px', md: "layoutX" }} gap="6">
            <Stack gap="2">
                <Heading size="lg">나의 캠페인 활동</Heading>
                <Text color="gray.500">진행 중이거나 최근 조회한 캠페인입니다.</Text>
            </Stack>

            {count === 0 ? (
                <Flex justify="center" align="center" h="200px" bg="gray.50" rounded="md">
                    <Text color="gray.500">조회하거나 진행 중인 캠페인이 없습니다.</Text>
                </Flex>
            ) : (
                <Stack gap="12">
                    {activity.active.length > 0 && (
                        <Stack gap="4">
                            <Heading size="md" borderBottom="2px solid" borderColor="black" pb="2">진행 중인 캠페인 ({activity.active.length})</Heading>
                            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 6 }} gap="6">
                                {activity.active.map(c => renderCampaignCard(c, true))}
                            </SimpleGrid>
                        </Stack>
                    )}

                    {activity.viewed.length > 0 && (
                        <Stack gap="4">
                            <Heading size="md" borderBottom="2px solid" borderColor="black" pb="2">최근 본 캠페인 ({activity.viewed.length})</Heading>
                            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 6 }} gap="6">
                                {activity.viewed.map(c => renderCampaignCard(c, false))}
                            </SimpleGrid>
                        </Stack>
                    )}
                </Stack>
            )}
        </Stack>
    );
}
