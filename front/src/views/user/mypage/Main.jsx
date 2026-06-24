import { Alert, Box, Button, Heading, HStack, Image, Link, Stack, StackSeparator, Status, Text } from "@chakra-ui/react";
import { formatDate, formatDateToMonthDay, formatNumber, getProductOrderStatus, getReviewCampaignApplicationStatus } from "../../../utils/simpleUtils";
import { LuChevronRight } from "react-icons/lu";
import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/api";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { toaster } from "../../../components/ui/toaster";
import { useAuth } from "../../../utils/useAuth";
import { useNavigate } from "react-router-dom";

function Main() {

    const [reviewCampaignApplicationList, setReviewCampaignApplicationList] = useState([]);
    const [reviewCampaignChannelView, setReviewCampaignChannelView] = useState([]);
    const [noWriteReviewCampaignList, setNoWriteReviewCampaignList] = useState([]);
    const [productOrderList, setProductOrderList] = useState([]);
    const { user } = useAuth();
    const [userPoint, setUserPoint] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const getReviewCampaignApplicationList = async () => {
            const res = await axiosInstance.get('/review/campaign/user/application');
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

            const noWriteData = res.data.filter(item => {
                if (item.status === 'RETURNED') return true;
                if (item.status === 'SELECTED') {
                    const endWriteTime = new Date(item.end_write_date).getTime();
                    return now > endWriteTime;
                }
                return false;
            });
            setNoWriteReviewCampaignList(noWriteData);
        }

        const getProductOrderList = async () => {
            try {
                const res = await axiosInstance.get(`/shop/product/order/list`);
                if (res.status === 200) {
                    const now = new Date().getTime();
                    const filteredOrders = res.data.filter(item => {
                        if (item.status === 'COMPLETED') {
                            if (!item.completed_at) return false;
                            const completedTime = new Date(item.completed_at).getTime();
                            const diffDays = (now - completedTime) / (1000 * 60 * 60 * 24);
                            return diffDays <= 7;
                        }
                        if (item.status === 'CANCEL') {
                            if (!item.canceled_at) return false;
                            const canceledTime = new Date(item.canceled_at).getTime();
                            const diffDays = (now - canceledTime) / (1000 * 60 * 60 * 24);
                            return diffDays <= 7;
                        }
                        return true;
                    });
                    setProductOrderList(filteredOrders);
                }
            } catch {
                toaster.create({ title: '오류가 발행했습니다.', type: 'error' });
            }
        }

        const getReviewCampaignChannelView = async () => {
            const resource = await axiosInstance.get(`/review/campaign/channel`);
            if (resource.status === 200) {
                setReviewCampaignChannelView(resource.data);
            }
        }

        const getUserPoint = async () => {
            try {
                const resource = await axiosInstance.get(`/user/point`);
                if (resource.status === 200) {
                    setUserPoint(resource.data);
                }
            } catch {
                toaster.create({ title: '오류가 발생했습니다.', type: 'error' });
            }
        }

        getReviewCampaignApplicationList();
        getReviewCampaignChannelView();
        getProductOrderList();
        getUserPoint();
    }, []);

    const swiperSet = {
        slidesPerView: 1,
        pagination: { clickable: true },
        modules: [Pagination]
    }


    return (
        <Stack w="full" minW="0" rounded="md" border="1px solid #eee" p="20px" gap="6" textAlign="left">
            {noWriteReviewCampaignList.length > 0 && (
                <Box w="full" overflow="hidden">
                    <Swiper {...swiperSet}>
                        {noWriteReviewCampaignList.map(application => {
                            return (
                                <Alert.Root status="error" alignItems="center">
                                    <Alert.Indicator />
                                    <Alert.Content gap="1">
                                        <Alert.Title fontSize="md">{application.title} {application.status === 'SELECTED' ? '미작성' : '수정 요청'}</Alert.Title>
                                        <Alert.Description fontSize="xs">
                                            {application.status === 'SELECTED' ? (`${formatDateToMonthDay(application.end_write_date)}까지 작성 예정인 리뷰가 아직 미작성 상태입니다.`) :
                                                (`작성하신 리뷰에 대한 수정 요청사항이 있습니다.`)}
                                        </Alert.Description>
                                    </Alert.Content>
                                    <Link href="#">{application.status === 'SELECTED' ? '리뷰 작성하기' : '수정 요청 확인하기'}</Link>
                                </Alert.Root>
                            )
                        })}
                    </Swiper>
                </Box>
            )}

            <Link display="flex" justifyContent="space-between" p="5" bg="blue.solid" w="full" color="#fff" rounded="md" href="/mypage/point">
                <HStack>
                    <Text fontSize="xs">포인트</Text>
                    <Text fontSize="lg">{formatNumber(userPoint?.current_point ?? 0)}</Text>
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
                                                                return channelView ? (<Image key={channelView.id} src={`/public/resources/img/logo/${channelView?.icon}`} w="5" rounded="md" />) : '';
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
                                            <Button size="xs" variant="outline" onClick={() => navigate(`/mypage/review/${application.campaign_application_code}`)}>자세히 보기</Button>
                                        </Stack>
                                    </SwiperSlide>
                                )
                            })}
                        </Swiper>
                    </Box>
                </Stack>
            )}

            {productOrderList.length > 0 && (
                <Stack w="full" gap="0">
                    <Heading fontSize="sm" textAlign="left">구매한 상품({productOrderList.length})</Heading>
                    <Box w="full" overflow="hidden" pb="6" css={{ '& .swiper-pagination': { bottom: '0' } }}>
                        <Swiper {...swiperSet}>
                            {productOrderList.map(order => {
                                const orderStatusView = getProductOrderStatus(order.status);
                                return (
                                    <SwiperSlide key={order.order_code}>
                                        <Stack direction="row" w="full" justifyContent="space-between" alignItems="end">
                                            <Stack direction="row" gap="6">
                                                <Image src={order.product_order_items[0].image_url} w="100px" rounded="md" />
                                                <Stack textAlign="left" fontSize="sm">
                                                    <Status.Root colorPalette={orderStatusView.color}>
                                                        <Status.Indicator /> {orderStatusView.text}
                                                    </Status.Root>
                                                    <Text>{`${order.product_order_items[0].product_name} ${order.product_order_items.length > 1 ? `외 ${order.product_order_items.length - 1}개` : ''}`}</Text>
                                                </Stack>
                                            </Stack>
                                            <Button size="xs" variant="outline" onClick={() => navigate(`/mypage/order/${order.order_code}`)}>자세히 보기</Button>
                                        </Stack>
                                    </SwiperSlide>
                                )
                            })}
                        </Swiper>
                    </Box>

                </Stack>
            )}

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