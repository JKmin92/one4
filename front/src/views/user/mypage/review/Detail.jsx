import { Badge, Box, Button, Clipboard, Dialog, Heading, HStack, Icon, Image, Input, Link, Stack, StackSeparator, Status, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../../utils/api";
import { getDDay, getReviewCampaignApplicationStatus } from "../../../../utils/simpleUtils";
import { toaster } from "../../../../components/ui/toaster";
import { LuImage, LuLetterText } from "react-icons/lu";

function Detail() {

    const { campaign_application_code } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [userAddress, setUserAddress] = useState(null);
    const [reviewCampaignApplicationDelivery, setReviewCampaignApplicationDelivery] = useState(null);
    const [post, setPost] = useState(null);
    const [loadPost, setLoadPost] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [reviewCampaignFeedbackList, setReviewCampaignFeedbackList] = useState([]);
    const [reviewCampaignApplicationChannelList, setReviewCampaignApplicationChannelList] = useState([]);

    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [cancelDialogButtonLoading, setCancelDialogButtonLoading] = useState(false);
    const navigate = useNavigate();

    const campaignInfoStack = { direction: { base: 'column', md: "row" }, alignItems: { base: 'start', md: "center" } };
    const campaignInfoTitle = { w: { base: 'full', md: "1/6" }, size: 'md' };
    const campaignInfoText = { fontSize: { base: "xs", md: "sm" }, w: { base: 'full', md: "5/6" }, lineHeight: "1.8", whiteSpace: "pre-line" };

    useEffect(() => {
        const getCampaign = async () => {
            try {
                const resource = await axiosInstance.get(`/review/campaign/user/application/${campaign_application_code}`);
                if (resource.status === 200) {
                    setCampaign(resource.data);
                    if (resource.data.address_code) {
                        getUserAddress(resource.data.address_code);
                    }
                }
            } catch {
                toaster.create({ title: '캠페인을 불러오는데 오류가 발생했습니다.', type: 'error' });
            }
        }
        const getUserAddress = async (address_code) => {
            try {
                const resource = await axiosInstance.get(`/review/campaign/user/address/${address_code}`);
                if (resource.status === 200) {
                    setUserAddress(resource.data);
                }
            } catch {
                toaster.create({ title: '주소를 불러오는데 오류가 발생했습니다.', type: 'error' });
            }
        }

        const getReviewCampaignApplicationDelivery = async (campaign_application_code) => {
            try {
                const resource = await axiosInstance.get(`/review/campaign/user/application/delivery/${campaign_application_code}`);
                if (resource.status === 200) {
                    setReviewCampaignApplicationDelivery(resource.data);
                }
            } catch {
                toaster.create({ title: '배송정보를 불러오는데 오류가 발생했습니다.', type: 'error' });
            }
        }

        const getReviewCampaignApplicationPost = async (campaign_application_code) => {
            try {
                const resource = await axiosInstance.get(`/review/campaign/application/post/${campaign_application_code}`);
                if (resource.data.post_url) {
                    setPost(resource.data);
                    if (resource.data.status == 'SUBMITTED' || resource.data.status == 'RESUBMITTED' || resource.data.status == 'COMPLETED') {
                        setLoadPost(true);
                    }
                }
            } catch {
                toaster.create({ title: '리뷰를 불러오는데 오류가 발생했습니다.', type: 'error' });
            }
        }

        const getReviewCampaignFeedbackList = async (campaign_application_code) => {
            try {
                const resource = await axiosInstance.get(`/review/campaign/application/feedback/${campaign_application_code}`);
                if (resource.status === 200) {
                    setReviewCampaignFeedbackList(resource.data);
                }
            } catch {
                toaster.create({ title: '피드백을 불러오는데 오류가 발생했습니다.', type: 'error' });
            }
        }

        const getReviewCampaignApplicationChannel = async (campaign_application_code) => {
            try {
                const resource = await axiosInstance.get(`/review/campaign/user/application/channel/${campaign_application_code}`);
                if (resource.status === 200) {
                    setReviewCampaignApplicationChannelList(resource.data);
                }
            } catch {
                toaster.create({ title: '채널정보를 불러오는데 오류가 발생했습니다.', type: 'error' });
            }
        }

        getCampaign();
        getReviewCampaignApplicationDelivery(campaign_application_code);
        getReviewCampaignApplicationPost(campaign_application_code);
        getReviewCampaignFeedbackList(campaign_application_code);
        getReviewCampaignApplicationChannel(campaign_application_code);

    }, [campaign_application_code]);

    const submitReview = async (campaign_post_code) => {
        try {
            if (campaign_post_code) {
                const resource = await axiosInstance.put(`/review/campaign/application/post`, { campaign_post_code, post_url: post?.post_url });
                if (resource.status === 200) {
                    toaster.create({ title: '리뷰가 수정되었습니다.', type: 'success' });
                    setLoadPost(true);
                }
            } else {
                const resource = await axiosInstance.post(`/review/campaign/application/post`, { campaign_application_code, post_url: post?.post_url });
                if (resource.status === 200) {
                    toaster.create({ title: '리뷰가 제출되었습니다.', type: 'success' });
                    setLoadPost(true);
                }
            }
        } catch {
            toaster.create({ title: '리뷰 제출/수정하는데 오류가 발생했습니다.', type: 'error' });
        }

    }

    const cancelCampaign = async (campaign_application_code) => {
        try {
            setCancelDialogButtonLoading(true);
            const resource = await axiosInstance.delete(`/review/campaign/application/${campaign_application_code}`);
            if (resource.status === 200) {
                toaster.create({ title: '캠페인이 취소되었습니다.', type: 'success' });
                navigate(`/mypage/review`);
            } else {
                toaster.create({ title: '캠페인 취소에 오류가 발생했습니다.', type: 'error' });
            }
        } catch {
            toaster.create({ title: '캠페인 취소하는데 오류가 발생했습니다.', type: 'error' });
        } finally {
            setCancelDialogButtonLoading(false);
        }
    }

    if (!campaign) return null;

    return (
        <Stack w="full" rounded="md" border={{ base: 'none', md: "1px solid #eee" }} p={{ base: '0 15px', md: "20px" }} gap="6" textAlign="left" position="relative">
            <HStack justifyContent="space-between">
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
                {campaign.status === 'APPLIED' && (
                    <Dialog.Root open={cancelDialogOpen} onOpenChange={(e) => setCancelDialogOpen(e.open)}>
                        <Dialog.Trigger asChild>
                            <Button>캠페인 취소</Button>
                        </Dialog.Trigger>
                        <Dialog.Backdrop />
                        <Dialog.Positioner>
                            <Dialog.Content>
                                <Dialog.Header>
                                    <Dialog.Title>캠페인 취소하기</Dialog.Title>
                                </Dialog.Header>
                                <Dialog.Body>
                                    <Text>{campaign.title} 캠페인을 취소하시겠습니까?</Text>
                                </Dialog.Body>
                                <Dialog.Footer>
                                    <Dialog.ActionTrigger asChild>
                                        <Button>취소</Button>
                                    </Dialog.ActionTrigger>
                                    <Dialog.ActionTrigger asChild>
                                        <Button colorPalette="red" loading={cancelDialogButtonLoading} onClick={() => cancelCampaign(campaign_application_code)}>캠페인 취소</Button>
                                    </Dialog.ActionTrigger>
                                </Dialog.Footer>
                            </Dialog.Content>
                        </Dialog.Positioner>
                    </Dialog.Root>
                )}
            </HStack>


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
                        <Heading {...campaignInfoTitle}>{campaign.mission.mandatory_keyword ? '키워드' : campaign.campaign_type === 'DELIVERY' ? '제품명' : '매장명'}</Heading>
                        <Box {...campaignInfoText}>
                            <Stack>
                                <Stack gap="0">
                                    {campaign.mission.mandatory_keyword && (
                                        <Text>제목 키워드 : {campaign.mission.mandatory_keyword ? campaign.mission.mandatory_keyword.split(',').map(tag => `${tag.trim()}`).join(', ') : ''}</Text>
                                    )}
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
                        <Stack {...campaignInfoText}>
                            <HStack gap="4" >
                                {campaign.mission.min_photo_count > 0 && (
                                    <Stack fontSize="xs">
                                        <Box textAlign="center"><Icon size="lg"><LuImage /></Icon></Box>
                                        <Text>이미지 {campaign.mission.min_photo_count}장 이상</Text>
                                    </Stack>
                                )}
                                {campaign.mission.min_text_length > 0 && (
                                    <Stack fontSize="xs">
                                        <Box textAlign="center"><Icon size="lg"><LuLetterText /></Icon></Box>
                                        <Text> {campaign.mission.min_text_length}자 이상</Text>
                                    </Stack>
                                )}
                            </HStack>
                            <Text>{campaign.mission.content_guide}</Text>
                        </Stack>
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
                                            if (query) window.open(`https://search.naver.com/search.naver?query=${encodeURIComponent(query)}`, '_blank');
                                        }}>배송추적</Button>
                                    </HStack>
                                )}
                            </Stack>
                        </Stack>
                    )}
                    {reviewCampaignApplicationChannelList.length > 0 && (
                        <Stack {...campaignInfoStack}>
                            <Heading {...campaignInfoTitle}>채널</Heading>
                            <Stack {...campaignInfoText}>
                                {reviewCampaignApplicationChannelList.map(channel => (
                                    <Link href={channel.channel_url} target="_blank" display="inline-flex" key={channel.campaign_application_channel_code}>
                                        <Stack direction="row" border="1px solid" borderColor="gray.200" alignItems="center" px="4" py="2" gap="4" rounded="md" w="full" >
                                            {channel.meta_image && (<Image src={channel.meta_image} w="16" rounded="md" />)}
                                            <Stack gap="0">
                                                <Text fontSize="sm" fontWeight="bold">{channel.meta_title}</Text>
                                                <Text fontSize="xs" color="gray.500">{channel.meta_description}</Text>
                                            </Stack>
                                        </Stack>
                                    </Link>
                                ))}
                            </Stack>
                        </Stack>
                    )}
                    {(reviewCampaignFeedbackList.length > 0 && campaign.status === 'RETURNED') && (
                        <Stack {...campaignInfoStack}>
                            <Heading {...campaignInfoTitle}>리뷰 피드백</Heading>
                            <Stack {...campaignInfoText}>
                                <Text>{reviewCampaignFeedbackList[reviewCampaignFeedbackList.length - 1].request_content}</Text>
                            </Stack>
                        </Stack>
                    )}
                    {(campaign.status === 'SELECTED' || campaign.status === 'SUBMITTED' || campaign.status === 'RETURNED' || campaign.status === 'COMPLETED') && (
                        <Stack {...campaignInfoStack}>
                            <Heading {...campaignInfoTitle}>리뷰 작성 제출</Heading>
                            <Stack {...campaignInfoText}>
                                <HStack>
                                    <Input placeholder="리뷰 링크를 입력해주세요." disabled={loadPost ? true : false} value={post?.post_url} onChange={(e) => setPost({ ...post, post_url: e.target.value })} />
                                    <Dialog.Root open={openDialog} onOpenChange={(e) => setOpenDialog(e.open)}>
                                        <Dialog.Trigger asChild>
                                            {(campaign.status != 'COMPLETED' || campaign.status === 'SUBMITTED') && (<Button disabled={loadPost ? true : false}>{post?.campaign_post_code ? '수정' : '제출'}</Button>)}
                                        </Dialog.Trigger>
                                        <Dialog.Backdrop />
                                        <Dialog.Positioner>
                                            <Dialog.Content>
                                                <Dialog.Header>
                                                    <Dialog.Title>{post?.campaign_post_code ? '리뷰 수정' : '리뷰 등록'}</Dialog.Title>
                                                </Dialog.Header>
                                                <Dialog.Body>
                                                    <Text>{post?.campaign_post_code ? '리뷰를 수정 하시겠습니까?' : '리뷰를 등록 하시겠습니까?'}</Text>
                                                </Dialog.Body>
                                                <Dialog.Footer>
                                                    <Button variant="outline" onClick={() => setOpenDialog(false)}>취소</Button>
                                                    <Button onClick={() => { submitReview(post?.campaign_post_code); setOpenDialog(false); }}>확인</Button>
                                                </Dialog.Footer>
                                            </Dialog.Content>
                                        </Dialog.Positioner>
                                    </Dialog.Root>
                                </HStack>
                                {loadPost && (campaign.status === 'SUBMITTED' || campaign.status === 'RETURNED') && <Text fontSize="xs" wordBreak="keep-all">리뷰가 제출되었습니다. 작성된 리뷰는 검토 진행되며 요청사항이 누락되었거나 해당 제품(또는 서비스)에 잘못된 정보가 있다면 수정 요청드릴 수 있습니다.</Text>}
                            </Stack>
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