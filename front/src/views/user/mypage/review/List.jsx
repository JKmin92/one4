import { Button, Flex, Heading, HStack, Image, Link, Stack, Status, Text, Tabs } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../utils/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getDDay, formatDateToMonthDay } from "../../../../utils/simpleUtils";

function List() {

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const defaultTab = searchParams.get('tab') || 'all';

    const [reviewApplicationList, setReviewApplicationList] = useState([]);
    const [reviewCampaignChannelView, setReviewCampaignChannelView] = useState([]);

    useEffect(() => {
        const getReviewApplicationList = async () => {
            const resource = await axiosInstance.get(`/review/campaign/user/application`);
            if (resource.status === 200) {
                setReviewApplicationList(resource.data);
            }
        }

        const getReviewCampaignChannelView = async () => {
            const resource = await axiosInstance.get(`/review/campaign/channel`);
            if (resource.status === 200) {
                setReviewCampaignChannelView(resource.data);
            }
        }
        getReviewApplicationList();
        getReviewCampaignChannelView();
    }, []);

    const getStatus = (status) => {
        switch (status) {
            case 'APPLIED':
                return { color: 'green', text: '신청 완료' };
            case 'SELECTED':
                return { color: 'blue', text: '선정 완료, 작성 및 서비스 이용 중' };
            case 'REJECTED':
                return { color: 'red', text: '미선정' };
            case 'CANCELLED':
                return { color: 'gray', text: '취소됨' };
            case 'SUBMITTED':
                return { color: 'blue', text: '리뷰 작성 완료' };
            case 'RETURNED':
                return { color: 'orange', text: '수정요청됨' };
            case 'COMPLETED':
                return { color: 'blue', text: '리뷰캠페인 완료' };
            default:
                return { color: 'gray', text: status };
        }
    }

    const filteredList = reviewApplicationList.filter(app => {
        if (defaultTab === 'all') return true;
        if (defaultTab === 'applied') return app.status === 'APPLIED';
        if (defaultTab === 'writing') return app.status === 'SELECTED' && new Date() <= new Date(app.end_write_date);
        if (defaultTab === 'unwritten') return app.status === 'SELECTED' && new Date() > new Date(app.end_write_date);
        if (defaultTab === 'returned') return app.status === 'RETURNED';
        if (defaultTab === 'rejected') return app.status === 'REJECTED' || app.status === 'CANCELLED';
        if (defaultTab === 'completed') return app.status === 'SUBMITTED' || app.status === 'COMPLETED';
        return true;
    });

    const handleTabChange = (details) => {
        setSearchParams({ tab: details.value });
    };

    const counts = {
        applied: reviewApplicationList.filter(app => app.status === 'APPLIED').length,
        writing: reviewApplicationList.filter(app => app.status === 'SELECTED' && new Date() <= new Date(app.end_write_date)).length,
        unwritten: reviewApplicationList.filter(app => app.status === 'SELECTED' && new Date() > new Date(app.end_write_date)).length,
        returned: reviewApplicationList.filter(app => app.status === 'RETURNED').length,
        completed: reviewApplicationList.filter(app => app.status === 'SUBMITTED' || app.status === 'COMPLETED').length
    };

    return (
        <Stack w="full" rounded="md" border="1px solid #eee" p="20px" gap="6" textAlign="left">
            <Heading fontSize="sm" textAlign="left">리뷰 캠페인</Heading>

            <Tabs.Root value={defaultTab} onValueChange={handleTabChange} variant="enclosed">
                <Tabs.List>
                    <Tabs.Trigger value="all">전체</Tabs.Trigger>
                    <Tabs.Trigger value="applied">신청({counts.applied})</Tabs.Trigger>
                    <Tabs.Trigger value="writing">작성중({counts.writing})</Tabs.Trigger>
                    <Tabs.Trigger value="unwritten">미작성(기한초과)({counts.unwritten})</Tabs.Trigger>
                    <Tabs.Trigger value="returned">수정({counts.returned})</Tabs.Trigger>
                    <Tabs.Trigger value="completed">작성완료({counts.completed})</Tabs.Trigger>
                    <Tabs.Trigger value="rejected">미선정</Tabs.Trigger>
                </Tabs.List>
            </Tabs.Root>

            <Flex wrap="wrap" w="full" gap="4">
                {filteredList.map((reviewApplication) => (
                    <Stack key={reviewApplication.campaign_application_code} w={{ base: "calc(50% - 8px)", md: "calc(25% - 12px)" }} rounded="md" border="1px solid #eee" gap="0" overflow="hidden">
                        <Link href={`/mypage/review/${reviewApplication.campaign_application_code}`}>
                            <Image src={reviewApplication.main_image} alt={reviewApplication.title} />
                        </Link>
                        <Stack gap="1" p="10px">
                            <Status.Root colorPalette={getStatus(reviewApplication.status).color}>
                                <Status.Indicator />
                                <Text>{getStatus(reviewApplication.status).text}</Text>
                            </Status.Root>
                            {(reviewApplication.status === 'APPLIED' || reviewApplication.status === 'SELECTED' || reviewApplication.status === 'RETURNED') && (
                                <HStack>
                                    <HStack>
                                        {reviewApplication.channels.map((channel, index) => {
                                            const channelView = reviewCampaignChannelView.find((channelView) => channelView.channel_code === channel.channel_code);
                                            return channelView ? (<Image key={channelView.id} src={`/public/resources/img/logo/${channelView.icon}`} w="5" rounded="md" />) : '';
                                        })}
                                    </HStack>
                                    {reviewApplication.status === 'APPLIED' && (
                                        <Text>{formatDateToMonthDay(reviewApplication.reviewer_selection_date).replace('.', '-')} 선정 예정</Text>
                                    )}
                                    {(reviewApplication.status === 'SELECTED' || reviewApplication.status === 'RETURNED') && (
                                        <Text>{formatDateToMonthDay(reviewApplication.end_write_date).replace('.', '-')} 까지 작성</Text>
                                    )}
                                </HStack>
                            )}
                            <HStack>
                                {(reviewApplication.status === 'SUBMITTED' || reviewApplication.status === 'COMPLETED') && (
                                    <HStack>
                                        {reviewApplication.channels.map((channel, index) => {
                                            const channelView = reviewCampaignChannelView.find((channelView) => channelView.channel_code === channel.channel_code);
                                            return channelView ? (<Image key={channelView.id} src={`/public/resources/img/logo/${channelView.icon}`} w="5" rounded="md" />) : '';
                                        })}
                                    </HStack>
                                )}
                                <Heading fontSize="sm" truncate>{reviewApplication.title}</Heading>
                            </HStack>
                        </Stack>
                    </Stack>
                ))}

                {filteredList.length <= 0 && (
                    <Stack w="full" textAlign="center" alignItems="center" py="32">
                        <Text>해당하는 리뷰 캠페인 내역이 없습니다.</Text>
                        <Button onClick={() => navigate('/review')}>리뷰 캠페인 보러가기</Button>
                    </Stack>
                )}
            </Flex>
        </Stack>
    )
}

export default List;