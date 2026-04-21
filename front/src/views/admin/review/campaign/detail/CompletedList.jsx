import { Accordion, Alert, Badge, Button, Checkbox, CloseButton, Dialog, Heading, HStack, Image, Link, Stack, Text, Textarea } from "@chakra-ui/react";
import { formatDateToMonthDay, formatDateYMD } from "../../../../../utils/simpleUtils";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import axiosInstance from "../../../../../utils/api";
import { toaster } from "../../../../../components/ui/toaster";

const postStatus = (status) => {
    switch (status) {
        case 'SUBMITTED':
            return { text: '제출 완료', color: 'green' };
        case 'RETURNED':
            return { text: '수정 요청', color: 'orange' };
        case 'RESUBMITTED':
            return { text: '수정 제출 완료', color: 'green' };
        case 'COMPLETED':
            return { text: '완료', color: 'blue' };
        default:
            return { text: '알 수 없음', color: 'gray' };
    }
}

function PostReview({ application, reviewCampaignChannelView, fetchReviewCampaignApplicationList }) {
    const [open, setOpen] = useState(false);
    const [updateRequest, setUpdateRequest] = useState('');
    const [updateRequestCheck, setUpdateRequestCheck] = useState(false);
    const [reviewCampaignFeedback, setReviewCampaignFeedback] = useState([]);

    useEffect(() => {
        const getReviewCampaignFeedback = async () => {
            const resource = await axiosInstance.get(`/admin/review/campaign/application/feedback/${application.campaign_application_code}`);
            if (resource.status === 200) {
                console.log(resource.data);
                setReviewCampaignFeedback(resource.data);
            }
        }
        getReviewCampaignFeedback();
    }, [application]);

    const handleUpdateRequest = async () => {
        if (updateRequestCheck) {
            if (confirm('수정 요청하시겠습니까? 요청 시 요청 사항에 대한 수정이 불가합니다.')) {
                const resource = await axiosInstance.post(`/admin/review/campaign/application/feedback/`, {
                    campaign_application_code: application.campaign_application_code,
                    request_content: updateRequest
                });
                if (resource.status === 200) {
                    toaster.create({ title: '수정 요청되었습니다.', type: 'success' });
                    setUpdateRequest('');
                    setUpdateRequestCheck(false);
                    setOpen(false);
                    if (fetchReviewCampaignApplicationList) fetchReviewCampaignApplicationList();
                }
            }
        } else {
            if (confirm('검토 완료하시겠습니까? 완료 시 수정 요청이 불가합니다.')) {
                const resource = await axiosInstance.put(`/admin/review/campaign/application/complete/${application.campaign_application_code}`);
                if (resource.status === 200) {
                    toaster.create({ title: '검토 완료되었습니다.', type: 'success' });
                    setOpen(false);
                    if (fetchReviewCampaignApplicationList) fetchReviewCampaignApplicationList();
                }
            }
        }
    }

    return (
        <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
            <Dialog.Trigger asChild>
                <Button size="sm">검토</Button>
            </Dialog.Trigger>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>리뷰 검토</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        <Stack gap="8">
                            {application.channels.map((channel, index) => {
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
                                    </Stack>
                                )
                            })}
                            {application.postList.map((post) => {
                                const post_status = postStatus(post.status);
                                return (
                                    <Stack key={post.campaign_post_code} justifyContent="space-between" direction="row" w="full" alignItems="end">
                                        <Stack alignItems="start" gap="0">
                                            <Badge colorPalette={post_status.color}>{post_status.text}</Badge>
                                            <Link href={post.post_url} target="_blank" fontSize="sm">{post.post_url}</Link>
                                        </Stack>
                                        <Stack>
                                            <Text fontSize="sm">제출일 : {formatDateYMD(post.created_at)}</Text>
                                            {post.created_at != post.resubmited_at && (
                                                <Text fontSize="sm">수정일 : {formatDateYMD(post.resubmited_at)}</Text>
                                            )}
                                        </Stack>
                                    </Stack>
                                )
                            })}

                            <Accordion.Root collapsible>
                                {reviewCampaignFeedback.map((feedback) => {
                                    return (
                                        <Accordion.Item key={feedback.campaign_feedback_code} value={String(feedback.campaign_feedback_code)}>
                                            <Accordion.ItemTrigger>
                                                {formatDateYMD(feedback.created_at)} 요청사항
                                            </Accordion.ItemTrigger>
                                            <Accordion.ItemContent>
                                                <Text fontSize="sm" marginBottom="2">{feedback.request_content}</Text>
                                            </Accordion.ItemContent>
                                        </Accordion.Item>
                                    )
                                })}
                            </Accordion.Root>

                            {(application.status == 'SUBMITTED' || application.status == 'RESUBMITTED') && (
                                <Stack gap="4">
                                    <Checkbox.Root checked={updateRequestCheck} onCheckedChange={(e) => setUpdateRequestCheck(e.checked)}>
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control />
                                        <Checkbox.Label>수정 요청</Checkbox.Label>
                                    </Checkbox.Root>
                                    {updateRequestCheck && (
                                        <Textarea value={updateRequest} onChange={(e) => setUpdateRequest(e.target.value)} w="full" minH="100px" autoresize placeholder="수정 요청 사항을 입력해주세요." />
                                    )}
                                </Stack>
                            )}
                        </Stack>
                    </Dialog.Body>
                    <Dialog.Footer>
                        {application.status == 'SUBMITTED' && (
                            <Button size="sm" onClick={handleUpdateRequest}>{updateRequestCheck ? '수정 요청' : '검토 완료'}</Button>
                        )}
                    </Dialog.Footer>
                    <Dialog.CloseTrigger asChild>
                        <CloseButton size="sm" />
                    </Dialog.CloseTrigger>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}

function CompletedList({ completedList, reviewCampaignChannelView, campaign, fetchReviewCampaignApplicationList }) {



    return (
        <Stack>
            <Text>총 {completedList.length}명의 데이터가 있습니다.</Text>
            {completedList.map((application) => (
                <Stack key={application.campaign_application_code} justifyContent="space-between" direction="row" border="1px solid" borderColor="gray.subtle" rounded="md" p="4" alignItems="center">
                    {application.channels.map((channel, index) => {
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
                            </Stack>
                        )
                    })}
                    {application.postList.map((post) => {
                        const post_status = postStatus(post.status);
                        return (
                            <Stack key={post.campaign_post_code} justifyContent="space-between" direction="row" w="2xl" alignItems="center">
                                <Stack alignItems="start" gap="0">
                                    <Badge colorPalette={post_status.color}>{post_status.text}</Badge>
                                    <Link href={post.post_url} target="_blank" fontSize="sm">{post.post_url}</Link>
                                </Stack>
                                <Stack gap="0">
                                    <Text fontSize="sm">제출일 : {formatDateYMD(post.created_at)}</Text>
                                    {(post.created_at != post.updated_at) && (
                                        <Text fontSize="sm">수정일 : {formatDateYMD(post.updated_at)}</Text>
                                    )}
                                </Stack>
                            </Stack>
                        )
                    })}
                    <PostReview application={application} reviewCampaignChannelView={reviewCampaignChannelView} fetchReviewCampaignApplicationList={fetchReviewCampaignApplicationList} />
                </Stack>
            ))}
        </Stack>
    );
}

export default CompletedList;