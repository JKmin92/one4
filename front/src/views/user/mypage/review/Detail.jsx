import { Badge, Box, Button, Clipboard, Heading, HStack, Input, Stack, StackSeparator, Status, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../../utils/api";
import { getDDay, getReviewCampaignApplicationStatus } from "../../../../utils/simpleUtils";

function Detail() {

    const { campaign_application_code } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [userAddress, setUserAddress] = useState(null);
    const [reviewCampaignApplicationDelivery, setReviewCampaignApplicationDelivery] = useState(null);

    const campaignInfoStack = { direction: { base: 'column', md: "row" }, alignItems: { base: 'start', md: "center" } };
    const campaignInfoTitle = { w: { base: 'full', md: "1/6" }, size: 'md' };
    const campaignInfoText = { fontSize: { base: "xs", md: "sm" }, w: { base: 'full', md: "5/6" }, lineHeight: "1.8", whiteSpace: "pre-line" };

    useEffect(() => {
        const getCampaign = async () => {
            const resource = await axiosInstance.get(`/review/campaign/user/application/${campaign_application_code}`);
            if (resource.status === 200) {
                setCampaign(resource.data);
                if (resource.data.address_code) {
                    getUserAddress(resource.data.address_code);
                }
            }
        }
        const getUserAddress = async (address_code) => {
            const resource = await axiosInstance.get(`/review/campaign/user/address/${address_code}`);
            if (resource.status === 200) {
                setUserAddress(resource.data);
            }
        }

        const getReviewCampaignApplicationDelivery = async (campaign_application_code) => {
            const resource = await axiosInstance.get(`/review/campaign/user/application/delivery/${campaign_application_code}`);
            if (resource.status === 200) {
                setReviewCampaignApplicationDelivery(resource.data);
            }
        }

        getCampaign();
        getReviewCampaignApplicationDelivery(campaign_application_code);

    }, [campaign_application_code]);

    if (!campaign) return null;

    return (
        <Stack w="full" rounded="md" border="1px solid #eee" p="20px" gap="6" textAlign="left" position="relative">
            <Stack gap="0">
                <Status.Root colorPalette={getReviewCampaignApplicationStatus(campaign.status, campaign).color}>
                    <Status.Indicator />
                    <Text>{getReviewCampaignApplicationStatus(campaign.status, campaign).text}</Text>
                </Status.Root>
                <HStack>
                    <Heading>{campaign.title}</Heading>
                    {getReviewCampaignApplicationStatus(campaign.status, campaign).date && <Badge variant="outline" colorPalette={getReviewCampaignApplicationStatus(campaign.status, campaign).color}>{getReviewCampaignApplicationStatus(campaign.status, campaign).title} D-{getDDay(getReviewCampaignApplicationStatus(campaign.status, campaign).date)}</Badge>}
                </HStack>
            </Stack>

            <Stack direction="row">
                <Stack w="full" separator={<StackSeparator />} gap="4">
                    <Stack {...campaignInfoStack}>
                        <Heading {...campaignInfoTitle}>캠페인 소개</Heading>
                        <Text {...campaignInfoText}>{campaign.content}</Text>
                    </Stack>
                    <Stack {...campaignInfoStack}>
                        <Heading {...campaignInfoTitle}>제공내용</Heading>
                        <Box {...campaignInfoText}>
                            {campaign.rewards.map(reward => {
                                if (reward.reward_type === 'PRODUCT') {
                                    return (
                                        <Stack key={reward.id} direction="row" gap="10">
                                            <Stack gap="0">
                                                <Text fontSize="md">{reward.name} {reward.quantity}개</Text>
                                                <Text fontSize="xs" color="fg.muted">{reward.description}</Text>
                                            </Stack>
                                            {reward.reward_options.length > 0 && (
                                                <Stack gap="4" direction="row" alignItems="center">
                                                    <Text>선택된 옵션</Text>
                                                    {reward.reward_options.map(option => {
                                                        return option.selected_options.map(selected_option => (
                                                            <Badge key={selected_option.campaign_application_reward_option_code} justifyContent="center">{selected_option.reward_option_value}</Badge>
                                                        ))
                                                    })}
                                                </Stack>
                                            )}
                                        </Stack>
                                    )
                                }
                            })}
                        </Box>
                    </Stack>
                    <Stack {...campaignInfoStack}>
                        <Heading {...campaignInfoTitle}>키워드</Heading>
                        <Box {...campaignInfoText}>
                            <Stack>
                                <Stack gap="0">
                                    <Text>제목 키워드 : {campaign.mission.mandatory_keyword ? campaign.mission.mandatory_keyword.split(',').map(tag => `${tag.trim()}`).join(', ') : ''}</Text>
                                    <Text>{campaign.campaign_type === 'DELIVERY' ? '제품명' : '매장명'} : {campaign.product_name}</Text>
                                </Stack>
                            </Stack>
                        </Box>
                    </Stack>
                    <Stack {...campaignInfoStack}>
                        <Heading {...campaignInfoTitle}>해시태그</Heading>
                        <Stack gap="2" {...campaignInfoText}>
                            <Box>
                                <Clipboard.Root value={campaign.mission.hashtags.split(',').map(tag => `#${tag.trim()}`).join(' ')}>
                                    <Clipboard.Trigger asChild>
                                        <Button variant="surface" w="auto" fontSize="sm" minH="auto" minW="auto" h="auto" rounded="full"><Clipboard.Indicator /> 해시태그 복사</Button>
                                    </Clipboard.Trigger>
                                </Clipboard.Root>
                            </Box>
                            <Text>
                                {campaign.mission.hashtags ? campaign.mission.hashtags.split(',').map(tag => `#${tag.trim()}`).join(' ') : ''}
                            </Text>
                        </Stack>
                    </Stack>
                    <Stack {...campaignInfoStack}>
                        <Heading {...campaignInfoTitle}>캠페인 미션</Heading>
                        <Text {...campaignInfoText}>
                            {campaign.mission.content_guide}
                        </Text>
                    </Stack>
                    <Stack {...campaignInfoStack}>
                        <Heading {...campaignInfoTitle}>주의사항</Heading>
                        <Text {...campaignInfoText}>
                            작성이 지연될 경우 문의사항 또는 원포 카카오톡 채널로 미리 말씀 부탁드립니다.
                        </Text>
                    </Stack>
                    {campaign.campaign_type === 'DELIVERY' && (
                        <Stack {...campaignInfoStack}>
                            <Heading {...campaignInfoTitle}>배송지 정보</Heading>
                            <Stack {...campaignInfoText}>
                                <Stack gap="0">
                                    <Text>{userAddress?.name} {userAddress?.phone}</Text>
                                    <Text>[{userAddress?.postcode}] {userAddress?.address} {userAddress?.detailAddress}</Text>
                                </Stack>
                                {reviewCampaignApplicationDelivery && (
                                    <HStack>
                                        <Text>{reviewCampaignApplicationDelivery?.courier}</Text>
                                        <Text>{reviewCampaignApplicationDelivery?.tracking_number}</Text>
                                        <Button variant="outline" size="sm" onClick={() => {
                                            const query = `${reviewCampaignApplicationDelivery?.courier || ''} ${reviewCampaignApplicationDelivery?.tracking_number || ''}`.trim();
                                            if (query) {
                                                window.open(`https://search.naver.com/search.naver?query=${encodeURIComponent(query)}`, '_blank');
                                            }
                                        }}>배송추적</Button>
                                    </HStack>
                                )}
                            </Stack>
                        </Stack>
                    )}
                    {campaign.status === 'SELECTED' && (
                        <Stack {...campaignInfoStack}>
                            <Heading {...campaignInfoTitle}>리뷰 작성 제출</Heading>
                            <HStack {...campaignInfoText}>
                                <Input placeholder="리뷰 링크를 입력해주세요." />
                                <Button>제출</Button>
                            </HStack>
                        </Stack>
                    )}
                </Stack>
                <Box position="relative" w="1/5" display="none">
                    <Stack position="sticky" separator={<StackSeparator />}>
                        <Button variant="ghost">제공 내용</Button>
                        <Button variant="ghost">키워드</Button>
                        <Button variant="ghost">캠페인 미션</Button>
                        <Button variant="ghost">주의사항</Button>
                    </Stack>
                </Box>
            </Stack>
        </Stack>
    )
}

export default Detail;