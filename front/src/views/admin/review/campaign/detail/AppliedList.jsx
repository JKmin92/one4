import { Badge, Box, Button, CloseButton, Dialog, Heading, HStack, Image, Link, Stack, Text } from "@chakra-ui/react";
import { Tooltip } from "../../../../../components/ui/tooltip";
import axiosInstance from "../../../../../utils/api";
import { toaster } from "../../../../../components/ui/toaster";

function AppliedList({ appliedList, reviewCampaignChannelView, campaign, fetchReviewCampaignApplicationList }) {

    const selectReviewer = async (campaign_application_code) => {
        try {
            await axiosInstance.put(`/admin/review/campaign/selectReviewer/${campaign_application_code}`);
            toaster.create({ title: '리뷰어가 선정되었습니다.', type: 'success' });
            fetchReviewCampaignApplicationList();
        } catch (error) {
            console.error("Failed to select reviewer", error);
            toaster.create({ title: '오류가 발생되었습니다.', type: 'error' });
        }
    }

    return (
        <Stack>
            <Text>총 {appliedList.length}명의 데이터가 있습니다.</Text>
            {appliedList.map((app, index) => {
                return (
                    <Stack key={index} direction="row" border="1px solid" borderColor="gray.subtle" rounded="md" p="4" alignItems="center" justifyContent="space-between">
                        {app.channels.map((channel, index) => {
                            const channelView = reviewCampaignChannelView.find((channelView) => channelView.channel_code === channel.channel_code);
                            return (
                                <Stack key={channelView.id} direction="row" alignItems="center" gap="6">
                                    <Image src={`/public/resources/img/logo/${channelView.icon}`} w="5" rounded="md" />
                                    <Image src={channel.meta_image} rounded="full" w="16" />
                                    <Stack gap="0">
                                        <Link href={channel.channel_url} target="_blank">
                                            <Heading size="md">{channel.meta_title}</Heading>
                                        </Link>
                                        <Text fontSize="sm" color="fg.muted">{channel.channel_url}</Text>
                                        <Text fontSize="sm" color="fg.muted">최근 일방문자 : 300</Text>
                                    </Stack>
                                    <Stack>
                                        <HStack>
                                            <Badge>일상</Badge>
                                            <Badge>반려동물</Badge>
                                            <Badge>리뷰</Badge>
                                        </HStack>
                                        <HStack>
                                            <Badge>남성</Badge>
                                            <Badge>30대</Badge>
                                        </HStack>
                                    </Stack>
                                </Stack>
                            )
                        })}
                        <Tooltip content="모집이 종료된 이후 선정이 가능합니다" disabled={campaign.state === 'SELECTING'}>
                            <Box display="inline-block">
                                <Dialog.Root>
                                    <Dialog.Trigger asChild>
                                        <Button colorPalette="blue" disabled={campaign.state != 'SELECTING'}>리뷰어 선정</Button>
                                    </Dialog.Trigger>
                                    <Dialog.Backdrop />
                                    <Dialog.Positioner>
                                        <Dialog.Content>
                                            <Dialog.Header>
                                                <Dialog.Title>지원자 채널 상세 정보</Dialog.Title>
                                            </Dialog.Header>
                                            <Dialog.Body>
                                                <Stack gap="6">
                                                    {app.channels.map((channel, idx) => {
                                                        const channelView = reviewCampaignChannelView.find((cv) => cv.channel_code === channel.channel_code);
                                                        return (
                                                            <Stack key={idx} direction="column" gap="4" p="4" borderWidth="1px" borderRadius="md">
                                                                <Stack direction="row" alignItems="center" gap="6">
                                                                    <Image src={`/resources/img/logo/${channelView?.icon}`} w="8" rounded="md" />
                                                                    <Image src={channel.meta_image} rounded="full" w="20" h="20" objectFit="cover" />
                                                                    <Stack gap="1">
                                                                        <Link href={channel.channel_url} target="_blank">
                                                                            <Heading size="md">{channel.meta_title || channel.channel_url}</Heading>
                                                                        </Link>
                                                                        <Text fontSize="sm" color="fg.muted">{channel.channel_url}</Text>
                                                                        <Text fontSize="sm" color="fg.muted">최근 일방문자 : 300</Text>
                                                                    </Stack>
                                                                </Stack>
                                                                <Stack>
                                                                    <HStack>
                                                                        <Badge>일상</Badge>
                                                                        <Badge>반려동물</Badge>
                                                                        <Badge>리뷰</Badge>
                                                                    </HStack>
                                                                    <HStack>
                                                                        <Badge>남성</Badge>
                                                                        <Badge>30대</Badge>
                                                                    </HStack>
                                                                </Stack>
                                                            </Stack>
                                                        )
                                                    })}
                                                </Stack>
                                            </Dialog.Body>
                                            <Dialog.Footer>
                                                <Button colorPalette="blue" w="full" onClick={() => selectReviewer(app.campaign_application_code)}>리뷰어 선정하기</Button>
                                            </Dialog.Footer>
                                            <Dialog.CloseTrigger asChild>
                                                <CloseButton size="sm" position="absolute" top="2" right="2" />
                                            </Dialog.CloseTrigger>
                                        </Dialog.Content>
                                    </Dialog.Positioner>
                                </Dialog.Root>
                            </Box>
                        </Tooltip>
                    </Stack>
                )
            })}
        </Stack>
    )
}

export default AppliedList;