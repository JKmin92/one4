import { Alert, Box, Button, Heading, HStack, Image, Link, Stack, StackSeparator, Status, Text } from "@chakra-ui/react";
import { formatNumber, getReviewCampaignApplicationStatus } from "../../../utils/simpleUtils";
import { LuChevronRight } from "react-icons/lu";
import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/api";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

function Main() {

    const [reviewCampaignApplicationList, setReviewCampaignApplicationList] = useState([]);
    const [reviewCampaignChannelView, setReviewCampaignChannelView] = useState([]);

    useEffect(() => {
        const getReviewCampaignApplicationList = async () => {
            const res = await axiosInstance.get('/review/campaign/user/application');
            console.log(res.data);
            const targetStatuses = ['APPLIED', 'SELECTED', 'SUBMITTED', 'RETURNED'];
            const now = new Date().getTime();

            const filteredData = res.data.filter(item => {
                if (targetStatuses.includes(item.status)) return true;
                if (item.status === 'COMPLETED') {
                    const updatedTime = new Date(item.updated_at).getTime();
                    const diffDays = (now - updatedTime) / (1000 * 60 * 60 * 24);
                    return diffDays <= 7;
                }
                return false;
            });
            setReviewCampaignApplicationList(filteredData);
        }

        const getReviewCampaignChannelView = async () => {
            const resource = await axiosInstance.get(`/review/campaign/channel`);
            if (resource.status === 200) {
                setReviewCampaignChannelView(resource.data);
            }
        }

        getReviewCampaignApplicationList();
        getReviewCampaignChannelView();
    }, []);

    const swiperSet = {
        slidesPerView: 1,
        pagination: { clickable: true },
        modules: [Pagination]
    }


    return (
        <Stack w="full" minW="0" rounded="md" border="1px solid #eee" p="20px" gap="6" textAlign="left">
            <Alert.Root status="error" alignItems="center">
                <Alert.Indicator />
                <Alert.Content gap="1">
                    <Alert.Title fontSize="md">와바미 뷰티 리뷰 캠페인 미작성</Alert.Title>
                    <Alert.Description fontSize="xs">3월 31일까지 작성 예정인 리뷰가 아직 미작성 상태입니다.</Alert.Description>
                </Alert.Content>
                <Link href="#">리뷰 작성하기</Link>
            </Alert.Root>
            <Link display="flex" justifyContent="space-between" p="5" bg="blue.solid" w="full" color="#fff" rounded="md">
                <HStack>
                    <Text fontSize="xs">포인트</Text>
                    <Text fontSize="lg">{formatNumber(10000)}</Text>
                    <Text fontSize="xs">p</Text>
                </HStack>
                <LuChevronRight size="20" />
            </Link>
            {reviewCampaignApplicationList.length > 0 && (
                <Stack w="full" gap="4" minW="0">
                    <Heading fontSize="sm" textAlign="left">진행중인 리뷰 캠페인({reviewCampaignApplicationList.length})</Heading>
                    <Box w="full" overflow="hidden" pb="6" css={{ '& .swiper-pagination': { bottom: '0' } }}>
                        <Swiper {...swiperSet}>
                            {reviewCampaignApplicationList.map(application => {
                                const applicationStatusView = getReviewCampaignApplicationStatus(application.status);
                                return (
                                    <SwiperSlide key={application.id}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="end">
                                            <Stack direction="row" gap="6">
                                                <Image src={application.main_image} w="100px" rounded="md" />
                                                <Stack textAlign="left" fontSize="sm">
                                                    <Status.Root colorPalette={applicationStatusView.color}>
                                                        <Status.Indicator /> {applicationStatusView.text}
                                                    </Status.Root>
                                                    <HStack>
                                                        <HStack>
                                                            {application.channels.map((channel, index) => {
                                                                const channelView = reviewCampaignChannelView.find((channelView) => channelView.channel_code === channel.channel_code);
                                                                return channelView ? (<Image key={channelView.id} src={`/public/resources/img/logo/${channelView.icon}`} w="5" rounded="md" />) : '';
                                                            })}
                                                        </HStack>
                                                        <Text>{application.title}</Text>
                                                    </HStack>
                                                    <HStack>
                                                        {application.rewards.map(reward => {
                                                            if (reward.reward_type === 'PRODUCT') {
                                                                return (<Text color="fg.muted" key={reward.reward_code}>{reward.name} {reward.quantity}개</Text>)
                                                            }
                                                        })}
                                                    </HStack>
                                                </Stack>
                                            </Stack>
                                            <Button size="xs" variant="outline">자세히 보기</Button>
                                        </Stack>
                                    </SwiperSlide>
                                )
                            })}
                        </Swiper>
                    </Box>
                </Stack>
            )}

            <Stack w="full" gap="0">
                <Heading fontSize="sm" textAlign="left">구매한 상품(2)</Heading>
                <Stack direction="row" w="full" justifyContent="space-between" alignItems="end">
                    <Stack direction="row" gap="6">
                        <Box w="100px" h="100px" bg="gray.200" rounded="md"></Box>
                        <Stack textAlign="left" fontSize="sm">
                            <Status.Root colorPalette="blue">
                                <Status.Indicator /> 결제 완료
                            </Status.Root>
                            <Text>상품 제목</Text>
                            <Text color="fg.muted">옵션 : 21호</Text>
                        </Stack>
                    </Stack>
                    <Button size="xs" variant="outline">자세히 보기</Button>
                </Stack>
            </Stack>
            <Stack separator={<StackSeparator />}>
                <Link href="#" display="flex" justifyContent="space-between" w="full">
                    <Stack>
                        <Text fontSize="sm">상품 주문 내역</Text>
                    </Stack>
                    <LuChevronRight size="18" />
                </Link>
                <Link href="#" display="flex" justifyContent="space-between" w="full">
                    <Stack>
                        <Text fontSize="sm">취소/반품/교환 내역</Text>
                    </Stack>
                    <LuChevronRight size="18" />
                </Link>
                <Link href="#" display="flex" justifyContent="space-between" w="full">
                    <Stack>
                        <Text fontSize="sm">최근 본 상품</Text>
                    </Stack>
                    <LuChevronRight size="18" />
                </Link>
                <Link href="#" display="flex" justifyContent="space-between" w="full">
                    <Stack>
                        <Text fontSize="sm">리뷰 캠페인 리스트</Text>
                    </Stack>
                    <LuChevronRight size="18" />
                </Link>
            </Stack>
        </Stack>
    )
}

export default Main;