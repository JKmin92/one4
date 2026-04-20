import { Button, Flex, Heading, HStack, Image, Link, Stack, Status, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../utils/api";
import { useNavigate } from "react-router-dom";
import { getDDay, formatDateToMonthDay } from "../../../../utils/simpleUtils";

function List() {

    const navigate = useNavigate();
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
            case 'COMPLETED':
                return { color: 'blue', text: '리뷰 작성 완료' };
            default:
                return 'gray';
        }
    }

    return (
        <Stack w="full" rounded="md" border="1px solid #eee" p="20px" gap="6" textAlign="left">
            <Heading fontSize="sm" textAlign="left">리뷰 캠페인</Heading>

            <Flex wrap="wrap" w="full" gap="4">
                {reviewApplicationList.map((reviewApplication) => (
                    <Stack key={reviewApplication.campaign_application_code} w={{ base: "calc(50% - 8px)", md: "calc(25% - 12px)" }} rounded="md" border="1px solid #eee" gap="0" overflow="hidden">
                        <Link href={`/mypage/review/${reviewApplication.campaign_application_code}`}>
                            <Image src={reviewApplication.main_image} alt={reviewApplication.title} />
                        </Link>
                        <Stack gap="1" p="10px">
                            <Status.Root colorPalette={getStatus(reviewApplication.status).color}>
                                <Status.Indicator />
                                <Text>{getStatus(reviewApplication.status).text}</Text>
                            </Status.Root>
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
                                {reviewApplication.status === 'SELECTED' && (
                                    <Text>{formatDateToMonthDay(reviewApplication.end_write_date).replace('.', '-')} 까지 작성</Text>
                                )}
                            </HStack>
                            <Heading fontSize="sm">{reviewApplication.title}</Heading>
                        </Stack>
                    </Stack>
                ))}

                {reviewApplicationList.length <= 0 && (
                    <Stack w="full" textAlign="center" alignItems="center" py="32">
                        <Text>리뷰 캠페인 신청 내역이 없습니다.</Text>
                        <Button onClick={() => navigate('/review')}>리뷰 캠페인</Button>
                    </Stack>

                )}
            </Flex>
        </Stack>

    )
}

export default List;